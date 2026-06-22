import supabase, { isSupabaseConfigured } from './_supabase.js';

const MOCK_PROVIDERS = [
  { id: 1, service_slug: 'mechanic', name: 'Sharma Auto Care', phone: '+919812345678', address: 'Main Market Road', city: 'Rewari', lat: 28.41, lng: 76.62, rating: 4.8, rating_count: 124, open_hours: '09:00–21:00', services: 'Engine Repair, Oil Change, Brake Service', verified: true },
  { id: 2, service_slug: 'mechanic', name: 'Gupta Car Workshop', phone: '+919876543210', address: 'GT Road Near Bus Stand', city: 'Rewari', lat: 28.42, lng: 76.63, rating: 4.5, rating_count: 89, open_hours: '08:00–20:00', services: 'Full Car Service, AC Repair', verified: true },
  { id: 3, service_slug: 'tow-truck', name: 'Raj Recovery Service', phone: '+919988776655', address: 'NH-48 Highway', city: 'Rewari', lat: 28.40, lng: 76.61, rating: 4.7, rating_count: 56, open_hours: '24/7', services: 'Towing, Accident Recovery', verified: true },
  { id: 4, service_slug: 'battery', name: 'Power Boost Battery', phone: '+919112233445', address: 'Industrial Area', city: 'Rewari', lat: 28.43, lng: 76.64, rating: 4.6, rating_count: 72, open_hours: '09:00–20:00', services: 'Jumpstart, Battery Replacement', verified: true },
  { id: 5, service_slug: 'tire', name: 'New Tyre Point', phone: '+919223344556', address: 'Delhi Road', city: 'Rewari', lat: 28.44, lng: 76.65, rating: 4.4, rating_count: 98, open_hours: '08:30–21:30', services: 'Puncture Repair, Tyre Change, Alignment', verified: true },
  { id: 6, service_slug: 'fuel', name: 'Fuel Express', phone: '+919334455667', address: 'Near Petrol Pump', city: 'Rewari', lat: 28.41, lng: 76.60, rating: 4.3, rating_count: 45, open_hours: '07:00–22:00', services: 'Petrol Delivery, Diesel Delivery', verified: true },
  { id: 7, service_slug: 'locksmith', name: 'Key Master Lock Service', phone: '+919445566778', address: 'Clock Tower Road', city: 'Rewari', lat: 28.42, lng: 76.62, rating: 4.7, rating_count: 63, open_hours: '24/7', services: 'Car Lockout, Key Replacement, Remote Programming', verified: true },
  { id: 8, service_slug: 'bike', name: 'Two Wheeler Hub', phone: '+919556677889', address: 'Subhash Nagar', city: 'Rewari', lat: 28.43, lng: 76.63, rating: 4.5, rating_count: 110, open_hours: '09:00–20:00', services: 'Bike Repair, Battery, Tyre', verified: true },
  { id: 9, service_slug: 'ac', name: 'Cool Wave AC Service', phone: '+919667788990', address: 'Model Town', city: 'Rewari', lat: 28.44, lng: 76.64, rating: 4.6, rating_count: 78, open_hours: '10:00–19:00', services: 'Car AC Gas Refill, AC Repair', verified: true },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (!isSupabaseConfigured()) {
    if (req.method === 'GET') {
      const { service_slug, q, limit } = req.query;
      let result = [...MOCK_PROVIDERS];
      if (service_slug) result = result.filter(p => p.service_slug === service_slug);
      if (q) result = result.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
      if (limit) result = result.slice(0, parseInt(limit, 10));
      return res.status(200).json(result);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
