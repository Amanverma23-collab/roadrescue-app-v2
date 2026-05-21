import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { request_id, limit } = req.query;
      if (!request_id) return res.status(400).json({ error: 'request_id required' });
      const l = Math.min(parseInt(limit || '60', 10) || 60, 500);

      const { data, error } = await supabase
        .from('provider_updates')
        .select('*')
        .eq('request_id', Number(request_id))
        .order('created_at', { ascending: true })
        .limit(l);

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { request_id, provider_lat, provider_lng, speed_kph } = req.body || {};
      if (!request_id || typeof provider_lat !== 'number' || typeof provider_lng !== 'number') {
        return res.status(400).json({ error: 'request_id, provider_lat, provider_lng required' });
      }

      const { data, error } = await supabase
        .from('provider_updates')
        .insert({
          request_id: Number(request_id),
          provider_lat,
          provider_lng,
          speed_kph: typeof speed_kph === 'number' ? speed_kph : null,
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
