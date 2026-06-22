import {
  ShieldCheck,
  Eye,
  Phone,
  Wrench,
  TrendingUp,
  Clock,
  MapPin,
  Star,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TopBar from "../components/TopBar";

const LS_OWNER_NAME = 'rr_provider_owner_name';
const LS_SHOP_NAME = 'rr_provider_shop_name';
const LS_SHOP_CATEGORY = 'rr_provider_shop_category';
const LS_SHOP_ADDRESS = 'rr_provider_shop_address';
const LS_SHOP_OPEN = 'rr_provider_shop_open';
const LS_SHOP_CLOSE = 'rr_provider_shop_close';
const LS_DARK_MODE = 'rr_settings_dark_mode';

export default function ProviderDashboard() {
  const nav = useNavigate();
  const [busyMode, setBusyMode] = useState(false);
  const [closedMode, setClosedMode] = useState(false);

  const shopName = localStorage.getItem(LS_SHOP_NAME) || 'My Shop';
  const ownerName = localStorage.getItem(LS_OWNER_NAME) || '';
  const category = localStorage.getItem(LS_SHOP_CATEGORY) || 'Car Mechanic';
  const address = localStorage.getItem(LS_SHOP_ADDRESS) || '';
  const openTime = localStorage.getItem(LS_SHOP_OPEN) || '09:00';
  const closeTime = localStorage.getItem(LS_SHOP_CLOSE) || '21:00';

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const isOpen = useMemo(() => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const current = h * 60 + m;
    const [oh, om] = openTime.split(':').map(Number);
    const [ch, cm] = closeTime.split(':').map(Number);
    return current >= oh * 60 + om && current < ch * 60 + cm;
  }, [openTime, closeTime]);

  const logout = () => {
    localStorage.removeItem("rr_phone_v1");
    localStorage.removeItem("rr_loc_v1");
    localStorage.removeItem("rr_role");
    localStorage.removeItem("userType");
    nav("/", { replace: true });
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32">
      <TopBar title="Dashboard" onLogout={logout} />
      <div className="max-w-md mx-auto px-4 pt-5">

        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden bg-[var(--color-primary)] p-5 text-white shadow-lg relative"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5 blur-xl" />
          <div className="absolute -left-6 bottom-0 w-24 h-24 rounded-full bg-purple-500/10 blur-lg" />

          <div className="relative z-10">
            <div className="text-[11px] opacity-60 font-medium">{greeting}</div>
            <h1 className="text-xl font-bold mt-1 tracking-tight">{shopName}</h1>
            <div className="flex items-center gap-2 mt-2.5">
              <div className="bg-white/20 px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Verified
              </div>
              <div className="bg-emerald-500/90 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                Premium Active
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/10 p-3">
                <div className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Status</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className="text-[12px] font-semibold">{isOpen ? 'Open Now' : 'Closed'}</span>
                </div>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <div className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Category</div>
                <p className="mt-1 text-[12px] font-semibold">{category}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm mt-4"
        >
          <div className="font-semibold text-[14px] text-gray-900 mb-4">Availability</div>
          <div className="space-y-3">
            <div className="rounded-xl bg-gray-50 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-[13px] text-gray-900">Busy Mode</div>
                  <div className="text-[11px] text-gray-500">Customers see you as busy</div>
                </div>
              </div>
              <button
                onClick={() => { setBusyMode(!busyMode); setClosedMode(false); }}
                className={`w-12 h-7 rounded-full relative cursor-pointer transition-all ${busyMode ? 'bg-amber-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-sm transition-all ${busyMode ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <Wrench className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-[13px] text-gray-900">Closed Mode</div>
                  <div className="text-[11px] text-gray-500">Temporarily hidden from search</div>
                </div>
              </div>
              <button
                onClick={() => { setClosedMode(!closedMode); setBusyMode(false); }}
                className={`w-12 h-7 rounded-full relative cursor-pointer transition-all ${closedMode ? 'bg-red-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-sm transition-all ${closedMode ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-3">
              <Eye className="h-4 w-4" />
            </div>
            <div className="text-xl font-bold text-gray-900">1,284</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Profile Views</div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
              <TrendingUp className="h-3 w-3" /> +12% this week
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-3">
              <Phone className="h-4 w-4" />
            </div>
            <div className="text-xl font-bold text-gray-900">326</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Call Clicks</div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
              <TrendingUp className="h-3 w-3" /> +8% this week
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 mb-3">
              <DollarSign className="h-4 w-4" />
            </div>
            <div className="text-xl font-bold text-gray-900">₹12.4K</div>
            <div className="text-[11px] text-gray-500 mt-0.5">This Month</div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-red-600">
              <TrendingDown className="h-3 w-3" /> -3% vs last month
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600 mb-3">
              <Star className="h-4 w-4" />
            </div>
            <div className="text-xl font-bold text-gray-900">4.8</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Avg Rating</div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-amber-600">
              <Star className="h-3 w-3 fill-amber-400" /> 89 reviews
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm mt-4"
        >
          <div className="font-semibold text-[14px] text-gray-900 mb-4">Shop Details</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-gray-500">Address</div>
                <p className="text-[12px] font-medium text-gray-900 truncate">{address || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] text-gray-500">Working Hours</div>
                <p className="text-[12px] font-medium text-gray-900">{openTime} — {closeTime}</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
