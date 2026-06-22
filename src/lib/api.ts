export type Service = {
  id: number;
  slug: string;
  name: string;
  subtitle: string | null;
  icon: string;
  accent: string;
  sort_order: number;
};

export type Provider = {
  id: number;
  service_slug: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  rating: number;
  rating_count: number;
  open_hours: string;
  services: string;
  verified: boolean;
};

export type SosRequest = {
  id: number;
  created_at: string;
  phone: string;
  service_slug: string;
  service_name: string;
  note: string | null;
  lat: number | null;
  lng: number | null;
  accuracy_m: number | null;
  status: string;
};

async function json<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    const message = (data && (data.error || data.message)) || 'Request failed';
    throw new Error(message);
  }
  return data as T;
}

export async function fetchServices(): Promise<Service[]> {
  return [
    {
      id: 1,
      slug: "mechanic",
      name: "Car Mechanic",
      subtitle: "Emergency car repair at your location",
      icon: "wrench",
      accent: "#2563eb",
      sort_order: 1
    },
    {
      id: 2,
      slug: "tow-truck",
      name: "Tow Truck",
      subtitle: "Vehicle towing and recovery",
      icon: "truck",
      accent: "#7c3aed",
      sort_order: 2
    },
    {
      id: 3,
      slug: "battery",
      name: "Battery Jumpstart",
      subtitle: "Dead battery? We come to you",
      icon: "battery",
      accent: "#eab308",
      sort_order: 3
    },
    {
      id: 4,
      slug: "tire",
      name: "Flat Tire",
      subtitle: "Puncture repair and tire change",
      icon: "circle-dot",
      accent: "#f97316",
      sort_order: 4
    },
    {
      id: 5,
      slug: "fuel",
      name: "Fuel Delivery",
      subtitle: "Petrol or diesel delivered to you",
      icon: "fuel",
      accent: "#dc2626",
      sort_order: 5
    },
    {
      id: 6,
      slug: "locksmith",
      name: "Locksmith",
      subtitle: "Car lockout and key replacement",
      icon: "lock",
      accent: "#6b7280",
      sort_order: 6
    },
    {
      id: 7,
      slug: "bike",
      name: "Bike Repair",
      subtitle: "Two-wheeler breakdown assistance",
      icon: "bike",
      accent: "#f97316",
      sort_order: 7
    },
    {
      id: 8,
      slug: "ac",
      name: "AC Service",
      subtitle: "Car AC repair and gas refill",
      icon: "snowflake",
      accent: "#06b6d4",
      sort_order: 8
    },
    {
      id: 9,
      slug: "electrician",
      name: "Electrician",
      subtitle: "Electrical breakdown at your car",
      icon: "zap",
      accent: "#8b5cf6",
      sort_order: 9
    },
    {
      id: 10,
      slug: "ambulance",
      name: "Emergency Ambulance",
      subtitle: "Quick medical emergency response",
      icon: "ambulance",
      accent: "#dc2626",
      sort_order: 10
    },
    {
      id: 11,
      slug: "pharmacy",
      name: "Pharmacy",
      subtitle: "Medicine delivered nearby",
      icon: "pill",
      accent: "#16a34a",
      sort_order: 11
    },
    {
      id: 12,
      slug: "water",
      name: "Water Tanker",
      subtitle: "Emergency water supply on road",
      icon: "droplets",
      accent: "#0ea5e9",
      sort_order: 12
    },
    {
      id: 13,
      slug: "food",
      name: "Food & Water",
      subtitle: "Roadside food and water delivery",
      icon: "utensils",
      accent: "#ea580c",
      sort_order: 13
    },
    {
      id: 14,
      slug: "cleaning",
      name: "Car Cleaning",
      subtitle: "Quick wash and interior clean",
      icon: "sparkles",
      accent: "#14b8a6",
      sort_order: 14
    },
    {
      id: 15,
      slug: "crane",
      name: "Crane Service",
      subtitle: "Heavy vehicle lifting and recovery",
      icon: "hammer",
      accent: "#78716c",
      sort_order: 15
    },
  ];
}

export async function fetchProviders(params: { service_slug?: string; q?: string; limit?: number } = {}): Promise<Provider[]> {
  const usp = new URLSearchParams();
  if (params.service_slug) usp.set('service_slug', params.service_slug);
  if (params.q) usp.set('q', params.q);
  if (params.limit) usp.set('limit', String(params.limit));
  const res = await fetch(`/api/providers${usp.toString() ? `?${usp.toString()}` : ''}`);
  return json<Provider[]>(res);
}

export async function createSos(payload: {
  phone: string;
  service_slug: string;
  service_name: string;
  note?: string;
  lat?: number;
  lng?: number;
  accuracy_m?: number;
}): Promise<SosRequest> {
  const res = await fetch('/api/sos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return json<SosRequest>(res);
}
