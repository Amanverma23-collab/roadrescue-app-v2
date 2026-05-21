import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import MapEmbed from '../components/MapEmbed';
import type { Provider } from '../lib/api';
import { fetchProviders } from '../lib/api';
import { fmtDistanceKm, haversineKm } from '../lib/geo';
import { Clock, MapPin, Phone, Star, ShieldCheck, Tag } from 'lucide-react';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId]);

  const distance = useMemo(() => {
    if (!provider || !location) return null;
    const km = haversineKm({ lat: location.lat, lng: location.lng }, { lat: provider.lat, lng: provider.lng });
    return fmtDistanceKm(km);
  }, [provider, location]);

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <TopBar title="Provider" backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        {error ? (
          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-800">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-3">
            <div className="h-44 animate-pulse rounded-3xl border border-slate-200 bg-white" />
            <div className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white" />
          </div>
        ) : provider ? (
          <div className="grid gap-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-base font-bold tracking-tight text-slate-900">{provider.name}</div>
                      <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
                        {provider.address}, {provider.city}
                      </div>
                    </div>
                    {provider.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl bg-slate-50 px-3 py-2">
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-900">
                        <Star className="h-4 w-4 text-orange-500" /> {provider.rating.toFixed(1)}
                      </div>
                      <div className="text-[11px] text-slate-500">{provider.rating_count} ratings</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-2">
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-900">
                        <Clock className="h-4 w-4 text-slate-700" />
                        Timings
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{provider.open_hours}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-2">
                      <div className="text-xs font-semibold text-slate-900">Distance</div>
                      <div className="text-[11px] text-slate-500">{distance ?? 'Enable location'}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href={`tel:${provider.phone}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800"
                    >
                      <Phone className="h-4 w-4" /> Call now
                    </a>
                    <a
                      href={`https://www.google.com/maps?q=${provider.lat},${provider.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 active:bg-slate-100"
                    >
                      Directions
                    </a>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Link
                      to={`/service/${provider.service_slug}/request`}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 active:bg-orange-700"
                    >
                      Send request
                    </Link>
                    <Link
                      to={`/provider-console?provider=${provider.id}`}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 active:bg-slate-100"
                    >
                      Provider mode
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                  <Tag className="h-4 w-4" /> Services offered
                </div>
                <div className="mt-2 text-sm leading-6 text-white/90">{provider.services}</div>
              </div>
            </div>

            <MapEmbed lat={provider.lat} lng={provider.lng} label={provider.name} />

            <div className="rounded-3xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600 shadow-sm">
              <div className="text-sm font-bold text-slate-900">Shop information</div>
              <div className="mt-2 grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Phone</span>
                  <span className="font-semibold text-slate-900">{provider.phone}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">City</span>
                  <span className="font-semibold text-slate-900">{provider.city}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Timings</span>
                  <span className="font-semibold text-slate-900">{provider.open_hours}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
            Provider not found.
          </div>
        )}
      </div>
    </div>
  );
}
