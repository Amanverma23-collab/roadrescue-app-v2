import React, { useEffect, useMemo, useState } from 'react';
import TopBar from '../components/TopBar';
import type { Provider, Service } from '../lib/api';
import { fetchProviders, fetchServices } from '../lib/api';
import { fmtDistanceKm, haversineKm } from '../lib/geo';
import ProviderCard from '../components/ProviderCard';
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-24">
      <TopBar title="Search Directory" backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
        >
          <h2 className="text-[15px] font-semibold text-gray-900">Search Rescue Network</h2>
          <p className="mt-1 text-[12px] text-gray-500">
            Find immediate roadside assistance sorted by proximity.
          </p>

          <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3.5 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all">
            <SearchIcon className="h-4 w-4 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Enter provider name, city..."
              className="w-full bg-transparent text-[13px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
            />
            {q && (
              <button
                onClick={() => setQ('')}
                className="rounded-full p-1 hover:bg-gray-200 transition cursor-pointer"
              >
                <X className="h-3.5 w-3.5 text-gray-400" />
              </button>
            )}
          </div>

          <div className="mt-3.5 flex items-center gap-3">
            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-[11px] font-medium text-white">
              <SlidersHorizontal className="h-3.5 w-3.5" /> 
              <span>Category</span>
            </div>
            
            <select
              value={serviceSlug}
              onChange={(e) => setServiceSlug(e.target.value)}
              className="w-full rounded-xl input-field cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <option value="">All Services</option>
              {services.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {!loading && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              {computed.length} provider{computed.length !== 1 ? 's' : ''} found
            </p>
            {serviceSlug && (
              <button
                onClick={() => setServiceSlug('')}
                className="text-[12px] font-medium text-[var(--color-primary)] hover:underline transition cursor-pointer"
              >
                Clear filter
              </button>
            )}
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
              <div className="rounded-2xl bg-white border border-gray-100 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-[14px] font-medium text-gray-600">No matching providers found</p>
                <p className="mt-1 text-[12px] text-gray-400">Try another search query or filter</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
