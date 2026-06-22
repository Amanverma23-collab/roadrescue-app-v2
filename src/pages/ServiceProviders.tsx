import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import ProviderCard from '../components/ProviderCard';
import type { Provider, Service } from '../lib/api';
import { fetchProviders, fetchServices } from '../lib/api';
import { fmtDistanceKm, haversineKm } from '../lib/geo';
import { Filter, Search, Siren } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-24">
      <TopBar title={service?.name || 'Providers'} backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900">
                {service?.name || 'Providers'} near you
              </h2>
              <p className="mt-1 text-[12px] text-gray-500">
                {location ? 'Ranked by distance from GPS location.' : 'Enable location to calculate distances.'}
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-[11px] font-medium text-white">
              <Filter className="h-3.5 w-3.5" /> 
              <span>Nearest</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-amber-50 border border-amber-100 p-4">
            <div className="min-w-0">
              <h3 className="text-[13px] font-semibold text-amber-900 flex items-center gap-1.5">
                <Siren className="h-4 w-4 text-amber-600" /> Urgent assistance flow
              </h3>
              <p className="mt-1 text-[11px] leading-relaxed text-amber-700">
                Skip calling and send a digital dispatch request to start live map tracking.
              </p>
            </div>
            <a
              href={`/service/${serviceSlug}/request`}
              className="shrink-0 rounded-xl bg-amber-600 hover:bg-amber-700 px-3 py-2 text-[12px] font-semibold text-white transition active:scale-95 cursor-pointer"
            >
              Request SOS
            </a>
          </div>

          <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by center name..."
              className="w-full bg-transparent text-[13px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
        </motion.div>

        {error && (
          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-[13px] font-medium text-amber-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 skeleton rounded-2xl bg-white border border-gray-100" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mt-4 grid gap-3"
          >
            {computed.length ? (
              computed.map(({ p, km }) => (
                <motion.div key={p.id} variants={itemVariants}>
                  <ProviderCard provider={p} distanceLabel={fmtDistanceKm(km)} />
                </motion.div>
              ))
            ) : (
              <div className="rounded-2xl bg-white border border-gray-100 p-8 text-center text-[14px] font-medium text-gray-500">
                No matching service providers found.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
