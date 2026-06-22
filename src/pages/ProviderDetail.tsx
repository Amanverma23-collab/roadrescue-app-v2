import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import MapEmbed from '../components/MapEmbed';
import type { Provider } from '../lib/api';
import { fetchProviders } from '../lib/api';
import { fmtDistanceKm, haversineKm } from '../lib/geo';
import { Clock, MapPin, Phone, Star, ShieldCheck, Tag, Landmark, Compass, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProviderDetail({
  location,
}: {
  location: { lat: number; lng: number; accuracy?: number } | null;
}) {
  const { id } = useParams();
  const providerId = Number(id);

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const all = await fetchProviders({ limit: 100 });
      const found = all.find((p) => p.id === providerId) || null;
      setProvider(found);
    } catch (e: any) {
      setError(e?.message || 'Failed to load provider');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [providerId]);

  const distance = useMemo(() => {
    if (!provider || !location) return null;
    const km = haversineKm({ lat: location.lat, lng: location.lng }, { lat: provider.lat, lng: provider.lng });
    return fmtDistanceKm(km);
  }, [provider, location]);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-24">
      <TopBar title="Partner Profile" backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-[13px] font-medium text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4">
            <div className="h-48 skeleton rounded-2xl bg-white border border-gray-100" />
            <div className="h-72 skeleton rounded-2xl bg-white border border-gray-100" />
          </div>
        ) : provider ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-4"
          >
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <Landmark className="h-5 w-5" />
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                        {provider.name}
                      </h2>
                      <p className="mt-1 text-[12px] text-gray-500 leading-relaxed">
                        {provider.address}, {provider.city}
                      </p>
                    </div>
                    
                    {provider.verified && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1 text-[13px] font-semibold text-gray-900">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {provider.rating.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{provider.rating_count} reviews</div>
                    </div>
                    
                    <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1 text-[13px] font-semibold text-gray-900">
                        <Clock className="h-3.5 w-3.5 text-gray-400" /> Open
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5 truncate">{provider.open_hours}</div>
                    </div>
                    
                    <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-center">
                      <div className="text-[13px] font-semibold text-gray-900">
                        {distance ?? '—'}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">away</div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${provider.phone}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-[12px] font-semibold text-white transition-all hover:bg-[#2d2d4a] active:scale-95 cursor-pointer"
                    >
                      <Phone className="h-4 w-4" /> Call Partner
                    </a>
                    <a
                      href={`https://www.google.com/maps?q=${provider.lat},${provider.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-[12px] font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    >
                      <Compass className="h-4 w-4 text-gray-400" /> Directions
                    </a>
                  </div>

                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    <Link
                      to={`/service/${provider.service_slug}/request`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-[12px] font-semibold text-white transition-all hover:bg-amber-700 active:scale-95"
                    >
                      Request SOS
                    </Link>
                    <Link
                      to={`/provider-console?provider=${provider.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-[12px] font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
                    >
                      Provider Console <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-[var(--color-primary)] p-4 text-white relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center gap-2 text-[10px] font-medium text-blue-300 tracking-wider uppercase">
                  <Tag className="h-3.5 w-3.5" /> Services Provided
                </div>
                <p className="mt-2 text-[12px] font-medium leading-relaxed text-white/80">{provider.services}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white border border-gray-100 p-1 shadow-sm">
              <MapEmbed lat={provider.lat} lng={provider.lng} label={provider.name} />
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
              <h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Business Registration Info</h3>
              <div className="mt-3.5 space-y-3 text-[12px]">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                  <span className="text-gray-400">Direct Contact</span>
                  <span className="font-semibold text-gray-800">{provider.phone}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                  <span className="text-gray-400">Location City</span>
                  <span className="font-semibold text-gray-800">{provider.city}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                  <span className="text-gray-400">Business Hours</span>
                  <span className="font-semibold text-gray-800">{provider.open_hours}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                  <span className="text-gray-400">Verification</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Active Verified
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="rounded-2xl bg-white border border-gray-100 p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
              <Landmark className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-[14px] font-medium text-gray-600">Provider not found</p>
          </div>
        )}
      </div>
    </div>
  );
}
