import React from 'react';
import { Link } from 'react-router-dom';
import type { Service } from '../lib/api';
import { IconByName } from '../lib/icons';

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      to={`/service/${service.slug}`}
      className="group block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
          style={{ background: service.accent || '#2563eb' }}
        >
          <IconByName name={service.icon} className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-[15px] font-semibold text-slate-900">{service.name}</div>
            <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">Nearby</span>
          </div>
          <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            {service.subtitle || 'Find the nearest verified providers and call instantly.'}
          </div>
        </div>
      </div>
    </Link>
  );
}
