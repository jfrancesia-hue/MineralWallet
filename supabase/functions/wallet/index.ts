import { handleCors } from '../_shared/cors.ts';
import { getUser, jsonResponse, errorResponse } from '../_shared/supabase.ts';

Deno.serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const url = new URL(req.url);
  const path = url.pathname.replace('/wallet', '').replace(/^\//, '');

  try {
    const { client, user } = await getUser(req);

    // GET /wallet/balance
    if (path === 'balance' && req.method === 'GET') {
      const { data: wallet } = await client
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!wallet) return errorResponse('Wallet no encontrada', 'NOT_FOUND', 404);

      return jsonResponse({
        balance: wallet.balance,
        savings: wallet.savings,
        usdtBalance: Number(wallet.usdt_balance),
        usdtRate: wallet.usdt_rate,
        adelantoDisponible: wallet.adelanto_disponible,
        adelantoUsado: wallet.adelanto_usado,
        cvu: wallet.cvu,
        alias: wallet.alias,
        creditScore: wallet.credit_score,
      });
    }

    // GET /wallet/transactions?page=1&pageSize=20
    if (path === 'transactions' && req.method === 'GET') {
      const page = parseInt(url.searchParams.get('page') ?? '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') ?? '20');
      const offset = (page - 1) * pageSize;

      const { data: wallet } = await client.from('wallets').select('id').eq('user_id', user.id).single();
      if (!wallet) return errorResponse('Wallet no encontrada', 'NOT_FOUND', 404);

      const { data: txs, count } = await client
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      return jsonResponse({
        data: (txs ?? []).map((tx: Record<string, unknown>) => ({
          id: tx.id,
          title: tx.title,
          description: tx.description,
          amount: tx.amount,
          date: tx.created_at,
          type: tx.type,
          category: tx.category,
        })),
        total: count ?? 0,
        page,
        pageSize,
        hasMore: offset + pageSize < (count ?? 0),
      });
    }

    // POST /wallet/transfer
    if (path === 'transfer' && req.method === 'POST') {
      const { recipientId, amount, title, description } = await req.json();

      const { data: senderWallet } = await client.from('wallets').select('id').eq('user_id', user.id).single();
      if (!senderWallet) return errorResponse('Wallet no encontrada', 'NOT_FOUND', 404);

      const { data: txId, error } = await client.rpc('transfer_funds', {
        p_from_wallet_id: senderWallet.id,
        p_to_wallet_id: recipientId,
        p_amount: amount,
        p_title: title ?? 'Transferencia',
        p_description: description,
      });

      if (error) return errorResponse(error.message, 'TRANSFER_ERROR');
      return jsonResponse({ transactionId: txId });
    }

    // POST /wallet/adelanto
    if (path === 'adelanto' && req.method === 'POST') {
      const { amount } = await req.json();

      const { data: wallet } = await client.from('wallets').select('id').eq('user_id', user.id).single();
      if (!wallet) return errorResponse('Wallet no encontrada', 'NOT_FOUND', 404);

      const { data: txId, error } = await client.rpc('request_adelanto', {
        p_wallet_id: wallet.id,
        p_amount: amount,
      });

      if (error) return errorResponse(error.message, 'ADELANTO_ERROR');
      return jsonResponse({ transactionId: txId });
    }

    // POST /wallet/usdt/convert
    if ((path === 'usdt/convert' || path === 'usdt%2Fconvert') && req.method === 'POST') {
      const { arsAmount, direction } = await req.json();

      const { data: wallet } = await client.from('wallets').select('id').eq('user_id', user.id).single();
      if (!wallet) return errorResponse('Wallet no encontrada', 'NOT_FOUND', 404);

      const { error } = await client.rpc('convert_usdt', {
        p_wallet_id: wallet.id,
        p_ars_amount: arsAmount,
        p_direction: direction,
      });

      if (error) return errorResponse(error.message, 'USDT_ERROR');
      return jsonResponse({ success: true });
    }

    // GET /wallet/family-contacts
    if (path === 'family-contacts' && req.method === 'GET') {
      const { data: wallet } = await client.from('wallets').select('id').eq('user_id', user.id).single();
      if (!wallet) return errorResponse('Wallet no encontrada', 'NOT_FOUND', 404);

      const { data: contacts } = await client
        .from('family_contacts')
        .select('*')
        .eq('wallet_id', wallet.id);

      return jsonResponse((contacts ?? []).map((c: Record<string, unknown>) => ({
        id: c.id,
        name: c.name,
        relationship: c.relationship,
        lastSentAmount: c.last_sent_amount,
        lastSentDate: c.last_sent_date,
        totalSentYear: c.total_sent_year,
        method: c.method,
      })));
    }

    // POST /wallet/family-contacts/send
    if (path === 'family-contacts/send' && req.method === 'POST') {
      const { contactId, amount, title } = await req.json();

      const { data: wallet } = await client.from('wallets').select('id').eq('user_id', user.id).single();
      if (!wallet) return errorResponse('Wallet no encontrada', 'NOT_FOUND', 404);

      // Debit wallet
      const { error: balError } = await client
        .from('wallets')
        .update({ balance: client.rpc('wallets.balance - $1', [amount]) })
        .eq('id', wallet.id);

      // Update contact stats
      await client
        .from('family_contacts')
        .update({
          last_sent_amount: amount,
          last_sent_date: new Date().toISOString().split('T')[0],
          total_sent_year: client.rpc('family_contacts.total_sent_year + $1', [amount]),
        })
        .eq('id', contactId);

      // Create transaction
      await client.from('transactions').insert({
        wallet_id: wallet.id,
        title: title ?? 'Envio a familia',
        amount: -amount,
        type: 'transfer',
        category: 'family',
      });

      return jsonResponse({ success: true });
    }

    // GET /wallet/loans
    if (path === 'loans' && req.method === 'GET') {
      const { data: wallet } = await client.from('wallets').select('id').eq('user_id', user.id).single();
      if (!wallet) return errorResponse('Wallet no encontrada', 'NOT_FOUND', 404);

      const { data: loans } = await client
        .from('loans')
        .select('*')
        .eq('wallet_id', wallet.id)
        .eq('status', 'active');

      return jsonResponse((loans ?? []).map((l: Record<string, unknown>) => ({
        id: l.id,
        name: l.name,
        total: l.total,
        paid: l.paid,
        cuota: l.cuota,
        nextDate: l.next_date,
      })));
    }

    return errorResponse('Ruta no encontrada', 'NOT_FOUND', 404);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno';
    const status = message === 'No autorizado' ? 401 : 500;
    return errorResponse(message, status === 401 ? 'AUTH_ERROR' : 'INTERNAL_ERROR', status);
  }
});
