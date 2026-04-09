import { handleCors } from '../_shared/cors.ts';
import { getUser, jsonResponse, errorResponse } from '../_shared/supabase.ts';

Deno.serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const url = new URL(req.url);
  const path = url.pathname.replace('/work', '').replace(/^\//, '');

  try {
    const { client, user } = await getUser(req);

    // GET /work/summary
    if (path === 'summary' && req.method === 'GET') {
      const [
        { data: shift },
        { data: checkIn },
        { data: supervisor },
        { data: eppItems },
      ] = await Promise.all([
        client.from('shifts').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(1).single(),
        client.from('check_ins').select('*').eq('user_id', user.id).is('check_out_at', null).order('check_in_at', { ascending: false }).limit(1).maybeSingle(),
        client.from('supervisors').select('*').eq('user_id', user.id).limit(1).single(),
        client.from('epp_items').select('*').eq('user_id', user.id),
      ]);

      return jsonResponse({
        currentShift: shift ? {
          id: shift.id, type: shift.type, startTime: shift.start_time, endTime: shift.end_time,
          sector: shift.sector, level: shift.level, dayOfRotation: shift.day_of_rotation,
          totalDays: shift.total_days, date: shift.date,
        } : null,
        isCheckedIn: !!checkIn,
        checkInTime: checkIn ? new Date(checkIn.check_in_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : null,
        supervisor: supervisor ? { name: supervisor.name, role: supervisor.role } : null,
        eppItems: (eppItems ?? []).map((e: Record<string, unknown>) => ({
          id: e.id, name: e.name, status: e.status, expiresAt: e.expires_at, reviewDate: e.review_date,
        })),
      });
    }

    // GET /work/shifts?month=2026-04
    if (path === 'shifts' && req.method === 'GET') {
      const month = url.searchParams.get('month');
      let query = client.from('shifts').select('*').eq('user_id', user.id).order('date', { ascending: false });
      if (month) {
        query = query.gte('date', `${month}-01`).lt('date', `${month}-32`);
      }
      const { data: shifts } = await query;

      return jsonResponse((shifts ?? []).map((s: Record<string, unknown>) => ({
        id: s.id, type: s.type, startTime: s.start_time, endTime: s.end_time,
        sector: s.sector, level: s.level, dayOfRotation: s.day_of_rotation,
        totalDays: s.total_days, date: s.date,
      })));
    }

    // POST /work/check-in
    if (path === 'check-in' && req.method === 'POST') {
      const { data, error } = await client.from('check_ins').insert({
        user_id: user.id,
        check_in_at: new Date().toISOString(),
      }).select().single();

      if (error) return errorResponse(error.message, 'CHECK_IN_ERROR');
      return jsonResponse({ id: data.id, checkInAt: data.check_in_at });
    }

    // POST /work/check-out
    if (path === 'check-out' && req.method === 'POST') {
      const { data, error } = await client
        .from('check_ins')
        .update({ check_out_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .is('check_out_at', null)
        .order('check_in_at', { ascending: false })
        .limit(1)
        .select()
        .single();

      if (error) return errorResponse(error.message, 'CHECK_OUT_ERROR');
      return jsonResponse({ id: data.id, checkOutAt: data.check_out_at });
    }

    // GET /work/pay-stubs?year=2026
    if (path === 'pay-stubs' && req.method === 'GET') {
      const year = url.searchParams.get('year');
      let query = client.from('pay_stubs').select('*').eq('user_id', user.id).order('year', { ascending: false }).order('month');
      if (year) query = query.eq('year', parseInt(year));
      const { data: stubs } = await query;

      return jsonResponse((stubs ?? []).map((ps: Record<string, unknown>) => ({
        id: ps.id, period: ps.period, month: ps.month, year: ps.year,
        haberes: ps.haberes, descuentos: ps.descuentos,
        totalHaberes: ps.total_haberes, totalDescuentos: ps.total_descuentos,
        neto: ps.neto, paidDate: ps.paid_date, pdfUrl: ps.pdf_url,
      })));
    }

    // GET /work/epp
    if (path === 'epp' && req.method === 'GET') {
      const { data: items } = await client.from('epp_items').select('*').eq('user_id', user.id);
      return jsonResponse((items ?? []).map((e: Record<string, unknown>) => ({
        id: e.id, name: e.name, status: e.status, expiresAt: e.expires_at, reviewDate: e.review_date,
      })));
    }

    // POST /work/epp/:eppId/renew
    const eppRenewMatch = path.match(/^epp\/([^/]+)\/renew$/);
    if (eppRenewMatch && req.method === 'POST') {
      const eppId = eppRenewMatch[1];
      const { error } = await client
        .from('epp_items')
        .update({ status: 'vigente', expires_at: null })
        .eq('id', eppId)
        .eq('user_id', user.id);

      if (error) return errorResponse(error.message, 'EPP_RENEW_ERROR');
      return jsonResponse({ success: true });
    }

    return errorResponse('Ruta no encontrada', 'NOT_FOUND', 404);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno';
    const status = message === 'No autorizado' ? 401 : 500;
    return errorResponse(message, status === 401 ? 'AUTH_ERROR' : 'INTERNAL_ERROR', status);
  }
});
