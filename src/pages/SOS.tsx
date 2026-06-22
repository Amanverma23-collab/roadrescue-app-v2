import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import type { Service } from '../lib/api';
import { createSos } from '../lib/api';
import { PhoneCall, Siren, MapPin, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
      setMsg('SOS emergency dispatch created. Nearby providers have been alerted.');
      setNote('');
    } catch (e: any) {
      setMsg(e?.message || 'Failed to create SOS request');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-24">
      <TopBar title="SOS Emergency Panel" backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl bg-gradient-to-br from-red-600 to-red-700 p-5 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/5" />
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 blur-lg" />

          <div className="flex items-start justify-between gap-3 relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                Emergency Mode
              </span>
              <h2 className="mt-2.5 text-lg font-bold tracking-tight leading-tight">Immediate Dispatch Request</h2>
              <p className="mt-2 text-[12px] leading-relaxed text-red-100">
                Creating an SOS broadcasts your exact GPS coordinates to all active responders.
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 emergency-pulse">
              <Siren className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 relative z-10">
            <div className="rounded-xl bg-white/10 p-3.5">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-red-200 uppercase tracking-wider">
                <PhoneCall className="h-3.5 w-3.5" /> Driver Contact
              </div>
              <p className="mt-1.5 text-[13px] font-semibold text-white truncate">{phone || 'Not Signed In'}</p>
            </div>
            
            <div className="rounded-xl bg-white/10 p-3.5">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-red-200 uppercase tracking-wider">
                <MapPin className="h-3.5 w-3.5" /> Exact Coords
              </div>
              <p className="mt-1.5 text-[13px] font-semibold text-white">
                {location ? `${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}` : 'Unavailable'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-4 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
        >
          <h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">SOS Dispatch Parameters</h3>
          
          <div className="mt-4">
            <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Select Emergency Category</label>
            <select
              value={serviceSlug}
              onChange={(e) => setServiceSlug(e.target.value)}
              className="mt-2 w-full rounded-xl input-field cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {services.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Incident Details (Optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Engine breakdown on Highway Sector 4 exit, smoke visible."
              className="mt-2 min-h-[96px] w-full resize-none rounded-xl input-field"
            />
          </div>

          {msg && (
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-[13px] font-medium text-amber-800">
              {msg}
            </div>
          )}

          <button
            disabled={busy || !phone}
            onClick={submit}
            className="mt-5 btn-accent w-full"
          >
            <Siren className="h-4 w-4" /> 
            <span>{busy ? 'Alerting Responders...' : 'Transmit SOS Signal'}</span>
          </button>
        </motion.div>

        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-4 text-[12px] font-medium leading-relaxed text-amber-800 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
          <p>
            Prank requests or system abuse will result in account bans. For life-threatening emergencies, dial standard helpline numbers immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
