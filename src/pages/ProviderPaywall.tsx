import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { BadgeIndianRupee, CheckCircle2, CreditCard, Landmark, QrCode, Repeat, ShieldCheck, Tag, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

type Sub = {
  id: number;
  provider_phone: string;
  shop_id: number;
  status: string;
  plan_months: number | null;
  price_inr: number | null;
  final_price_inr: number | null;
  discount_inr: number | null;
  auto_renew: boolean;
  coupon_code: string | null;
  payee_vpa: string | null;
  started_at: string | null;
  ends_at: string | null;
  expires_at: string | null;
};

export default function ProviderPaywall({ providerPhone }: { providerPhone: string }) {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const shopId = Number(sp.get('shop') || '0');

  const [plans, setPlans] = useState<any>({});
  const [subs, setSubs] = useState<Sub[]>([]);
  const [coupon, setCoupon] = useState('');
  const [autoRenew, setAutoRenew] = useState(true);
  const [planKey] = useState<'m1' | 'm6' | 'y1' | null>(
    (sp.get('plan') as 'm1' | 'm6' | 'y1') || null
  );
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch(`/api/subscriptions?provider_phone=${encodeURIComponent(providerPhone)}&shop_id=${shopId}`);
    const data = await res.json();
    setPlans(data.plans);
    setSubs(data.subscriptions || []);
  };

  useEffect(() => {
    load();
  }, [providerPhone, shopId]);

  const active = useMemo(() => subs.find((s) => s.status === 'active') || null, [subs]);
  const pendingPurchase = useMemo(() => subs.find((s) => s.status === 'pending_purchase') || null, [subs]);

  const buy = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_phone: providerPhone,
          shop_id: shopId,
          plan_key: planKey,
          auto_renew: autoRenew,
          coupon_code: coupon,
          payment_method: method,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Payment failed');

      setMsg(`Payment success (demo). Payee VPA: ${data.payee_vpa}`);
      await load();
      nav('/provider-console', { replace: true });
    } catch (e: any) {
      setMsg(e?.message || 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[var(--color-surface)]">
      <TopBar title="Premium Plans" backTo="/provider-console" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
        >
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-3 py-1 text-[11px] font-medium text-white">
              <Crown className="h-4 w-4" /> Upgrade to Premium
            </div>
            <div className="mt-3 text-lg font-bold tracking-tight text-gray-900">Unlock Your Shop's Potential</div>
            <div className="mt-2 text-[13px] leading-relaxed text-gray-600">
              Get customer visibility, media uploads, and service management. Auto-renew enabled by default.
            </div>
          {pendingPurchase?.expires_at ? (
            <div className="mt-3 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2 text-[12px] text-amber-800 font-medium">
              Purchase within 48 hours. Expires: {new Date(pendingPurchase.expires_at).toLocaleString()}
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Features</div>
              <div className="mt-1 text-[12px] font-semibold text-gray-900">Dashboard</div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Payment</div>
              <div className="mt-1 text-[12px] font-semibold text-gray-900">UPI</div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Renewal</div>
              <div className="mt-1 text-[12px] font-semibold text-gray-900">Auto</div>
            </div>
          </div>
          </div>
        </motion.div>

        <div className="mt-4 grid gap-4">
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => nav('/subscription-payment?plan=m1')}
            className="rounded-2xl bg-white p-5 border border-gray-200 shadow-sm text-left hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">1 Month</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-semibold">
                    Starter
                  </span>
                </div>
                <p className="text-gray-500 mt-1 text-[13px]">₹60/month</p>
                <div className="mt-3 space-y-1.5 text-[12px] text-gray-600">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Shop visible to customers</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Media uploads</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Service editing</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Basic support</div>
                </div>
              </div>
              <div className="bg-gray-900 text-white px-4 py-2.5 rounded-xl font-bold group-hover:bg-gray-800 transition-colors">
                ₹60
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onClick={() => nav('/subscription-payment?plan=m6')}
            className="rounded-2xl bg-white p-5 border-2 border-amber-300 shadow-sm text-left relative cursor-pointer group hover:shadow-md transition-all duration-200"
          >
            <div className="absolute top-3 right-3 bg-amber-500 text-white text-[9px] px-2.5 py-0.5 rounded-full font-semibold">
              MOST POPULAR
            </div>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">6 Months</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold">
                    Popular
                  </span>
                </div>
                <p className="text-gray-500 mt-1 text-[13px]">
                  ₹300 total
                  <span className="ml-2 text-emerald-600 font-semibold">Save ₹60</span>
                </p>
                <div className="mt-3 space-y-1.5 text-[12px] text-gray-600">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Priority visibility</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Media uploads</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Service editing</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Premium support</div>
                </div>
              </div>
              <div className="bg-gray-900 text-white px-4 py-2.5 rounded-xl font-bold group-hover:bg-gray-800 transition-colors">
                ₹300
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => nav('/subscription-payment?plan=y1')}
            className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 shadow-sm text-left cursor-pointer group hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">1 Year</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold">
                    Best Value
                  </span>
                </div>
                <p className="text-gray-500 mt-1 text-[13px]">
                  ₹600 total
                  <span className="ml-2 text-emerald-600 font-semibold">Save ₹120</span>
                </p>
                <div className="mt-3 space-y-1.5 text-[12px] text-gray-600">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Top ranking</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Unlimited uploads</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Priority support</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Growth boost</div>
                </div>
              </div>
              <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-sm group-hover:shadow-md transition-all">
                ₹600
              </div>
            </div>
          </motion.button>
        </div>

        {active ? (
          <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-[13px] text-emerald-900">
            <div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Active subscription</div>
            <div className="mt-1 text-[12px] text-emerald-700">Ends at: {active.ends_at ? new Date(active.ends_at).toLocaleDateString() : ''}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
