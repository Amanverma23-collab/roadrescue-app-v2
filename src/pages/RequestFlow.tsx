import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import type { Provider, Service } from '../lib/api';
import { fetchProviders, fetchServices } from '../lib/api';
import { fmtDistanceKm, haversineKm } from '../lib/geo';
import { AlertTriangle, CheckCircle2, MapPin, Phone, Send, ShieldCheck, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

type Request = {
  id: number;
  created_at: string;
  customer_phone: string;
  service_slug: string;
  provider_id: number;
  note: string | null;
  customer_lat: number | null;
  customer_lng: number | null;
  provider_lat: number | null;
  provider_lng: number | null;
  eta_minutes: number | null;
  status: string;
  accepted_at: string | null;
  declined_at: string | null;
  completed_at: string | null;
};

async function createRequest(payload: any): Promise<Request> {
  const res = await fetch('/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to create request');
  return data as Request;
}

export default function RequestFlow({
  phone,
  location,
}: {
  phone: string | null;
  location: { lat: number; lng: number; accuracy?: number } | null;
}) {
  const nav = useNavigate();
  const { slug } = useParams();
  const serviceSlug = slug || '';

  const [service, setService] = useState<Service | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('Broken down, need help ASAP');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [services, prov] = await Promise.all([fetchServices(), fetchProviders({ service_slug: serviceSlug })]);
        setService(services.find((s) => s.slug === serviceSlug) || null);
        setProviders(prov);
      } catch (e: any) {
        setErr(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [serviceSlug]);

  const computed = useMemo(() => {
    return providers
      .map((p) => {
        const km = location ? haversineKm({ lat: location.lat, lng: location.lng }, { lat: p.lat, lng: p.lng }) : Number.POSITIVE_INFINITY;
        return { p, km };
      })
      .sort((a, b) => a.km - b.km);
  }, [providers, location]);

  const send = async (provider: Provider) => {
    if (!phone) {
      nav('/');
      return;
    }
    setErr(null);
    setBusyId(provider.id);
    try {
      const req = await createRequest({
        customer_phone: phone,
        service_slug: serviceSlug,
        provider_id: provider.id,
        note,
        customer_lat: location?.lat,
        customer_lng: location?.lng,
      });
      nav(`/track/${req.id}`);
    } catch (e: any) {
      setErr(e?.message || 'Failed to send request');
    } finally {
      setBusyId(null);
    }
  };

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
      <TopBar title={service?.name || 'SOS Request'} backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[15px] font-semibold text-gray-900">Emergency Roadside Request</h2>
              <p className="mt-1 text-[12px] text-gray-500 leading-relaxed">
                Choose a nearby mechanic. Dispatch alerts are sent immediately.
              </p>
              <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> High priority matching
              </span>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Describe your breakdown</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2 min-h-[80px] w-full resize-none rounded-xl input-field"
              placeholder="e.g. Flat tire near highway exit, need towing."
            />
          </div>

          {err && (
            <div className="mt-3.5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-[12px] font-medium text-red-700">
              {err}
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-36 skeleton rounded-2xl bg-white border border-gray-100" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mt-4 grid gap-3"
          >
            {computed.map(({ p, km }) => (
              <motion.div
                key={p.id}
                variants={itemVariants}
                className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[15px] font-semibold text-gray-900">{p.name}</h3>
                      {p.verified && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-700">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-[12px] text-gray-500">{p.address}, {p.city}</p>
                  </div>
                  <Link
                    to={`/provider/${p.id}`}
                    className="shrink-0 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 px-3 py-1.5 text-[12px] font-semibold text-gray-700 transition-all"
                  >
                    View
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-[12px] font-semibold text-gray-900">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {p.rating.toFixed(1)}
                    </div>
                    <div className="text-[9px] text-gray-500 mt-0.5">{p.rating_count} reviews</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-center">
                    <div className="text-[12px] font-semibold text-gray-900">{fmtDistanceKm(km)}</div>
                    <div className="text-[9px] text-gray-500 mt-0.5">distance</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-center">
                    <div className="text-[12px] font-semibold text-gray-900">Direct</div>
                    <a className="text-[9px] font-medium text-blue-600 hover:text-blue-700 block mt-0.5" href={`tel:${p.phone}`}>Call Link</a>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => send(p)}
                    disabled={busyId === p.id}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-3 text-[12px] font-semibold text-white transition active:scale-95 disabled:opacity-60 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" /> 
                    <span>{busyId === p.id ? 'Sending...' : 'Dispatch Now'}</span>
                  </button>
                  <a
                    href={`tel:${p.phone}`}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4 py-3 text-gray-700 active:scale-95 transition-all"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}

            {!computed.length && (
              <div className="rounded-2xl bg-white border border-gray-100 p-8 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-[14px] font-medium text-gray-600">No active providers nearby</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
