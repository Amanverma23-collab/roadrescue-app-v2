import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { service_slug, q, limit } = req.query;

      let query = supabase
        .from('providers')
        .select('*')
        .order('rating', { ascending: false })
        .order('rating_count', { ascending: false })
        .order('name', { ascending: true });

      if (service_slug) query = query.eq('service_slug', service_slug);
      if (q) query = query.ilike('name', `%${q}%`);
      if (limit) query = query.limit(Math.min(parseInt(limit, 10) || 50, 100));

      const { data, error } = await query;
      if (error) throw error;

      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
