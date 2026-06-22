import React, { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import type { SosRequest } from '../lib/api';
import { motion } from 'framer-motion';
import { Clock, Phone, MapPin, Calendar, FileText } from 'lucide-react';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-24">
      <TopBar title="SOS History Log" backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm mb-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900">SOS Requests</h2>
              <p className="mt-1 text-[12px] text-gray-500">
                Chronological list of all roadside emergency logs.
              </p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 skeleton rounded-2xl bg-white border border-gray-100" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-3"
          >
            {items.map((it) => (
              <motion.div
                key={it.id}
                variants={itemVariants}
                className="rounded-2xl bg-white border border-gray-100 p-5 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-[14px] font-semibold text-gray-900">{it.service_name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-500">
                      <Calendar className="h-3 w-3" /> {new Date(it.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-gray-600 tracking-wider">
                    {it.status}
                  </span>
                </div>

                <div className="mt-3.5 space-y-2.5 text-[12px] text-gray-600">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                    <span className="text-gray-400 flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Driver Contact</span>
                    <span className="font-semibold text-gray-800">
                      {it.phone}
                      {phone && it.phone !== phone && (
                        <span className="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-medium text-gray-500">Other</span>
                      )}
                    </span>
                  </div>

                  <div className="rounded-lg bg-gray-50 px-3 py-2">
                    <span className="text-gray-400 flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Incident Note</span>
                    <p className="text-gray-700 font-medium mt-1 leading-relaxed">{it.note || 'No notes provided.'}</p>
                  </div>

                  {it.lat && it.lng && (
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <span className="text-gray-400 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> GPS Coordinates</span>
                      <span className="font-semibold text-gray-800">{it.lat.toFixed(4)}, {it.lng.toFixed(4)}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {!items.length && (
              <div className="rounded-2xl bg-white border border-gray-100 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-[14px] font-medium text-gray-600">No SOS requests yet</p>
                <p className="mt-1 text-[12px] text-gray-400">Your emergency history will appear here</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
