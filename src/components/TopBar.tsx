import { Menu } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, ChevronLeft, LogOut, Settings, User, Shield, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopBar({ title, backTo, onLogout }: { title: string; backTo?: string; onLogout?: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loc = useLocation();
  const canGoBack = Boolean(backTo) && loc.pathname !== backTo;

  return (
    <>
      <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto flex w-full max-w-md items-center gap-3 px-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {canGoBack ? (
              <Link
                to={backTo!}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-700 transition-colors hover:bg-gray-100 active:scale-95"
                aria-label="Back"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
            ) : (
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white transition-all hover:bg-[#2d2d4a] active:scale-95 cursor-pointer"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <div className="min-w-0">
              <h1 className="truncate text-[15px] font-semibold text-gray-900 leading-tight">{title}</h1>
              <p className="truncate text-[11px] text-gray-500">Fast rescue, verified professionals</p>
            </div>
          </div>
          <button
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 active:scale-95 cursor-pointer"
            aria-label="Alerts"
            onClick={() => alert('RoadRescue notifications are up-to-date.')}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-[190] bg-black/30 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-[200] flex w-72 flex-col bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm">
                    RR
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 text-sm block">RoadRescue</span>
                    <span className="text-[11px] text-gray-500">Emergency Network</span>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <User className="h-4 w-4" />
                    </div>
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                      <Settings className="h-4 w-4" />
                    </div>
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <span>Help & Support</span>
                  </button>
                </div>

                <div className="my-4 border-t border-gray-100" />

                <div className="rounded-xl bg-gray-50 p-3.5">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                    <Shield className="h-3.5 w-3.5 text-emerald-500" /> App Version
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-gray-600">RoadRescue v2.0</p>
                </div>
              </div>

              <div className="border-t border-gray-100 p-4">
                <button
                  onClick={() => onLogout?.() ?? (() => {
                    localStorage.removeItem('rr_phone_v1');
                    localStorage.removeItem('rr_loc_v1');
                    localStorage.removeItem('rr_role');
                    localStorage.removeItem('userType');
                    window.location.href = "/";
                  })()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 hover:bg-red-100 px-4 py-3 text-sm font-medium text-red-600 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
