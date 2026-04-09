import { handleCors, corsHeaders } from '../_shared/cors.ts';
import { createSupabaseClient, createAdminClient, getUser, jsonResponse, errorResponse } from '../_shared/supabase.ts';

Deno.serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const url = new URL(req.url);
  const path = url.pathname.replace('/auth', '').replace(/^\//, '');

  try {
    // POST /auth/login
    if (path === 'login' && req.method === 'POST') {
      const { legajo, password } = await req.json();
      if (!legajo || !password) {
        return errorResponse('Legajo y contraseña requeridos', 'VALIDATION_ERROR');
      }

      // Lookup email by legajo
      const admin = createAdminClient();
      const { data: profile } = await admin
        .from('profiles')
        .select('id')
        .eq('legajo', legajo)
        .single();

      if (!profile) {
        return errorResponse('Legajo no encontrado', 'AUTH_ERROR', 401);
      }

      // Get user email from auth
      const { data: { user: authUser } } = await admin.auth.admin.getUserById(profile.id);
      if (!authUser?.email) {
        return errorResponse('Usuario sin email configurado', 'AUTH_ERROR', 401);
      }

      // Sign in with email + password
      const client = createSupabaseClient(req);
      const { data: session, error } = await client.auth.signInWithPassword({
        email: authUser.email,
        password,
      });

      if (error) {
        return errorResponse('Credenciales invalidas', 'AUTH_ERROR', 401);
      }

      // Fetch profile data
      const { data: userProfile } = await client
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return jsonResponse({
        token: session.session.access_token,
        refreshToken: session.session.refresh_token,
        user: {
          id: userProfile.id,
          legajo: userProfile.legajo,
          nombre: userProfile.nombre,
          apellido: userProfile.apellido,
          categoria: userProfile.categoria,
          mina: userProfile.mina,
          empresa: userProfile.empresa,
          avatarUrl: userProfile.avatar_url,
          antiguedad: userProfile.antiguedad,
        },
      });
    }

    // GET /auth/profile
    if (path === 'profile' && req.method === 'GET') {
      const { client, user } = await getUser(req);
      const { data: profile } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) {
        return errorResponse('Perfil no encontrado', 'NOT_FOUND', 404);
      }

      return jsonResponse({
        id: profile.id,
        legajo: profile.legajo,
        nombre: profile.nombre,
        apellido: profile.apellido,
        categoria: profile.categoria,
        mina: profile.mina,
        empresa: profile.empresa,
        avatarUrl: profile.avatar_url,
        antiguedad: profile.antiguedad,
      });
    }

    // POST /auth/logout
    if (path === 'logout' && req.method === 'POST') {
      const client = createSupabaseClient(req);
      await client.auth.signOut();
      return jsonResponse({ success: true });
    }

    // POST /auth/refresh
    if (path === 'refresh' && req.method === 'POST') {
      const { refreshToken } = await req.json();
      const client = createSupabaseClient(req);
      const { data, error } = await client.auth.refreshSession({ refresh_token: refreshToken });

      if (error) {
        return errorResponse('Token expirado', 'AUTH_ERROR', 401);
      }

      return jsonResponse({
        token: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
      });
    }

    return errorResponse('Ruta no encontrada', 'NOT_FOUND', 404);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno';
    return errorResponse(message, 'INTERNAL_ERROR', 500);
  }
});
