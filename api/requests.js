import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { phone, status, role, provider_id } = req.query;

      let query = supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (phone) query = query.eq('customer_phone', phone);
      if (status) query = query.eq('status', status);
      if (provider_id) query = query.eq('provider_id', Number(provider_id));

      // role is client-side hint; no-op server-side, but kept for forward-compat.
      if (role && !['customer', 'provider'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const {
        customer_phone,
        service_slug,
        provider_id,
        note,
        customer_lat,
        customer_lng,
      } = req.body || {};

      if (!customer_phone || !service_slug || !provider_id) {
        return res.status(400).json({ error: 'customer_phone, service_slug, provider_id required' });
      }

      const { data, error } = await supabase
        .from('requests')
        .insert({
          customer_phone,
          service_slug,
          provider_id,
          note: note || null,
          customer_lat: typeof customer_lat === 'number' ? customer_lat : null,
          customer_lng: typeof customer_lng === 'number' ? customer_lng : null,
          status: 'requested',
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, action, provider_lat, provider_lng, eta_minutes } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });

      const patch = {};
      if (action === 'accept') {
        patch.status = 'accepted';
        patch.accepted_at = new Date().toISOString();
      } else if (action === 'decline') {
        patch.status = 'declined';
        patch.declined_at = new Date().toISOString();
      } else if (action === 'arrived') {
        patch.status = 'arrived';
      } else if (action === 'completed') {
        patch.status = 'completed';
        patch.completed_at = new Date().toISOString();
      } else if (action === 'cancel') {
        patch.status = 'cancelled';
      } else if (action === 'update_location') {
        // no status change
      } else {
        return res.status(400).json({ error: 'Invalid action' });
      }

      if (typeof provider_lat === 'number') patch.provider_lat = provider_lat;
      if (typeof provider_lng === 'number') patch.provider_lng = provider_lng;
      if (typeof eta_minutes === 'number') patch.eta_minutes = eta_minutes;

      const { data, error } = await supabase
        .from('requests')
        .update(patch)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      const { error } = await supabase.from('requests').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
