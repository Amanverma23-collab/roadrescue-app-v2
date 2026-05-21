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
} from 'lucide-react';

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
  return data;
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
      return { label: 'Request sent', tone: 'bg-orange-50 text-orange-700 border-orange-200' };
    case 'accepted':
      return { label: 'Accepted  en route', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'declined':
      return { label: 'Declined', tone: 'bg-slate-100 text-slate-700 border-slate-200' };
    case 'arrived':
      return { label: 'Arrived', tone: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'completed':
      return { label: 'Completed', tone: 'bg-slate-900 text-white border-slate-900' };
    case 'cancelled':
      return { label: 'Cancelled', tone: 'bg-slate-100 text-slate-700 border-slate-200' };
    default:
      return { label: status, tone: 'bg-slate-100 text-slate-700 border-slate-200' };
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

  // Local simulated provider position for provider-mode.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  // Poll request + updates.
  useInterval(() => {
    load().catch(() => {});
  }, 2000);

  // Initialize provider simulation start point.
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

  // Simulated real-time movement from provider to customer when accepted.
  useInterval(
    () => {
      if (mode !== 'provider') return;
      if (!req || req.status !== 'accepted') return;
      if (!customerPoint) return;
      if (simLat == null || simLng == null) return;

      const t = 0.08; // step
      const nextLat = lerp(simLat, customerPoint.lat, t);
      const nextLng = lerp(simLng, customerPoint.lng, t);
      setSimLat(nextLat);
      setSimLng(nextLng);

      // Persist update for customer to see.
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
    <div className="min-h-screen bg-slate-50 pb-28">
      <TopBar title={mode === 'provider' ? 'Live tracking (provider)' : 'Live tracking'} backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        {err ? (
          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-800">{err}</div>
        ) : null}

        {providerModeMismatch ? (
          <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-800">
            This request belongs to another provider.
          </div>
        ) : null}

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-slate-900">Request #{requestId}</div>
              <div className="mt-1 text-xs text-slate-500">
                {mode === 'provider' ? 'You can see the customer location and navigate.' : 'Track your provider in real time.'}
              </div>
            </div>
            <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${badge.tone}`}>{badge.label}</span>
          </div>

          <div className="mt-3 grid gap-2">
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs">
              <span className="text-slate-500">Provider</span>
              <span className="font-semibold text-slate-900 truncate">{provider?.name || ''}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs">
              <span className="text-slate-500">Distance</span>
              <span className="font-semibold text-slate-900">{distance || ''}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs">
              <span className="text-slate-500">ETA</span>
              <span className="font-semibold text-slate-900">{req?.eta_minutes ? `${req.eta_minutes} min` : 'Calculating'}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            {provider?.phone ? (
              <a
                href={`tel:${provider.phone}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
            ) : null}

            {mode === 'provider' ? (
              <a
                href={customerPoint ? `https://www.google.com/maps?q=${customerPoint.lat},${customerPoint.lng}` : undefined}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              >
                <Navigation className="h-4 w-4" />
              </a>
            ) : (
              <a
                href={providerPoint ? `https://www.google.com/maps?q=${providerPoint.lat},${providerPoint.lng}` : undefined}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              >
                <Navigation className="h-4 w-4" />
              </a>
            )}
          </div>

          {mode === 'customer' && req?.status === 'requested' ? (
            <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-800">
              Waiting for the provider to accept
            </div>
          ) : null}

          {mode === 'provider' && req?.status === 'requested' ? (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
              Accept the request from the Provider Console to start live tracking.
            </div>
          ) : null}
        </div>

        <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900">Live map</div>
              <div className="text-xs text-slate-500">Two markers customer and provider</div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
              <LocateFixed className="h-4 w-4" /> Live
            </div>
          </div>
          <iframe title="Tracking map" src={mapSrc} className="h-72 w-full" loading="lazy" />
        </div>

        <div className="mt-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-slate-900">Status updates</div>
              <div className="mt-1 text-xs text-slate-500">Request state + real-time movement indicators</div>
            </div>
            <span className="rounded-2xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">{updates.length} pings</span>
          </div>

          <div className="mt-3 grid gap-2">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-xs">
              <span className="inline-flex items-center gap-2 text-slate-700"><Siren className="h-4 w-4 text-orange-500" /> Requested</span>
              <span className="text-slate-500">{req?.created_at ? new Date(req.created_at).toLocaleTimeString() : ''}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-xs">
              <span className="inline-flex items-center gap-2 text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Accepted</span>
              <span className="text-slate-500">{req?.accepted_at ? new Date(req.accepted_at).toLocaleTimeString() : ''}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-xs">
              <span className="inline-flex items-center gap-2 text-slate-700"><MapPin className="h-4 w-4 text-blue-600" /> Arrived</span>
              <span className="text-slate-500">{req?.status === 'arrived' ? 'Now' : ''}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-xs">
              <span className="inline-flex items-center gap-2 text-slate-700"><Clock className="h-4 w-4 text-slate-700" /> Completed</span>
              <span className="text-slate-500">{req?.completed_at ? new Date(req.completed_at).toLocaleTimeString() : ''}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
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
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 active:bg-slate-950 disabled:opacity-60"
                >
                  Finish job <ArrowRight className="h-4 w-4" />
                </button>
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs text-slate-600">
                  <div className="font-semibold text-slate-900">Simulated movement</div>
                  <div className="mt-1">Provider marker pings every ~1.2s to mimic real-time tracking.</div>
                </div>
              </>
            ) : (
              <div className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Safety note
                </div>
                <div className="mt-1">Share only necessary details. For life-threatening emergencies, call local authorities.</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 text-center text-xs text-slate-500">
          Tip: Open <span className="font-semibold">Provider console</span> from a provider detail page to accept/track.
        </div>
      </div>
    </div>
  );
}
