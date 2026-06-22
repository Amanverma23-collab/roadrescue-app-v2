import { useEffect, useState } from "react";
import { ShieldCheck, Store, Wallet, Rocket, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProviderApproved() {
  const nav = useNavigate();
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-[var(--color-surface)] px-3 py-2">
      <div className="mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm"
        >
          <div className="relative pt-6">
            <div className="flex justify-center">
              <div className="relative h-32 w-32">
                <div className="absolute inset-0 rounded-full bg-emerald-100 blur-xl"/>
                <div className="absolute inset-6 rounded-full border-4 border-emerald-100 opacity-60"/>
                <div className="absolute inset-10 rounded-full border-4 border-emerald-200 opacity-50"/>
                <div className="absolute bottom-6 left-1/2 h-7 w-32 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500 shadow-lg"/>
                <div className="absolute bottom-10 left-1/2 h-7 w-24 -translate-x-1/2 rounded-full bg-white shadow"/>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-7 shadow-lg">
                    <ShieldCheck size={45} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-center">
              <div className="rounded-full bg-emerald-50 px-4 py-1.5 text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> VERIFICATION COMPLETE
              </div>
            </div>

            <h1 className="mt-4 text-center text-2xl font-bold leading-tight text-gray-900 tracking-tight">
              Verification Approved
            </h1>
            <p className="mt-2 text-center text-[13px] text-gray-500 leading-relaxed">
              Your shop verification is complete. Activate your subscription to make your shop live.
            </p>
          </div>

          <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-100 p-5">
            <div className="text-center text-emerald-700 font-semibold text-[13px] flex items-center justify-center gap-1.5">
              <Zap className="h-4 w-4" /> Payment Deadline
            </div>
            <div className="mt-3 flex justify-center gap-2">
              <div className="rounded-xl bg-white p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-emerald-600">{String(hours).padStart(2, '0')}</div>
                <div className="text-[10px] font-medium text-gray-500 mt-1">HOURS</div>
              </div>
              <div className="text-2xl mt-4 text-emerald-400 font-bold">:</div>
              <div className="rounded-xl bg-white p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-emerald-600">{String(minutes).padStart(2, '0')}</div>
                <div className="text-[10px] font-medium text-gray-500 mt-1">MIN</div>
              </div>
              <div className="text-2xl mt-4 text-emerald-400 font-bold">:</div>
              <div className="rounded-xl bg-white p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-emerald-600">{String(seconds).padStart(2, '0')}</div>
                <div className="text-[10px] font-medium text-gray-500 mt-1">SEC</div>
              </div>
            </div>
            <div className="mt-4 text-center text-[12px] text-gray-500">
              After 48 hours verification expires
            </div>
          </div>

          <div className="mt-8">
            <div className="mt-4 rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
              <div className="mb-5 flex items-center justify-center gap-2">
                <div className="h-[1px] w-14 bg-gray-200"/>
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">What Happens Next?</div>
                <div className="h-[1px] w-14 bg-gray-200"/>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="relative">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                    <Store className="text-emerald-600" size={20}/>
                  </div>
                  <div className="absolute top-[24px] left-[52px] w-[56px] border-t-[2px] border-dashed border-gray-200"/>
                  <div className="mt-3 text-[11px] font-semibold">1. Verified</div>
                  <div className="mt-1 text-[9px] text-gray-500">Your shop approved</div>
                </div>

                <div className="relative">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
                    <Wallet className="text-purple-600" size={20}/>
                  </div>
                  <div className="absolute top-[24px] left-[48px] w-[64px] border-t-[2px] border-dashed border-gray-200"/>
                  <div className="mt-3 text-[11px] font-semibold">2. Payment</div>
                  <div className="mt-1 text-[9px] text-gray-500">Complete payment</div>
                </div>

                <div className="relative">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                    <Rocket className="text-amber-500" size={20}/>
                  </div>
                  <div className="absolute top-[24px] left-[48px] w-[64px] border-t-[2px] border-dashed border-gray-200"/>
                  <div className="mt-3 text-[11px] font-semibold">3. Go Live</div>
                  <div className="mt-1 text-[9px] text-gray-500">Visible to users</div>
                </div>

                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                    <TrendingUp className="text-blue-600" size={20}/>
                  </div>
                  <div className="mt-3 text-[11px] font-semibold">4. Growth</div>
                  <div className="mt-1 text-[9px] text-gray-500">Get more customers</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => nav('/subscription')}
            className="mt-5 btn-primary w-full py-4"
          >
            <Zap className="h-4 w-4" /> Continue to Subscription
          </button>

          <div className="mt-4 text-center text-[12px] text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Secure & encrypted payment
          </div>
        </motion.div>
      </div>
    </div>
  );
}
