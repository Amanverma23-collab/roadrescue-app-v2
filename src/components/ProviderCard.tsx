import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Star, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import type { Provider } from '../lib/api';
import { motion } from 'framer-motion';

export default function ProviderCard({
  provider,
  distanceLabel,
}: {
  provider: Provider;
  distanceLabel: string;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Link
        to={`/provider/${provider.id}`}
        className="group block rounded-2xl bg-white border border-gray-100 p-5 hover:border-gray-200 hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-transform duration-200 group-hover:scale-105">
            <MapPin className="h-5 w-5" />
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[15px] font-semibold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors duration-200">
                  {provider.name}
                </h3>
                <p className="mt-1 truncate text-[12px] text-gray-500">
                  {provider.address}, {provider.city}
                </p>
              </div>
              
              {provider.verified && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-center">
                <div className="flex items-center justify-center gap-1 text-[13px] font-semibold text-gray-900">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {provider.rating.toFixed(1)}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">{provider.rating_count} reviews</div>
              </div>
              
              <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-center">
                <div className="text-[13px] font-semibold text-gray-900">{distanceLabel}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">away</div>
              </div>
              
              <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-center">
                <div className="flex items-center justify-center gap-1 text-[13px] font-semibold text-gray-900 truncate">
                  <Clock className="h-3 w-3 text-gray-400" />
                  {provider.open_hours}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">hours</div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <a
                href={`tel:${provider.phone}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-[12px] font-semibold text-white transition-all hover:bg-[#2d2d4a] active:scale-95 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-3.5 w-3.5" /> Call Now
              </a>
              <span className="inline-flex items-center gap-1 justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-gray-700 hover:bg-gray-50 group-hover:border-gray-300 transition-all duration-200">
                Details <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
