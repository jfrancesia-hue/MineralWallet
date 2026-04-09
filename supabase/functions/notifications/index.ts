import { handleCors } from '../_shared/cors.ts';
import { getUser, jsonResponse, errorResponse } from '../_shared/supabase.ts';

Deno.serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const url = new URL(req.url);
  const path = url.pathname.replace('/notifications', '').replace(/^\//, '');

  try {
    const { client, user } = await getUser(req);

    // GET /notifications?page=1&pageSize=30
    if ((path === '' || path === '/') && req.method === 'GET') {
      const page = parseInt(url.searchParams.get('page') ?? '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') ?? '30');
      const offset = (page - 1) * pageSize;

      const { data: notifs, count } = await client
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      return jsonResponse({
        data: (notifs ?? []).map((n: Record<string, unknown>) => ({
          id: n.id, title: n.title, description: n.description,
          category: n.category, timestamp: new Date(n.created_at as string).getTime(),
          read: n.read, actionRoute: n.action_route,
        })),
        total: count ?? 0,
        page,
        pageSize,
        hasMore: offset + pageSize < (count ?? 0),
      });
    }

    // GET /notifications/unread-count
    if (path === 'unread-count' && req.method === 'GET') {
      const { count } = await client
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      return jsonResponse({ unreadCount: count ?? 0 });
    }

    // PATCH /notifications/:notificationId/read
    const readMatch = path.match(/^([^/]+)\/read$/);
    if (readMatch && req.method === 'PATCH') {
      const notifId = readMatch[1];
      const { error } = await client
        .from('notifications')
        .update({ read: true })
        .eq('id', notifId)
        .eq('user_id', user.id);

      if (error) return errorResponse(error.message, 'NOTIFICATION_ERROR');
      return jsonResponse({ success: true });
    }

    // POST /notifications/read-all
    if (path === 'read-all' && req.method === 'POST') {
      await client
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      return jsonResponse({ success: true });
    }

    // POST /notifications/push-token
    if (path === 'push-token' && req.method === 'POST') {
      const { token, platform } = await req.json();

      const { error } = await client.from('push_tokens').upsert({
        user_id: user.id,
        token,
        platform,
      }, { onConflict: 'user_id,token' });

      if (error) return errorResponse(error.message, 'PUSH_TOKEN_ERROR');
      return jsonResponse({ success: true });
    }

    return errorResponse('Ruta no encontrada', 'NOT_FOUND', 404);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno';
    const status = message === 'No autorizado' ? 401 : 500;
    return errorResponse(message, status === 401 ? 'AUTH_ERROR' : 'INTERNAL_ERROR', status);
  }
});
