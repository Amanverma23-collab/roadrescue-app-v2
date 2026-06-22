import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crosshair, MapPin, ShieldCheck } from 'lucide-react';
import { getCurrentPosition } from '../lib/geo';
import { motion } from 'framer-motion';

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
    <div className="relative min-h-screen bg-[var(--color-surface)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-md h-56 pointer-events-none">
        <div className="absolute top-0 left-10 w-56 h-56 rounded-full bg-blue-400/8 blur-[60px]" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-purple-400/5 blur-[50px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full max-w-md"
      >
        <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
          <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4">
              <span className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping" />
              <MapPin className="relative z-10 h-7 w-7" />
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Enable Location Services</h2>
            <p className="mt-2 text-[13px] text-gray-500 max-w-xs leading-relaxed">
              We require access to locate the nearest emergency responders in real time.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-gray-50 p-4 flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-[13px] font-semibold text-gray-900">Your Privacy is Protected</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-gray-500">
                  Your coordinates remain on-device and are shared only when initiating an SOS support ticket.
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-[13px] font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              disabled={busy}
              onClick={request}
              className="btn-primary w-full"
            >
              <Crosshair className="h-4 w-4" /> 
              <span>{busy ? 'Detecting Location...' : 'Allow GPS Access'}</span>
            </button>

            <button
              type="button"
              className="btn-secondary w-full"
              onClick={() => {
                onAllow({ lat: 25.2048, lng: 55.2708, accuracy: 1200 });
                nav('/home');
              }}
            >
              Use Approximate Location (Dubai Core)
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-gray-400">
          Note: If prompts are blocked, update browser permission settings manually.
        </p>
      </motion.div>
    </div>
  );
}
