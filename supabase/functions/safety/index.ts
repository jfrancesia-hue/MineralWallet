import { handleCors } from '../_shared/cors.ts';
import { getUser, jsonResponse, errorResponse } from '../_shared/supabase.ts';

Deno.serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const url = new URL(req.url);
  const path = url.pathname.replace('/safety', '').replace(/^\//, '');

  try {
    const { client, user } = await getUser(req);

    // GET /safety/summary
    if (path === 'summary' && req.method === 'GET') {
      const [
        { data: profile },
        { data: contacts },
        { data: todayTalk },
      ] = await Promise.all([
        client.from('safety_profiles').select('*').eq('user_id', user.id).single(),
        client.from('emergency_contacts').select('*').eq('user_id', user.id),
        client.from('safety_talks').select('*').eq('date', new Date().toISOString().split('T')[0]).limit(1).maybeSingle(),
      ]);

      // Check if user completed today's talk
      let talkCompleted = false;
      if (todayTalk) {
        const { data: completion } = await client
          .from('safety_talk_completions')
          .select('id')
          .eq('user_id', user.id)
          .eq('talk_id', todayTalk.id)
          .maybeSingle();
        talkCompleted = !!completion;
      }

      return jsonResponse({
        safetyScore: profile?.safety_score ?? 0,
        incidentCount: profile?.incident_count ?? 0,
        consecutiveTalks: profile?.consecutive_talks ?? 0,
        eppCompliancePercent: profile?.epp_compliance_percent ?? 0,
        lastSOSTest: profile?.last_sos_test,
        completedCourses: profile?.completed_courses ?? 0,
        totalCourses: profile?.total_courses ?? 0,
        emergencyContacts: (contacts ?? []).map((c: Record<string, unknown>) => ({
          id: c.id, name: c.name, phone: c.phone, role: c.role, label: c.label,
        })),
        todayTalk: todayTalk ? {
          id: todayTalk.id, title: todayTalk.title, duration: todayTalk.duration,
          date: todayTalk.date, completed: talkCompleted,
        } : null,
      });
    }

    // POST /safety/sos/activate
    if (path === 'sos/activate' && req.method === 'POST') {
      const { latitude, longitude, altitude, accuracy } = await req.json();

      const { data: event, error } = await client.from('sos_events').insert({
        user_id: user.id,
        latitude, longitude, altitude, accuracy,
        type: 'sos',
        status: 'activated',
      }).select().single();

      if (error) return errorResponse(error.message, 'SOS_ERROR');

      return jsonResponse({
        id: event.id,
        timestamp: new Date(event.created_at).getTime(),
        latitude: event.latitude,
        longitude: event.longitude,
        type: event.type,
        status: event.status,
      });
    }

    // POST /safety/sos/:sosId/cancel
    const sosCancelMatch = path.match(/^sos\/([^/]+)\/cancel$/);
    if (sosCancelMatch && req.method === 'POST') {
      const sosId = sosCancelMatch[1];
      const { error } = await client
        .from('sos_events')
        .update({ status: 'cancelled' })
        .eq('id', sosId)
        .eq('user_id', user.id);

      if (error) return errorResponse(error.message, 'SOS_CANCEL_ERROR');
      return jsonResponse({ success: true });
    }

    // GET /safety/sos/history
    if (path === 'sos/history' && req.method === 'GET') {
      const { data: events } = await client
        .from('sos_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      return jsonResponse((events ?? []).map((e: Record<string, unknown>) => ({
        id: e.id, timestamp: new Date(e.created_at as string).getTime(),
        latitude: e.latitude, longitude: e.longitude,
        type: e.type, status: e.status,
      })));
    }

    // GET /safety/emergency-contacts
    if (path === 'emergency-contacts' && req.method === 'GET') {
      const { data: contacts } = await client
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id);

      return jsonResponse((contacts ?? []).map((c: Record<string, unknown>) => ({
        id: c.id, name: c.name, phone: c.phone, role: c.role, label: c.label,
      })));
    }

    // POST /safety/talks/:talkId/complete
    const talkCompleteMatch = path.match(/^talks\/([^/]+)\/complete$/);
    if (talkCompleteMatch && req.method === 'POST') {
      const talkId = talkCompleteMatch[1];

      const { error } = await client.from('safety_talk_completions').insert({
        user_id: user.id,
        talk_id: talkId,
      });

      if (error) return errorResponse(error.message, 'TALK_COMPLETE_ERROR');

      // Increment consecutive talks
      await client.rpc('increment_consecutive_talks', { p_user_id: user.id });

      return jsonResponse({ success: true });
    }

    return errorResponse('Ruta no encontrada', 'NOT_FOUND', 404);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno';
    const status = message === 'No autorizado' ? 401 : 500;
    return errorResponse(message, status === 401 ? 'AUTH_ERROR' : 'INTERNAL_ERROR', status);
  }
});
