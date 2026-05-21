import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crosshair, MapPin, ShieldCheck } from 'lucide-react';
import { getCurrentPosition } from '../lib/geo';

export default function LocationGate({
  onAllow,
}: {
  onAllow: (p: { lat: number; lng: number; accuracy?: number }) => void;
}) {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async () => {
    setError(null);
    setBusy(true);
    try {
      const pos = await getCurrentPosition();
      onAllow({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
      nav('/home');
    } catch (e: any) {
      setError(e?.message || 'Unable to get your location');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-28 pt-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-base font-bold tracking-tight text-slate-900">Enable location</div>
            <div className="mt-1 text-sm leading-6 text-slate-600">
              We use your location to show the nearest providers for each service category.
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Trust & privacy
          </div>
          <div className="mt-1 text-xs leading-5 text-slate-600">
            Your location stays on your device. We only include it if you request SOS support.
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-800">
            {error}
          </div>
        ) : null}

        <button
          disabled={busy}
          onClick={request}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition enabled:hover:bg-blue-700 enabled:active:bg-blue-800 disabled:opacity-60"
        >
          <Crosshair className="h-5 w-5" /> {busy ? 'Requesting…' : 'Allow location'}
        </button>

        <button
          type="button"
          className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 active:bg-slate-100"
          onClick={() => {
            onAllow({ lat: 25.2048, lng: 55.2708, accuracy: 1200 });
            nav('/home');
          }}
        >
          Use approximate location
        </button>
      </div>

      <div className="mt-4 text-center text-xs text-slate-500">
        Tip: On desktop browsers, you may need to allow location in site settings.
      </div>
    </div>
  );
}
