import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import ProviderCard from '../components/ProviderCard';
import type { Provider, Service } from '../lib/api';
import { fetchProviders, fetchServices } from '../lib/api';
import { fmtDistanceKm, haversineKm } from '../lib/geo';
import { Filter, Search } from 'lucide-react';

export default function ServiceProviders({
  location,
}: {
  location: { lat: number; lng: number; accuracy?: number } | null;
}) {
  const { slug } = useParams();
  const serviceSlug = slug || '';

  const [service, setService] = useState<Service | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const [services, prov] = await Promise.all([fetchServices(), fetchProviders({ service_slug: serviceSlug })]);
      setService(services.find((s) => s.slug === serviceSlug) || null);
      setProviders(prov);
    } catch (e: any) {
      setError(e?.message || 'Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceSlug]);

  const computed = useMemo(() => {
    const base = providers
      .map((p) => {
        const km = location ? haversineKm({ lat: location.lat, lng: location.lng }, { lat: p.lat, lng: p.lng }) : Number.POSITIVE_INFINITY;
        return { p, km };
      })
      .filter(({ p }) => (q.trim() ? p.name.toLowerCase().includes(q.trim().toLowerCase()) : true))
      .sort((a, b) => a.km - b.km);

    return base;
  }, [providers, location, q]);

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <TopBar title={service?.name || 'Providers'} backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-slate-900">Nearby {service?.name || 'providers'}</div>
              <div className="mt-1 text-xs text-slate-500">
                Sorted by distance {location ? 'from your current location.' : '(enable location for accurate distances).'}
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
              <Filter className="h-4 w-4" /> Nearest
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2">
            <div className="min-w-0">
              <div className="text-xs font-bold text-orange-900">Emergency assistance flow</div>
              <div className="mt-0.5 text-[11px] text-orange-800/90">Tap “Send Request” to start live tracking after acceptance.</div>
            </div>
            <a
              href={`/service/${serviceSlug}/request`}
              className="shrink-0 rounded-2xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-orange-600 active:bg-orange-700"
            >
              Send request
            </a>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 focus-within:border-blue-400">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name"
              className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-800">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[156px] animate-pulse rounded-3xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {computed.length ? (
              computed.map(({ p, km }) => <ProviderCard key={p.id} provider={p} distanceLabel={fmtDistanceKm(km)} />)
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
                No providers found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
