import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Notification = {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  time: string;
  read: boolean;
};

const defaultNotifications: Notification[] = [
  {
    id: 1,
    title: 'Welcome to RoadRescue!',
    message: 'Your account has been created successfully. Start by selecting a service.',
    type: 'success',
    time: 'Just now',
    read: false,
  },
  {
    id: 2,
    title: 'GPS Location Active',
    message: 'Your location is being used to find nearby providers.',
    type: 'info',
    time: '2 min ago',
    read: false,
  },
  {
    id: 3,
    title: 'Emergency Ready',
    message: 'SOS feature is active. Tap SOS anytime for immediate help.',
    type: 'warning',
    time: '5 min ago',
    read: true,
  },
];

const iconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  info: 'bg-blue-50 text-blue-600',
};

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('rr_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch { return defaultNotifications; }
    }
    return defaultNotifications;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    localStorage.setItem('rr_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <>
      <button
        onClick={() => { setOpen(true); markAllRead(); }}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 active:scale-95 cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[190] bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 right-0 z-[200] mx-auto max-w-md bg-white shadow-xl rounded-b-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-gray-900" />
                  <h2 className="text-[15px] font-semibold text-gray-900">Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--color-accent)] px-1.5 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-[11px] font-medium text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="max-h-[70vh] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                      <Bell className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="mt-3 text-[13px] font-medium text-gray-500">No notifications yet</p>
                    <p className="mt-1 text-[11px] text-gray-400">Updates will appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {notifications.map((n) => {
                      const Icon = iconMap[n.type];
                      return (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-5 py-4 transition-colors ${
                            !n.read ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colorMap[n.type]}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-[13px] font-semibold text-gray-900 truncate">{n.title}</p>
                              {!n.read && <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] shrink-0" />}
                            </div>
                            <p className="mt-0.5 text-[12px] text-gray-500 leading-relaxed">{n.message}</p>
                            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-400">
                              <Clock className="h-3 w-3" />
                              {n.time}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
