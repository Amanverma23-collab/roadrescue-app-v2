import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import { Bell, Moon, Globe, Shield, ChevronRight, Smartphone, MapPin, Volume2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState('en');

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-24">
      <TopBar title="Settings" backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
        >
          <h2 className="text-[15px] font-semibold text-gray-900">Preferences</h2>
          <p className="mt-1 text-[12px] text-gray-500">Customize your app experience.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="mt-4 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-gray-900">Push Notifications</div>
                  <div className="text-[11px] text-gray-500">SOS alerts and updates</div>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-7 rounded-full relative cursor-pointer transition-all ${notifications ? 'bg-emerald-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-sm transition-all ${notifications ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-gray-900">Location Sharing</div>
                  <div className="text-[11px] text-gray-500">Share GPS with responders</div>
                </div>
              </div>
              <button
                onClick={() => setLocationSharing(!locationSharing)}
                className={`w-12 h-7 rounded-full relative cursor-pointer transition-all ${locationSharing ? 'bg-emerald-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-sm transition-all ${locationSharing ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                  <Moon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-gray-900">Dark Mode</div>
                  <div className="text-[11px] text-gray-500">Reduce eye strain</div>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-7 rounded-full relative cursor-pointer transition-all ${darkMode ? 'bg-emerald-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-sm transition-all ${darkMode ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Volume2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-gray-900">Alert Sounds</div>
                  <div className="text-[11px] text-gray-500">SOS notification sounds</div>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-12 h-7 rounded-full relative cursor-pointer transition-all ${soundEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-sm transition-all ${soundEnabled ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-4 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Globe className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium text-gray-900">Language</div>
                <div className="text-[11px] text-gray-500">App display language</div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-[12px] font-medium text-gray-700 outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="mt-4 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Shield className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium text-gray-900">Privacy & Security</div>
                <div className="text-[11px] text-gray-500">Data protection settings</div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mt-4 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <Smartphone className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium text-gray-900">App Info</div>
                <div className="text-[11px] text-gray-500">Version, cache, storage</div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </motion.div>

        <p className="mt-6 text-center text-[11px] text-gray-400">
          RoadRescue v2.0 — Emergency Roadside Assistance
        </p>
      </div>
    </div>
  );
}
