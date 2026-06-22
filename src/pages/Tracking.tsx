import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import type { Provider } from '../lib/api';
import { fetchProviders } from '../lib/api';
import { fmtDistanceKm, haversineKm } from '../lib/geo';
import { useInterval, lerp } from '../lib/realtime';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Siren,
  Milestone,
} from 'lucide-react';
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

type Update = {
  id: number;
  created_at: string;
  request_id: number;
  provider_lat: number;
  provider_lng: number;
  speed_kph: number | null;
};

async function getRequest(id: number): Promise<Request | null> {
  const res = await fetch(`/api/requests`);
  const data = await res.json();
  return (data || []).find((r: Request) => r.id === id) || null;
}

async function act(id: number, action: string, patch?: any): Promise<Request> {
  const res = await fetch('/api/requests', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, action, ...patch }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Action failed');
  return data as Request;
}

async function postUpdate(request_id: number, provider_lat: number, provider_lng: number, speed_kph?: number) {
  await fetch('/api/provider_updates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ request_id, provider_lat, provider_lng, speed_kph }),
  });
}

async function getUpdates(request_id: number): Promise<Update[]> {
  const res = await fetch(`/api/provider_updates?request_id=${request_id}&limit=200`);
  return res.json();
}

function statusLabel(status: string) {
  switch (status) {
    case 'requested':
      return { label: 'Request Sent', tone: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'accepted':
      return { label: 'En Route', tone: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'declined':
      return { label: 'Declined', tone: 'bg-gray-100 text-gray-700 border-gray-200' };
    case 'arrived':
      return { label: 'Arrived', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'completed':
      return { label: 'Completed', tone: 'bg-gray-900 text-white border-gray-900' };
    case 'cancelled':
      return { label: 'Cancelled', tone: 'bg-gray-100 text-gray-700 border-gray-200' };
    default:
      return { label: status, tone: 'bg-gray-100 text-gray-700 border-gray-200' };
  }
}

export default function Tracking({
  location,
}: {
  location: { lat: number; lng: number; accuracy?: number } | null;
}) {
  const { id } = useParams();
  const requestId = Number(id);
  const [sp] = useSearchParams();
  const mode = (sp.get('mode') || 'customer') as 'customer' | 'provider';
  const providerIdParam = Number(sp.get('provider') || '0');

  const [req, setReq] = useState<Request | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [simLat, setSimLat] = useState<number | null>(null);
  const [simLng, setSimLng] = useState<number | null>(null);

  const customerPoint = useMemo(() => {
    const lat = req?.customer_lat ?? location?.lat ?? null;
    const lng = req?.customer_lng ?? location?.lng ?? null;
    if (typeof lat !== 'number' || typeof lng !== 'number') return null;
    return { lat, lng };
  }, [req, location]);

  const providerPoint = useMemo(() => {
    const last = updates.length ? updates[updates.length - 1] : null;
    if (last) return { lat: last.provider_lat, lng: last.provider_lng };
    if (req?.provider_lat != null && req?.provider_lng != null) return { lat: req.provider_lat, lng: req.provider_lng };
    if (provider) return { lat: provider.lat, lng: provider.lng };
    return null;
  }, [updates, req, provider]);

  const distance = useMemo(() => {
    if (!customerPoint || !providerPoint) return null;
    return fmtDistanceKm(haversineKm(customerPoint, providerPoint));
  }, [customerPoint, providerPoint]);

  const bbox = useMemo(() => {
    if (!customerPoint || !providerPoint) return null;
    const minLat = Math.min(customerPoint.lat, providerPoint.lat) - 0.01;
    const maxLat = Math.max(customerPoint.lat, providerPoint.lat) + 0.01;
    const minLng = Math.min(customerPoint.lng, providerPoint.lng) - 0.01;
    const maxLng = Math.max(customerPoint.lng, providerPoint.lng) + 0.01;
    return { minLat, maxLat, minLng, maxLng };
  }, [customerPoint, providerPoint]);

  const mapSrc = useMemo(() => {
    if (bbox && customerPoint && providerPoint) {
      const markers = `&marker=${customerPoint.lat}%2C${customerPoint.lng}&marker=${providerPoint.lat}%2C${providerPoint.lng}`;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.minLng}%2C${bbox.minLat}%2C${bbox.maxLng}%2C${bbox.maxLat}&layer=mapnik${markers}`;
    }
    if (customerPoint) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${customerPoint.lng - 0.01}%2C${customerPoint.lat - 0.01}%2C${customerPoint.lng + 0.01}%2C${customerPoint.lat + 0.01}&layer=mapnik&marker=${customerPoint.lat}%2C${customerPoint.lng}`;
    }
    return `https://www.openstreetmap.org/export/embed.html?bbox=55.25%2C25.18%2C55.30%2C25.22&layer=mapnik`;
  }, [bbox, customerPoint, providerPoint]);

  const load = async () => {
    try {
      setErr(null);
      const r = await getRequest(requestId);
      setReq(r);
      if (r) {
        const prov = await fetchProviders({ limit: 300 });
        setProvider(prov.find((p) => p.id === r.provider_id) || null);
        const u = await getUpdates(requestId);
        setUpdates(u);
      }
    } catch (e: any) {
      setErr(e?.message || 'Failed to load');
    }
  };

  useEffect(() => {
    load();
  }, [requestId]);

  useInterval(() => {
    load().catch(() => {});
  }, 2000);

  useEffect(() => {
    if (mode !== 'provider') return;
    if (!req) return;
    if (simLat != null && simLng != null) return;
    const startLat = provider?.lat ?? req.provider_lat ?? null;
    const startLng = provider?.lng ?? req.provider_lng ?? null;
    if (typeof startLat === 'number' && typeof startLng === 'number') {
      setSimLat(startLat);
      setSimLng(startLng);
    }
  }, [mode, req, provider, simLat, simLng]);

  useInterval(
    () => {
      if (mode !== 'provider') return;
      if (!req || req.status !== 'accepted') return;
      if (!customerPoint) return;
      if (simLat == null || simLng == null) return;

      const t = 0.08;
      const nextLat = lerp(simLat, customerPoint.lat, t);
      const nextLng = lerp(simLng, customerPoint.lng, t);
      setSimLat(nextLat);
      setSimLng(nextLng);

      postUpdate(requestId, nextLat, nextLng, 32).catch(() => {});

      const km = haversineKm({ lat: nextLat, lng: nextLng }, customerPoint);
      if (km < 0.15) {
        act(requestId, 'arrived').catch(() => {});
      }
    },
    1200
  );

  const badge = statusLabel(req?.status || 'loading');
  const providerModeMismatch = mode === 'provider' && providerIdParam && req && req.provider_id !== providerIdParam;

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-24">
      <TopBar title={mode === 'provider' ? 'Operator Console' : 'Live Tracking'} backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        {err && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-[12px] font-medium text-red-700">
            {err}
          </div>
        )}

        {providerModeMismatch && (
          <div className="mt-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-[12px] font-medium text-red-700">
            Security mismatch: Selected request belongs to another mechanic.
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900">SOS Request #{requestId}</h2>
              <p className="mt-1 text-[12px] text-gray-500">
                {mode === 'provider' ? 'Customer location and route dispatch.' : 'Live tracking details of your responder.'}
              </p>
            </div>
            <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${badge.tone}`}>
              {badge.label}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3.5 py-2.5 text-[12px] font-medium">
              <span className="text-gray-500">Service Center</span>
              <span className="text-gray-900 truncate">{provider?.name || 'Loading details...'}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3.5 py-2.5 text-[12px] font-medium">
              <span className="text-gray-500">Distance Remaining</span>
              <span className="text-gray-900 font-semibold">{distance || 'Calculating...'}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3.5 py-2.5 text-[12px] font-medium">
              <span className="text-gray-500">Estimated ETA</span>
              <span className="text-gray-900 font-semibold">{req?.eta_minutes ? `${req.eta_minutes} min` : 'Calculating...'}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            {provider?.phone && (
              <a
                href={`tel:${provider.phone}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-[12px] font-semibold text-white transition-all hover:bg-[#2d2d4a] active:scale-95 cursor-pointer"
              >
                <Phone className="h-3.5 w-3.5" /> Call Partner
              </a>
            )}

            <a
              href={mode === 'provider' 
                ? (customerPoint ? `https://www.google.com/maps?q=${customerPoint.lat},${customerPoint.lng}` : undefined)
                : (providerPoint ? `https://www.google.com/maps?q=${providerPoint.lat},${providerPoint.lng}` : undefined)
              }
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            >
              <Navigation className="h-4 w-4" />
            </a>
          </div>

          {mode === 'customer' && req?.status === 'requested' && (
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-4 text-[12px] font-medium text-amber-800">
              Dispatch alert sent. Provider must accept to share live location.
            </div>
          )}

          {mode === 'provider' && req?.status === 'requested' && (
            <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-4 text-[12px] text-gray-600">
              Review requests and press "Accept" from Provider Console to start simulation.
            </div>
          )}
        </motion.div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Geographic Mapping</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Dual-marker orientation system</p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-[11px] font-medium text-white">
              <LocateFixed className="h-3.5 w-3.5 text-blue-400 animate-spin" /> Live
            </div>
          </div>
          <iframe title="Tracking Map" src={mapSrc} className="h-64 w-full" loading="lazy" />
        </div>

        <div className="mt-4 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Milestone Timeline</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Real-time status sequence</p>
            </div>
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-600">
              {updates.length} pings
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between text-[12px] font-medium text-gray-900">
              <span className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
                  <Siren className="h-3.5 w-3.5 text-amber-600" />
                </div>
                Dispatch Requested
              </span>
              <span className="text-[10px] text-gray-400">
                {req?.created_at ? new Date(req.created_at).toLocaleTimeString() : '—'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[12px] font-medium text-gray-900">
              <span className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                </div>
                Request Accepted
              </span>
              <span className="text-[10px] text-gray-400">
                {req?.accepted_at ? new Date(req.accepted_at).toLocaleTimeString() : 'Pending'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[12px] font-medium text-gray-900">
              <span className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                Responder Arrived
              </span>
              <span className="text-[10px] text-gray-400">
                {req?.status === 'arrived' ? 'Arrived Now' : 'Pending route'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[12px] font-medium text-gray-900">
              <span className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100">
                  <Milestone className="h-3.5 w-3.5 text-purple-600" />
                </div>
                Dispatch Completed
              </span>
              <span className="text-[10px] text-gray-400">
                {req?.completed_at ? new Date(req.completed_at).toLocaleTimeString() : 'In progress'}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-2">
            {mode === 'provider' ? (
              <>
                <button
                  disabled={busy || !req || req.status !== 'accepted'}
                  onClick={async () => {
                    if (!req) return;
                    setBusy(true);
                    try {
                      await act(req.id, 'completed');
                    } catch (e: any) {
                      setErr(e?.message || 'Failed');
                    } finally {
                      setBusy(false);
                    }
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-[12px] font-semibold text-white hover:bg-gray-800 active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  <span>Finish SOS Job</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-[10px] text-gray-400 leading-relaxed text-center">
                  Live movement simulation updates location pings automatically.
                </p>
              </>
            ) : (
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-[11px] leading-relaxed text-gray-500">
                <div className="flex items-center gap-1.5 font-semibold text-gray-800 mb-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Secure dispatch controls
                </div>
                For life-threatening situations, contact standard police / healthcare authorities immediately.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
