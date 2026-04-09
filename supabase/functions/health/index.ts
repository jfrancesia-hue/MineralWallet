import { handleCors } from '../_shared/cors.ts';
import { getUser, jsonResponse, errorResponse } from '../_shared/supabase.ts';

Deno.serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const url = new URL(req.url);
  const path = url.pathname.replace('/health', '').replace(/^\//, '');

  try {
    const { client, user } = await getUser(req);

    // GET /health/summary
    if (path === 'summary' && req.method === 'GET') {
      const [
        { data: profile },
        { data: exams },
      ] = await Promise.all([
        client.from('health_profiles').select('*').eq('user_id', user.id).single(),
        client.from('medical_exams').select('*').eq('user_id', user.id).order('date', { ascending: true }),
      ]);

      return jsonResponse({
        fatigueLevel: profile?.fatigue_level ?? 'optimo',
        readinessScore: profile?.readiness_score ?? 0,
        sleepHours: Number(profile?.sleep_hours ?? 0),
        shiftLoad: profile?.shift_load ?? 'Normal',
        hydrationCurrent: profile?.hydration_current ?? 0,
        hydrationGoal: profile?.hydration_goal ?? 4000,
        hydrationPercent: profile ? Math.round((profile.hydration_current / profile.hydration_goal) * 100) : 0,
        temperature: Number(profile?.temperature ?? 36.5),
        aptoVigente: profile?.apto_vigente ?? '',
        metrics: {
          heartRate: profile?.heart_rate ?? 0,
          steps: profile?.steps ?? 0,
          deepSleep: Number(profile?.deep_sleep ?? 0),
          sleepQuality: profile?.sleep_quality ?? '',
        },
        moodToday: profile?.mood_today,
        daysAwayFromHome: profile?.days_away_from_home ?? 0,
        daysUntilReturn: profile?.days_until_return ?? 0,
        medicalExams: (exams ?? []).map((e: Record<string, unknown>) => ({
          id: e.id, type: e.type, date: e.date, location: e.location,
          status: e.status, result: e.result, preparation: e.preparation,
        })),
      });
    }

    // POST /health/hydration
    if (path === 'hydration' && req.method === 'POST') {
      const { amount = 250 } = await req.json();

      // Log the hydration event
      await client.from('health_logs').insert({
        user_id: user.id,
        type: 'hydration',
        data: { amount },
      });

      // Update health profile
      const { data: profile } = await client.from('health_profiles').select('hydration_current, hydration_goal').eq('user_id', user.id).single();
      if (profile) {
        const newCurrent = Math.min(profile.hydration_current + amount, profile.hydration_goal);
        await client.from('health_profiles').update({ hydration_current: newCurrent }).eq('user_id', user.id);
      }

      return jsonResponse({ success: true });
    }

    // POST /health/mood
    if (path === 'mood' && req.method === 'POST') {
      const { mood, note } = await req.json();

      await client.from('health_logs').insert({
        user_id: user.id,
        type: 'mood',
        data: { mood, note },
      });

      await client.from('health_profiles').update({ mood_today: mood }).eq('user_id', user.id);

      return jsonResponse({ success: true });
    }

    // PATCH /health/metrics
    if (path === 'metrics' && req.method === 'PATCH') {
      const metrics = await req.json();
      const updateData: Record<string, unknown> = {};
      if (metrics.heartRate !== undefined) updateData.heart_rate = metrics.heartRate;
      if (metrics.steps !== undefined) updateData.steps = metrics.steps;
      if (metrics.deepSleep !== undefined) updateData.deep_sleep = metrics.deepSleep;
      if (metrics.sleepQuality !== undefined) updateData.sleep_quality = metrics.sleepQuality;

      await client.from('health_profiles').update(updateData).eq('user_id', user.id);

      await client.from('health_logs').insert({
        user_id: user.id,
        type: 'metrics',
        data: metrics,
      });

      return jsonResponse({ success: true });
    }

    // GET /health/exams
    if (path === 'exams' && req.method === 'GET') {
      const { data: exams } = await client
        .from('medical_exams')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      return jsonResponse((exams ?? []).map((e: Record<string, unknown>) => ({
        id: e.id, type: e.type, date: e.date, location: e.location,
        status: e.status, result: e.result, preparation: e.preparation,
      })));
    }

    return errorResponse('Ruta no encontrada', 'NOT_FOUND', 404);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno';
    const status = message === 'No autorizado' ? 401 : 500;
    return errorResponse(message, status === 401 ? 'AUTH_ERROR' : 'INTERNAL_ERROR', status);
  }
});
