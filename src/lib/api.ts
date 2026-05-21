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
      subtitle: "Emergency car repair",
      icon: "🚗",
      accent: "#2563eb",
      sort_order: 1
    },
    {
      id: 2,
      slug: "ac",
      name: "AC Service",
      subtitle: "AC repair and support",
      icon: "❄️",
      accent: "#06b6d4",
      sort_order: 2
    },
    {
      id: 3,
      slug: "pharmacy",
      name: "Pharmacy",
      subtitle: "Medicine nearby",
      icon: "💊",
      accent: "#16a34a",
      sort_order: 3
    },
    {
      id: 4,
      slug: "bike",
      name: "Bike Repair",
      subtitle: "Emergency bike help",
      icon: "🏍️",
      accent: "#f97316",
      sort_order: 4
    }
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
