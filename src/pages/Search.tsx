import React, { useEffect, useMemo, useState } from 'react';
import TopBar from '../components/TopBar';
import type { Provider, Service } from '../lib/api';
import { fetchProviders, fetchServices } from '../lib/api';
import { fmtDistanceKm, haversineKm } from '../lib/geo';
import ProviderCard from '../components/ProviderCard';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';

export default function Search({
  location,
}: {
  location: { lat: number; lng: number; accuracy?: number } | null;
}) {
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [serviceSlug, setServiceSlug] = useState<string>('');

  const load = async () => {
    try {
      setLoading(true);
      const [s, p] = await Promise.all([fetchServices(), fetchProviders({ limit: 100 })]);
      setServices(s);
      setProviders(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const computed = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const list = providers
      .filter((p) => (serviceSlug ? p.service_slug === serviceSlug : true))
      .filter((p) => (qq ? p.name.toLowerCase().includes(qq) || p.city.toLowerCase().includes(qq) : true))
      .map((p) => {
        const km = location ? haversineKm({ lat: location.lat, lng: location.lng }, { lat: p.lat, lng: p.lng }) : Number.POSITIVE_INFINITY;
        return { p, km };
      })
      .sort((a, b) => a.km - b.km);

    return list;
  }, [providers, q, serviceSlug, location]);

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <TopBar title="Search" backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-bold text-slate-900">Find providers</div>
          <div className="mt-1 text-xs text-slate-500">Search across all categories. Results sort by nearest.</div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 focus-within:border-blue-400">
            <SearchIcon className="h-5 w-5 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or city"
              className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
            />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm">
              <SlidersHorizontal className="h-4 w-4" /> Category
            </div>
            <select
              value={serviceSlug}
              onChange={(e) => setServiceSlug(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm outline-none"
            >
              <option value="">All services</option>
              {services.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[156px] animate-pulse rounded-3xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {computed.map(({ p, km }) => (
              <ProviderCard key={p.id} provider={p} distanceLabel={fmtDistanceKm(km)} />
            ))}
            {!computed.length ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
                No results.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
