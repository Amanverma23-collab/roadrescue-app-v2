import React from 'react';
import { Link } from 'react-router-dom';
import type { Service } from '../lib/api';
import { IconByName } from '../lib/icons';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Link
        to={`/service/${service.slug}`}
        className="group block rounded-2xl bg-white border border-gray-100 p-4 hover:border-gray-200 hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-200 group-hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${service.accent || '#1a1a2e'}, ${service.accent || '#2d2d4a'})`,
            }}
          >
            <IconByName name={service.icon} className="h-5 w-5" />
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[14px] font-semibold text-gray-900 leading-snug group-hover:text-[var(--color-primary)] transition-colors duration-200">
                {service.name}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  24/7
                </span>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
            </div>
            <p className="mt-1 line-clamp-1 text-[12px] text-gray-500">
              {service.subtitle || 'Find the nearest verified providers.'}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
