import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { limit } = req.query;
      const l = Math.min(parseInt(limit || '20', 10) || 20, 100);
      const { data, error } = await supabase
        .from('sos_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(l);
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { phone, service_slug, service_name, note, lat, lng, accuracy_m } = req.body || {};
      if (!phone || !service_slug || !service_name) {
        return res.status(400).json({ error: 'phone, service_slug, and service_name are required' });
      }

      const { data, error } = await supabase
        .from('sos_requests')
        .insert({
          phone,
          service_slug,
          service_name,
          note: note || null,
          lat: typeof lat === 'number' ? lat : null,
          lng: typeof lng === 'number' ? lng : null,
          accuracy_m: typeof accuracy_m === 'number' ? accuracy_m : null,
          status: 'created',
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
