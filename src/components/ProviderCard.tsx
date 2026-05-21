import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Star, ShieldCheck } from 'lucide-react';
import type { Provider } from '../lib/api';

export default function ProviderCard({
  provider,
  distanceLabel,
}: {
  provider: Provider;
  distanceLabel: string;
}) {
  return (
    <Link
      to={`/provider/${provider.id}`}
      className="group block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-semibold text-slate-900">{provider.name}</div>
              <div className="mt-0.5 line-clamp-1 text-xs text-slate-500">
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
                <Star className="h-4 w-4 text-orange-500" />
                {provider.rating.toFixed(1)}
              </div>
              <div className="text-[11px] text-slate-500">{provider.rating_count} ratings</div>
            </div>
            <div className="rounded-2xl bg-slate-50 px-3 py-2">
              <div className="text-xs font-semibold text-slate-900">{distanceLabel}</div>
              <div className="text-[11px] text-slate-500">from you</div>
            </div>
            <div className="rounded-2xl bg-slate-50 px-3 py-2">
              <div className="text-xs font-semibold text-slate-900">Open</div>
              <div className="text-[11px] text-slate-500 line-clamp-1">{provider.open_hours}</div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <a
              href={`tel:${provider.phone}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="h-4 w-4" /> Call
            </a>
            <span className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800">
              Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
