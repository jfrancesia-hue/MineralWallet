import { handleCors } from '../_shared/cors.ts';
import { getUser, jsonResponse, errorResponse } from '../_shared/supabase.ts';

Deno.serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const url = new URL(req.url);
  const path = url.pathname.replace('/benefits', '').replace(/^\//, '');

  try {
    const { client, user } = await getUser(req);

    // GET /benefits/summary
    if (path === 'summary' && req.method === 'GET') {
      const [
        { data: categories },
        { data: featured },
        { data: businesses },
        { data: savings },
      ] = await Promise.all([
        client.from('benefit_categories').select('*'),
        client.from('featured_benefits').select('*').eq('active', true).limit(1).maybeSingle(),
        client.from('nearby_businesses').select('*').limit(10),
        client.from('savings_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      ]);

      const totalSavingsYear = (savings ?? []).reduce((sum: number, s: Record<string, unknown>) => sum + (s.amount as number), 0);

      return jsonResponse({
        totalSavingsYear,
        categories: (categories ?? []).map((c: Record<string, unknown>) => ({
          name: c.name, discount: c.discount, color: c.color,
        })),
        featuredBenefit: featured ? {
          title: featured.title, description: featured.description, maxAmount: featured.max_amount,
        } : null,
        nearbyBusinesses: (businesses ?? []).map((b: Record<string, unknown>) => ({
          id: b.id, name: b.name, distance: b.distance, category: b.category,
          discount: b.discount, hasQR: b.has_qr,
        })),
        savingsHistory: (savings ?? []).map((s: Record<string, unknown>) => ({
          id: s.id, store: s.store, amount: s.amount, date: s.created_at, category: s.category,
        })),
        activeBenefitsCount: (categories ?? []).length,
      });
    }

    // GET /benefits/nearby?lat=X&lng=Y
    if (path === 'nearby' && req.method === 'GET') {
      const { data: businesses } = await client
        .from('nearby_businesses')
        .select('*')
        .limit(20);

      return jsonResponse((businesses ?? []).map((b: Record<string, unknown>) => ({
        id: b.id, name: b.name, distance: b.distance, category: b.category,
        discount: b.discount, hasQR: b.has_qr,
      })));
    }

    // POST /benefits/redeem
    if (path === 'redeem' && req.method === 'POST') {
      const { businessId, amount, category, store } = await req.json();

      await client.from('savings_entries').insert({
        user_id: user.id,
        store: store ?? 'Comercio',
        amount,
        category: category ?? 'general',
      });

      return jsonResponse({ success: true, couponCode: `MW-${Date.now().toString(36).toUpperCase()}` });
    }

    return errorResponse('Ruta no encontrada', 'NOT_FOUND', 404);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno';
    const status = message === 'No autorizado' ? 401 : 500;
    return errorResponse(message, status === 401 ? 'AUTH_ERROR' : 'INTERNAL_ERROR', status);
  }
});
