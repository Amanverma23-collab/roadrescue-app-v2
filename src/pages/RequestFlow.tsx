import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import type { Provider, Service } from '../lib/api';
import { fetchProviders, fetchServices } from '../lib/api';
import { fmtDistanceKm, haversineKm } from '../lib/geo';
import { AlertTriangle, CheckCircle2, MapPin, Phone, Send, ShieldCheck, Star } from 'lucide-react';

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
  return data;
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
  const [note, setNote] = useState('Broken down  need help asap');
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

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <TopBar title={service?.name || 'Send request'} backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900">Emergency roadside request</div>
              <div className="mt-1 text-xs leading-5 text-slate-600">
                Choose a nearby provider. Each card has a clear <span className="font-semibold">Send Request</span> button.
              </div>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified listings highlighted
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold text-slate-700">Message</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2 min-h-[86px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
              placeholder="Describe the issue"
            />
          </div>

          {err ? (
            <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-800">{err}</div>
          ) : null}
        </div>

        {loading ? (
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[172px] animate-pulse rounded-3xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {computed.map(({ p, km }) => (
              <div key={p.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-[15px] font-semibold text-slate-900">{p.name}</div>
                      {p.verified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                          <ShieldCheck className="h-3.5 w-3.5" /> Verified
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 line-clamp-1 text-xs text-slate-500">{p.address}, {p.city}</div>
                  </div>
                  <Link
                    to={`/provider/${p.id}`}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                  >
                    View
                  </Link>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-slate-50 px-3 py-2">
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-900">
                      <Star className="h-4 w-4 text-orange-500" /> {p.rating.toFixed(1)}
                    </div>
                    <div className="text-[11px] text-slate-500">{p.rating_count} ratings</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-2">
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-900">
                      <MapPin className="h-4 w-4 text-slate-700" /> {fmtDistanceKm(km)}
                    </div>
                    <div className="text-[11px] text-slate-500">distance</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-2">
                    <div className="text-xs font-semibold text-slate-900">Contact</div>
                    <a className="text-[11px] font-semibold text-blue-700" href={`tel:${p.phone}`}>Call</a>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => send(p)}
                    disabled={busyId === p.id}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:bg-orange-700 disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" /> {busyId === p.id ? 'Sending' : 'Send Request'}
                  </button>
                  <a
                    href={`tel:${p.phone}`}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}

            {!computed.length ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
                No providers found for this service.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
