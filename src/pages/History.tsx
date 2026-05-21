import React, { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import type { SosRequest } from '../lib/api';

export default function History({ phone }: { phone: string | null }) {
  const [items, setItems] = useState<SosRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/sos?limit=50');
      const data = await res.json();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <TopBar title="History" backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-bold text-slate-900">SOS requests</div>
          <div className="mt-1 text-xs text-slate-500">Recent requests created from this app instance.</div>
        </div>

        {loading ? (
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-3xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {items.map((it) => (
              <div key={it.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">{it.service_name}</div>
                    <div className="mt-1 text-xs text-slate-500">{new Date(it.created_at).toLocaleString()}</div>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">{it.status}</span>
                </div>
                <div className="mt-3 grid gap-1 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-500">Phone:</span> <span className="font-semibold text-slate-900">{it.phone}</span>
                    {phone && it.phone !== phone ? (
                      <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">other</span>
                    ) : null}
                  </div>
                  <div className="line-clamp-2">
                    <span className="text-slate-500">Note:</span> {it.note || '—'}
                  </div>
                  <div>
                    <span className="text-slate-500">Location:</span> {it.lat && it.lng ? `${it.lat.toFixed(4)}, ${it.lng.toFixed(4)}` : '—'}
                  </div>
                </div>
              </div>
            ))}
            {!items.length ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
                No SOS requests yet.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
