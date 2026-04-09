import { handleCors } from '../_shared/cors.ts';
import { getUser, jsonResponse, errorResponse } from '../_shared/supabase.ts';

Deno.serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const url = new URL(req.url);
  const path = url.pathname.replace('/career', '').replace(/^\//, '');

  try {
    const { client, user } = await getUser(req);

    // GET /career/summary
    if (path === 'summary' && req.method === 'GET') {
      const [
        { data: career },
        { data: certs },
        { data: courseProgress },
      ] = await Promise.all([
        client.from('career_profiles').select('*').eq('user_id', user.id).single(),
        client.from('certificates').select('*').eq('user_id', user.id),
        client.from('course_progress').select('*, course:courses(*)').eq('user_id', user.id),
      ]);

      // Build ranking (top 10 by XP)
      const { data: allCareers } = await client
        .from('career_profiles')
        .select('user_id, xp_current, profiles(nombre, apellido)')
        .order('xp_current', { ascending: false })
        .limit(10);

      const ranking = (allCareers ?? []).map((c: Record<string, unknown>, i: number) => {
        const profile = c.profiles as Record<string, unknown> | null;
        return {
          position: i + 1,
          name: c.user_id === user.id ? 'TU' : `${(profile?.nombre as string ?? '').charAt(0)}. ${(profile?.apellido as string ?? '').charAt(0)}.`,
          xp: c.xp_current,
          isCurrentUser: c.user_id === user.id,
        };
      });

      return jsonResponse({
        level: career?.level ?? '',
        nextLevel: career?.next_level ?? '',
        xpCurrent: career?.xp_current ?? 0,
        xpRequired: career?.xp_required ?? 1000,
        xpPercent: career ? Math.round((career.xp_current / career.xp_required) * 100) : 0,
        certificatesNeeded: career?.certificates_needed ?? 0,
        positionChange: career?.position_change ?? 0,
        certificates: (certs ?? []).map((c: Record<string, unknown>) => ({
          id: c.id, name: c.name, issuedBy: c.issued_by, date: c.date,
          expiresAt: c.expires_at, status: c.status, progress: c.progress, xpReward: c.xp_reward,
        })),
        courses: (courseProgress ?? []).map((cp: Record<string, unknown>) => {
          const course = cp.course as Record<string, unknown>;
          return {
            id: course.id, name: course.name, hours: course.hours, xpReward: course.xp_reward,
            difficulty: course.difficulty, type: course.type, validity: course.validity,
            progress: cp.progress, completed: cp.completed,
          };
        }),
        ranking,
      });
    }

    // POST /career/courses/:courseId/start
    const startMatch = path.match(/^courses\/([^/]+)\/start$/);
    if (startMatch && req.method === 'POST') {
      const courseId = startMatch[1];

      const { error } = await client.from('course_progress').upsert({
        user_id: user.id,
        course_id: courseId,
        progress: 0,
        completed: false,
      }, { onConflict: 'user_id,course_id' });

      if (error) return errorResponse(error.message, 'COURSE_START_ERROR');
      return jsonResponse({ success: true });
    }

    // POST /career/courses/:courseId/complete-module
    const moduleMatch = path.match(/^courses\/([^/]+)\/complete-module$/);
    if (moduleMatch && req.method === 'POST') {
      const courseId = moduleMatch[1];

      const { data: cp } = await client
        .from('course_progress')
        .select('progress')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      const newProgress = Math.min((cp?.progress ?? 0) + 20, 100);
      const completed = newProgress >= 100;

      await client.from('course_progress').update({
        progress: newProgress,
        completed,
      }).eq('user_id', user.id).eq('course_id', courseId);

      // Award XP if completed
      if (completed) {
        const { data: course } = await client.from('courses').select('xp_reward').eq('id', courseId).single();
        if (course) {
          await client.from('career_profiles').update({
            xp_current: client.rpc('career_profiles.xp_current + $1', [course.xp_reward]),
          }).eq('user_id', user.id);
        }
      }

      return jsonResponse({ progress: newProgress, completed });
    }

    // GET /career/ranking
    if (path === 'ranking' && req.method === 'GET') {
      const { data: allCareers } = await client
        .from('career_profiles')
        .select('user_id, xp_current, profiles(nombre, apellido)')
        .order('xp_current', { ascending: false })
        .limit(20);

      const ranking = (allCareers ?? []).map((c: Record<string, unknown>, i: number) => {
        const profile = c.profiles as Record<string, unknown> | null;
        return {
          position: i + 1,
          name: c.user_id === user.id ? 'TU' : `${(profile?.nombre as string ?? '').charAt(0)}. ${(profile?.apellido as string ?? '').charAt(0)}.`,
          xp: c.xp_current,
          isCurrentUser: c.user_id === user.id,
        };
      });

      return jsonResponse(ranking);
    }

    // GET /career/certificates
    if (path === 'certificates' && req.method === 'GET') {
      const { data: certs } = await client.from('certificates').select('*').eq('user_id', user.id);

      return jsonResponse((certs ?? []).map((c: Record<string, unknown>) => ({
        id: c.id, name: c.name, issuedBy: c.issued_by, date: c.date,
        expiresAt: c.expires_at, status: c.status, progress: c.progress, xpReward: c.xp_reward,
      })));
    }

    // GET /career/courses
    if (path === 'courses' && req.method === 'GET') {
      const { data: courseProgress } = await client
        .from('course_progress')
        .select('*, course:courses(*)')
        .eq('user_id', user.id);

      return jsonResponse((courseProgress ?? []).map((cp: Record<string, unknown>) => {
        const course = cp.course as Record<string, unknown>;
        return {
          id: course.id, name: course.name, hours: course.hours, xpReward: course.xp_reward,
          difficulty: course.difficulty, type: course.type, validity: course.validity,
          progress: cp.progress, completed: cp.completed,
        };
      }));
    }

    return errorResponse('Ruta no encontrada', 'NOT_FOUND', 404);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno';
    const status = message === 'No autorizado' ? 401 : 500;
    return errorResponse(message, status === 401 ? 'AUTH_ERROR' : 'INTERNAL_ERROR', status);
  }
});
