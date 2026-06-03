import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { BadgeIndianRupee, CheckCircle2, CreditCard, Landmark, QrCode, Repeat, ShieldCheck, Tag } from 'lucide-react';

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

  const planCards = [
    { key: 'm1' as const, title: '1 month', price: 60, sub: '60 / month', badge: 'Starter' },
    { key: 'm6' as const, title: '6 months', price: 300, sub: '300 total', badge: 'Popular' },
    { key: 'y1' as const, title: '1 year', price: 600, sub: '600 total', badge: 'Best value' },
  ];

  return (
    <div className="min-h-screen pb-28" style={{
      background:
        'radial-gradient(900px 600px at 15% 10%, rgba(59,130,246,0.22), transparent 60%), radial-gradient(700px 520px at 85% 25%, rgba(249,115,22,0.18), transparent 60%), radial-gradient(900px 700px at 50% 95%, rgba(168,85,247,0.14), transparent 60%), linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(241,245,249,1) 55%, rgba(248,250,252,1) 100%)',
    }}>
      <TopBar title="Premium plans" backTo="/provider-console" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.14)] backdrop-blur-xl">
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                'radial-gradient(520px 260px at 30% 0%, rgba(59,130,246,0.20), transparent 60%), radial-gradient(520px 260px at 100% 65%, rgba(249,115,22,0.14), transparent 60%)',
            }}
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-[11px] font-semibold text-blue-700">
              <ShieldCheck className="h-4 w-4" /> Verified  activate your shop
            </div>
            <div className="mt-3 text-xl font-extrabold tracking-tight text-slate-900">Upgrade to Premium</div>
            <div className="mt-2 text-sm leading-6 text-slate-600">
              Unlock customer visibility, media uploads, and service management. Auto-renew is enabled by default.
            </div>
          {pendingPurchase?.expires_at ? (
            <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-900">
              You must purchase within 48 hours. Expires at {new Date(pendingPurchase.expires_at).toLocaleString()}.
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-white/70 p-3">
              <div className="text-[11px] text-slate-500">Features</div>
              <div className="mt-1 text-xs font-semibold text-slate-900">Dashboard</div>
            </div>
            <div className="rounded-2xl bg-white/70 p-3">
              <div className="text-[11px] text-slate-500">Payment</div>
              <div className="mt-1 text-xs font-semibold text-slate-900">UPI</div>
            </div>
            <div className="rounded-2xl bg-white/70 p-3">
              <div className="text-[11px] text-slate-500">Renewal</div>
              <div className="mt-1 text-xs font-semibold text-slate-900">Auto</div>
            </div>
          </div>
          </div>

          <div className="mt-5 grid gap-4">

<button
onClick={() => nav('/subscription-payment?plan=m1')}
className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,.08)] text-left border hover:scale-[1.02] transition"
>
<div className="flex justify-between items-start">
<div>
<div className="flex items-center gap-2">
<h3 className="text-2xl font-bold">1 Month</h3>
<span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
Starter
</span>
</div>

<p className="text-slate-500 mt-2">₹60/month</p>

<div className="mt-4 space-y-2 text-sm text-slate-600">
<div>✅ Shop visible to customers</div>
<div>✅ Media uploads</div>
<div>✅ Service editing</div>
<div>✅ Basic support</div>
</div>
</div>

<div className="bg-slate-900 text-white px-4 py-3 rounded-2xl font-bold">
₹60
</div>
</div>
</button>


<button
onClick={() => nav('/subscription-payment?plan=m6')}
className="rounded-3xl bg-white p-5 border-2 border-orange-300 shadow-[0_10px_30px_rgba(0,0,0,.08)] text-left relative"
>
<div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full">
MOST POPULAR
</div>

<div className="flex justify-between items-start">
<div>
<div className="flex items-center gap-2">
<h3 className="text-2xl font-bold">6 Months</h3>

<span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
Popular
</span>
</div>

<p className="text-slate-500 mt-2">
₹300 total
<span className="ml-2 text-green-600 font-bold">
Save ₹60
</span>
</p>

<div className="mt-4 space-y-2 text-sm text-slate-600">
<div>✅ Priority visibility</div>
<div>✅ Media uploads</div>
<div>✅ Service editing</div>
<div>✅ Premium support</div>
</div>
</div>

<div className="bg-slate-900 text-white px-4 py-3 rounded-2xl font-bold">
₹300
</div>
</div>
</button>


<button
onClick={() => nav('/subscription-payment?plan=y1')}
className="rounded-3xl bg-gradient-to-r from-emerald-50 to-green-50 border border-green-200 p-5 shadow-[0_10px_30px_rgba(0,0,0,.08)] text-left"
>
<div className="flex justify-between items-start">

<div>
<div className="flex items-center gap-2">
<h3 className="text-2xl font-bold">1 Year</h3>

<span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
Best Value
</span>
</div>

<p className="text-slate-500 mt-2">
₹600 total
<span className="ml-2 text-green-600 font-bold">
Save ₹120
</span>
</p>

<div className="mt-4 space-y-2 text-sm text-slate-600">
<div>✅ Top ranking</div>
<div>✅ Unlimited uploads</div>
<div>✅ Priority support</div>
<div>✅ Growth boost</div>
</div>
</div>

<div className="bg-green-600 text-white px-4 py-3 rounded-2xl font-bold">
₹600
</div>

</div>
</button>

</div>
        </div>

        {active ? (
          <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-sm">
            <div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5" /> Active subscription</div>
            <div className="mt-1 text-xs text-emerald-800">Ends at: {active.ends_at ? new Date(active.ends_at).toLocaleDateString() : ''}</div>
          </div>
        ) : null}

      


      </div>
    </div>
  );
}
