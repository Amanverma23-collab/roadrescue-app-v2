import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import type { Service } from '../lib/api';
import { createSos } from '../lib/api';
import { PhoneCall, Siren, MapPin } from 'lucide-react';

export default function SOS({
  phone,
  location,
  services,
}: {
  phone: string | null;
  location: { lat: number; lng: number; accuracy?: number } | null;
  services: Service[];
}) {
  const nav = useNavigate();
  const [serviceSlug, setServiceSlug] = useState(services[0]?.slug || '');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const selected = useMemo(() => services.find((s) => s.slug === serviceSlug) || services[0] || null, [services, serviceSlug]);

  const submit = async () => {
    if (!phone) {
      nav('/');
      return;
    }
    if (!selected) return;

    setBusy(true);
    setMsg(null);
    try {
      await createSos({
        phone,
        service_slug: selected.slug,
        service_name: selected.name,
        note,
        lat: location?.lat,
        lng: location?.lng,
        accuracy_m: location?.accuracy,
      });
      setMsg('SOS request created. A provider will contact you shortly.');
      setNote('');
    } catch (e: any) {
      setMsg(e?.message || 'Failed to create SOS request');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <TopBar title="SOS" backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-white shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-white/85">Emergency request</div>
              <div className="mt-1 text-lg font-bold tracking-tight">One tap to share details</div>
              <div className="mt-2 text-sm leading-6 text-white/90">
                This will create a request log and include your location only if available.
              </div>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <Siren className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <PhoneCall className="h-4 w-4" /> Your phone
              </div>
              <div className="mt-1 text-sm font-bold">{phone || 'Not signed in'}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <MapPin className="h-4 w-4" /> Location
              </div>
              <div className="mt-1 text-sm font-bold">
                {location ? `${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}` : 'Not available'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-bold text-slate-900">Request details</div>

          <div className="mt-3">
            <label className="text-xs font-semibold text-slate-700">Service category</label>
            <select
              value={serviceSlug}
              onChange={(e) => setServiceSlug(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-900 outline-none"
            >
              {services.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <label className="text-xs font-semibold text-slate-700">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Flat tire near highway exit, need towing."
              className="mt-2 min-h-[96px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
            />
          </div>

          {msg ? (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
              {msg}
            </div>
          ) : null}

          <button
            disabled={busy || !phone}
            onClick={submit}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition enabled:hover:bg-orange-600 enabled:active:bg-orange-700 disabled:opacity-60"
          >
            <Siren className="h-5 w-5" /> {busy ? 'Sending…' : 'Create SOS request'}
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-slate-500">For emergencies, contact your local authorities.</div>
      </div>
    </div>
  );
}
