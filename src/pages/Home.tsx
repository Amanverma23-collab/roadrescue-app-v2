import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import ServiceCard from '../components/ServiceCard';
import type { Service } from '../lib/api';
import { fetchServices } from '../lib/api';
import { MapPin, UserCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocationName } from '../hooks/useLocationName';

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
  const { city, loading: cityLoading } = useLocationName(location?.lat ?? null, location?.lng ?? null);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-24">
      <TopBar title="RoadRescue" />

      <div className="mx-auto w-full max-w-md px-4 pt-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-[var(--color-primary)] p-5 text-white relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-8 bottom-0 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10">
            <span className="text-[11px] uppercase tracking-wider font-medium text-white/60">
              {greeting}
            </span>
            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-white leading-tight">
              Emergency Roadside
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-white/70">
              Select a rescue service below. We'll match you to the nearest verified responder instantly.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 relative z-10">
            <div className="rounded-xl bg-white/10 p-3.5">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/50 uppercase tracking-wider">
                <MapPin className="h-3.5 w-3.5" /> GPS Status
              </div>
              <p className="mt-1.5 text-[13px] font-semibold text-white">
                {cityLoading ? 'Locating...' : city || (location ? `${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}` : 'Not Set')}
              </p>
              <span className="mt-1 block text-[10px] text-white/50">
                {location?.accuracy ? `Within ±${Math.round(location.accuracy)}m` : 'Enable GPS location'}
              </span>
            </div>
            
            <div className="rounded-xl bg-white/10 p-3.5">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/50 uppercase tracking-wider">
                <UserCheck className="h-3.5 w-3.5" /> Account
              </div>
              <p className="mt-1.5 text-[13px] font-semibold text-white truncate">
                {phone ? phone : 'Guest Driver'}
              </p>
              <span className="mt-1 block text-[10px] text-emerald-400">
                Verified Customer
              </span>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900">Rescue Services</h3>
            <p className="text-[12px] text-gray-500 mt-0.5">All packages include live tracking</p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-[12px] font-medium text-gray-700 transition-colors hover:bg-gray-200 active:scale-95"
          >
            <span>Search</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-[13px] font-medium text-amber-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[72px] skeleton rounded-2xl bg-white border border-gray-100" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mt-4 grid gap-3"
          >
            {services.map((s) => (
              <motion.div key={s.id} variants={itemVariants}>
                <ServiceCard service={s} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 mb-4 text-center"
        >
          <p className="text-[11px] text-gray-400">
            Trusted by 10,000+ drivers across India
          </p>
        </motion.div>
      </div>
    </div>
  );
}
