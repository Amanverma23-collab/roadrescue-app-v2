import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import type { Provider, Service } from '../lib/api';
import { fetchProviders, fetchServices } from '../lib/api';
import { Check, X, MapPin, Phone, ShieldCheck, Star } from 'lucide-react';

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
};

async function fetchRequests(providerId: number): Promise<Request[]> {
  const res = await fetch(`/api/requests?provider_id=${providerId}`);
  const data = await res.json();
  return data;
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

export default function ProviderConsole() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const providerId = Number(sp.get('provider') || '0');

  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const provider = useMemo(() => providers.find((p) => p.id === providerId) || null, [providers, providerId]);
  const service = useMemo(
    () => (provider ? services.find((s) => s.slug === provider.service_slug) || null : null),
    [services, provider]
  );

  const load = async () => {
    try {
      setErr(null);
      setLoading(true);
      const [s, p] = await Promise.all([fetchServices(), fetchProviders({ limit: 200 })]);
      setServices(s);
      setProviders(p);
      if (providerId) {
        const r = await fetchRequests(providerId);
        setRequests(r);
      }
    } catch (e: any) {
      setErr(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId]);

  useEffect(() => {
    const t = setInterval(() => {
      if (providerId) fetchRequests(providerId).then(setRequests).catch(() => {});
    }, 2000);
    return () => clearInterval(t);
  }, [providerId]);

  if (!providerId) {
    return (
      <div className="min-h-screen bg-slate-50 pb-28">
        <TopBar title="Provider mode" backTo="/home" />
        <div className="mx-auto w-full max-w-md px-4 pt-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
            Pick a provider from any provider detail page using “Provider mode”.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <TopBar title="Provider console" backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="truncate text-[15px] font-semibold text-slate-900">{provider?.name}</div>
                {provider?.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                ) : null}
              </div>
              <div className="mt-1 text-xs text-slate-500">Category: {service?.name || provider?.service_slug}</div>
              <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-slate-800">
                <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-orange-500" /> {provider?.rating.toFixed(1)}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {provider?.city}</span>
                <a className="inline-flex items-center gap-1 text-blue-700" href={`tel:${provider?.phone}`}><Phone className="h-4 w-4" />Call</a>
              </div>
            </div>
            <Link
              to={`/provider/${providerId}`}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
            >
              View
            </Link>
          </div>
        </div>

        {err ? (
          <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-800">{err}</div>
        ) : null}

        {loading ? (
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-3xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {requests.map((r) => (
              <div key={r.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Request #{r.id}</div>
                    <div className="mt-1 text-xs text-slate-500">From: {r.customer_phone}</div>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">{r.status}</span>
                </div>

                <div className="mt-3 text-xs leading-5 text-slate-600">{r.note || ''}</div>

                <div className="mt-3 flex items-center gap-2">
                  {r.status === 'requested' ? (
                    <>
                      <button
                        onClick={async () => {
                          try {
                            await act(r.id, 'accept', { eta_minutes: 12 });
                            nav(`/track/${r.id}?mode=provider&provider=${providerId}`);
                          } catch (e: any) {
                            setErr(e?.message || 'Failed');
                          }
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800"
                      >
                        <Check className="h-4 w-4" /> Accept
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await act(r.id, 'decline');
                          } catch (e: any) {
                            setErr(e?.message || 'Failed');
                          }
                        }}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => nav(`/track/${r.id}?mode=provider&provider=${providerId}`)}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 active:bg-slate-950"
                    >
                      Open live tracking
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!requests.length ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
                No requests yet. Send one from the customer flow.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
