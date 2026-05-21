import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import ServiceCard from '../components/ServiceCard';
import type { Service } from '../lib/api';
import { fetchServices } from '../lib/api';
import { MapPin, PhoneCall } from 'lucide-react';

export default function Home({
  phone,
  location,
}: {
  phone: string | null;
  location: { lat: number; lng: number; accuracy?: number } | null;
}) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setError(null);
      const data = await fetchServices();
      setServices(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <TopBar title="RoadRescue" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-white/80">{greeting}</div>
              <div className="mt-1 text-lg font-bold tracking-tight">Need help fast?</div>
              <div className="mt-2 text-sm leading-6 text-white/90">
                Choose a service to discover the nearest providers and contact them in one tap.
              </div>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <PhoneCall className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <MapPin className="h-4 w-4" /> Location
              </div>
              <div className="mt-1 text-sm font-bold">
                {location ? `${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}` : 'Not set'}
              </div>
              <div className="mt-0.5 text-[11px] text-white/80">
                {location?.accuracy ? `±${Math.round(location.accuracy)}m` : 'Enable for nearest results'}
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <div className="text-xs font-semibold">Signed in</div>
              <div className="mt-1 text-sm font-bold">{phone ? phone : 'Guest'}</div>
              <div className="mt-0.5 text-[11px] text-white/80">Phone verified ✅</div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-900">Services</div>
            <div className="text-xs text-slate-500">Same nearest-provider flow for every category</div>
          </div>
          <Link
            to="/search"
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm"
          >
            Search
          </Link>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-800">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[92px] animate-pulse rounded-3xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
