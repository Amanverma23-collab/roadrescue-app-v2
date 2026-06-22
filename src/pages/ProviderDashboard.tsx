import {
  ShieldCheck,
  Eye,
  Phone,
  Wrench,
  TrendingUp,
  Zap
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TopBar from "../components/TopBar";

export default function ProviderDashboard() {
  const nav = useNavigate();
  const [services, setServices] = useState({
    tyre: true,
    fuel: true,
    battery: false
  });

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

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="text-[12px] opacity-70 font-medium flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-yellow-300" /> Welcome back
              </div>
              <h1 className="text-xl font-bold mt-1 tracking-tight">
                Rajesh Tyre Repair
              </h1>
              <div className="flex items-center gap-2 mt-3">
                <div className="bg-white/20 px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1">
                  <ShieldCheck className="inline h-3 w-3" /> Verified
                </div>
                <div className="bg-emerald-500/90 px-3 py-1 rounded-full text-[11px] font-medium">
                  Premium Active
                </div>
              </div>
            </div>
            <img
              src="https://i.pravatar.cc/100"
              className="w-14 h-14 rounded-full border-2 border-white/30"
              alt="Profile"
            />
          </div>

          <div className="mt-5 bg-white/15 rounded-xl p-3.5">
            <div className="text-[12px] opacity-70">Subscription expires</div>
            <div className="font-bold mt-1">27 days remaining</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm mt-5"
        >
          <div className="font-semibold text-[15px] text-gray-900">Availability Status</div>
          <div className="space-y-3 mt-4">
            <div className="rounded-xl bg-gray-50 p-4 flex justify-between items-center">
              <div>
                <div className="font-medium text-[13px] flex items-center gap-1.5">
                  <span className="text-amber-500">●</span> Busy Mode
                </div>
                <div className="text-[12px] text-gray-500 mt-0.5">
                  Customers see busy
                </div>
              </div>
              <button className="w-12 h-7 rounded-full bg-amber-500 relative cursor-pointer transition-all">
                <div className="absolute right-0.5 top-0.5 h-6 w-6 bg-white rounded-full shadow-sm" />
              </button>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 flex justify-between items-center">
              <div>
                <div className="font-medium text-[13px] flex items-center gap-1.5">
                  <span className="text-red-500">●</span> Closed Mode
                </div>
                <div className="text-[12px] text-gray-500 mt-0.5">
                  Temporarily hidden
                </div>
              </div>
              <button className="w-12 h-7 rounded-full bg-gray-300 relative cursor-pointer transition-all">
                <div className="absolute left-0.5 top-0.5 h-6 w-6 bg-white rounded-full shadow-sm" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-3">
              <Eye className="h-4 w-4" />
            </div>
            <div className="text-xl font-bold text-gray-900">1,284</div>
            <div className="text-[12px] text-gray-500 mt-0.5">Profile Views</div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
              <TrendingUp className="h-3 w-3" /> +12% this week
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-3">
              <Phone className="h-4 w-4" />
            </div>
            <div className="text-xl font-bold text-gray-900">326</div>
            <div className="text-[12px] text-gray-500 mt-0.5">Call Clicks</div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
              <TrendingUp className="h-3 w-3" /> +8% this week
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm mt-5"
        >
          <div className="font-semibold text-[15px] text-gray-900">Manage Services</div>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center rounded-xl bg-gray-50 p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Wrench className="h-4 w-4" />
                </div>
                <span className="font-medium text-[13px] text-gray-800">Tyre Repair</span>
              </div>
              <button
                onClick={() => setServices({ ...services, tyre: !services.tyre })}
                className={`px-4 py-1.5 rounded-full text-white text-[11px] font-semibold transition-all cursor-pointer ${services.tyre ? "bg-emerald-500" : "bg-gray-400"}`}
              >
                {services.tyre ? "ON" : "OFF"}
              </button>
            </div>

            <div className="flex justify-between items-center rounded-xl bg-gray-50 p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Wrench className="h-4 w-4" />
                </div>
                <span className="font-medium text-[13px] text-gray-800">Fuel Delivery</span>
              </div>
              <button
                onClick={() => setServices({ ...services, fuel: !services.fuel })}
                className={`px-4 py-1.5 rounded-full text-white text-[11px] font-semibold transition-all cursor-pointer ${services.fuel ? "bg-emerald-500" : "bg-gray-400"}`}
              >
                {services.fuel ? "ON" : "OFF"}
              </button>
            </div>

            <div className="flex justify-between items-center rounded-xl bg-gray-50 p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <Wrench className="h-4 w-4" />
                </div>
                <span className="font-medium text-[13px] text-gray-800">Battery Jumpstart</span>
              </div>
              <button
                onClick={() => setServices({ ...services, battery: !services.battery })}
                className={`px-4 py-1.5 rounded-full text-white text-[11px] font-semibold transition-all cursor-pointer ${services.battery ? "bg-emerald-500" : "bg-gray-400"}`}
              >
                {services.battery ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
