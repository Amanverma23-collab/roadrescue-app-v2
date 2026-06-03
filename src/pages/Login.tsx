import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Phone, User, Briefcase, Mail, UserRound } from 'lucide-react';

function normalizePhone(input: string) {
  const trimmed = input.trim();
  const digits = trimmed.replace(/[^0-9+]/g, '');
  return digits;
}

function normalizeIndia(phone: string) {
  const digits = String(phone || '').replace(/[^0-9]/g, '');
  const last10 = digits.slice(-10);
  if (last10.length !== 10) return null;
  return `+91${last10}`;
}

export default function Login({
  onLogin,
}: {
  onLogin: (phone: string, role: 'customer' | 'provider') => void;
}) {
  const nav = useNavigate();
  const [phone, setPhone] = useState('+91');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<'phone' | 'otp'>('phone');
  const [role, setRole] = useState<'customer' | 'provider'>('customer');

  // customer fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // provider fields
  const [providerMode, setProviderMode] = useState<'register' | 'signin'>('register');
  const [providerName, setProviderName] = useState('');
  const [providerEmail, setProviderEmail] = useState('');

  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const cleanPhone = useMemo(() => normalizePhone(phone), [phone]);
  const normalizedIndia = useMemo(() => normalizeIndia(cleanPhone), [cleanPhone]);

  const isOtpValid = otp.trim().length >= 4;
  const canContinue = useMemo(() => {
    if (stage === 'phone') {
      if (!normalizedIndia) return false;
      if (role === 'customer') {
        return customerName.trim().length >= 2;
      }
      // provider
      if (providerMode === 'register') return providerName.trim().length >= 2;
      return true;
    }
    return isOtpValid;
  }, [stage, normalizedIndia, role, customerName, providerMode, providerName, isOtpValid]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinue) return;

    setServerMsg(null);

    if (stage === 'phone') {
      setStage('otp');
      return;
    }

    if (!normalizedIndia) {
      setServerMsg('Please enter a valid Indian mobile number.');
      return;
    }
    if (otp.trim() !== '1234') {
      setServerMsg('Invalid OTP. Use 1234 for demo.');
      return;
    }

    // Provider flow: register / sign-in against DB
    if (role === 'provider') {
      setBusy(true);
      try {
        if (providerMode === 'register') {
        localStorage.setItem(
 'provider_demo',
 JSON.stringify({
   name: providerName.trim(),
   email: providerEmail,
   phone: normalizedIndia
 })
);

        } else {
        if (otp.trim() !== '1234') {
  throw new Error('Invalid OTP');
}

// Demo login
localStorage.setItem(
 'provider_demo',
 JSON.stringify({
   phone: normalizedIndia
 })
);
          
        }
localStorage.setItem("userType","provider");

localStorage.setItem('rr_role','provider');
localStorage.setItem('userType','provider');

onLogin(normalizedIndia,'provider');

nav('/provider-profile');
       
      } catch (e: any) {
        setServerMsg(e?.message || 'Something went wrong');
      } finally {
        setBusy(false);
      }
      return;
    }

    // Customer flow (name required, email optional; stored locally for now)
    try {
      localStorage.setItem('rr_customer_name_v1', customerName.trim());
      if (customerEmail.trim()) localStorage.setItem('rr_customer_email_v1', customerEmail.trim());
      else localStorage.removeItem('rr_customer_email_v1');
    } catch {
      // ignore
    }

   localStorage.setItem('rr_role','customer');
localStorage.setItem('userType','customer');

onLogin(normalizedIndia, 'customer');

nav('/location');
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-28 pt-6">
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">RoadRescue</div>
            <div className="text-xs text-white/80">Emergency roadside assistance</div>
          </div>
        </div>
        <div className="mt-4 text-sm leading-6 text-white/90">
          Log in with your phone number for quick access to nearby verified providers.
        </div>
      </div>

      <form onSubmit={submit} className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Login</div>
        <div className="mt-1 text-xs text-slate-500">OTP demo: use <span className="font-semibold text-slate-700">1234</span>.</div>

        <div className="mt-4">
          <div className="text-xs font-semibold text-slate-700">I am a</div>
          <div className="mt-2 grid grid-cols-2 gap-2 rounded-3xl bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={
                'inline-flex items-center justify-center gap-2 rounded-3xl px-3 py-3 text-xs font-semibold transition ' +
                (role === 'customer'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:bg-white/60 active:bg-white')
              }
            >
              <User className="h-4 w-4" /> Customer
            </button>
            <button
              type="button"
              onClick={() => setRole('provider')}
              className={
                'inline-flex items-center justify-center gap-2 rounded-3xl px-3 py-3 text-xs font-semibold transition ' +
                (role === 'provider'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:bg-white/60 active:bg-white')
              }
            >
              <Briefcase className="h-4 w-4" /> Service Provider
            </button>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {role === 'customer'
              ? 'Customers find nearby help and send emergency requests.'
              : 'Providers accept/decline requests and start live tracking.'}
          </div>
        </div>

        {role === 'customer' ? (
          <div className="mt-4 grid gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Name <span className="text-orange-600">*</span></label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 focus-within:border-blue-400">
                <UserRound className="h-5 w-5 text-slate-400" />
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Email (optional)</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 focus-within:border-blue-400">
                <Mail className="h-5 w-5 text-slate-400" />
                <input
                  inputMode="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-700">Provider</div>
            <div className="mt-2 rounded-3xl bg-slate-50 p-1">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setProviderMode('register')}
                  className={
                    'rounded-3xl px-3 py-3 text-xs font-semibold transition ' +
                    (providerMode === 'register'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:bg-white/60 active:bg-white')
                  }
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => setProviderMode('signin')}
                  className={
                    'rounded-3xl px-3 py-3 text-xs font-semibold transition ' +
                    (providerMode === 'signin'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:bg-white/60 active:bg-white')
                  }
                >
                  Already registered? Sign in
                </button>
              </div>
            </div>

            {providerMode === 'register' ? (
              <div className="mt-3 grid gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Name <span className="text-orange-600">*</span></label>
                  <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 focus-within:border-blue-400">
                    <UserRound className="h-5 w-5 text-slate-400" />
                    <input
                      value={providerName}
                      onChange={(e) => setProviderName(e.target.value)}
                      placeholder="Shop / provider name"
                      className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Email (optional)</label>
                  <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 focus-within:border-blue-400">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <input
                      inputMode="email"
                      value={providerEmail}
                      onChange={(e) => setProviderEmail(e.target.value)}
                      placeholder="shop@email.com"
                      className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                Enter your registered mobile number and verify with OTP to login to your shop account.
              </div>
            )}
          </div>
        )}

        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-700">Phone number</label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 focus-within:border-blue-400">
            <Phone className="h-5 w-5 text-slate-400" />
            <input
              inputMode="tel"
              value={phone}
              onChange={(e) => {
                const v = e.target.value;
                // enforce +91 prefix
                if (!v.startsWith('+91')) {
                  const normalized = normalizeIndia(v);
                  setPhone(normalized ? normalized : '+91');
                } else {
                  setPhone(v);
                }
              }}
              placeholder="+91XXXXXXXXXX"
              className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
              aria-label="Phone number"
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-500">India only. Prefix <span className="font-semibold text-slate-700">+91</span> is required.</div>
        </div>

        {stage === 'otp' ? (
          <div className="mt-4">
            <label className="text-xs font-semibold text-slate-700">OTP code</label>
            <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 focus-within:border-blue-400">
              <input
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 1234"
                className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
                aria-label="OTP"
              />
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Tip: Use <span className="font-semibold text-slate-700">1234</span> for demo.
            </div>
          </div>
        ) : null}

        {serverMsg ? (
          <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-800">
            {serverMsg}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canContinue}
          className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition enabled:hover:bg-blue-700 enabled:active:bg-blue-800 disabled:opacity-50"
        >
          {stage === 'phone'
            ? 'Send OTP'
            : role === 'provider'
              ? providerMode === 'register'
                ? busy
                  ? 'Registering…'
                  : 'Verify & Register'
                : busy
                  ? 'Signing in…'
                  : 'Verify & Sign in'
              : 'Verify & Continue'}
        </button>

        <button
          type="button"
          className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 active:bg-slate-100"
          onClick={() => {
            setCustomerName('Rahul Sharma');
            setCustomerEmail('');
            setProviderName('Sharma Auto Care');
            setProviderEmail('');
            setPhone('+91 98123 45678');
            setStage('otp');
            setOtp('1234');
          }}
        >
          Use demo account
        </button>
      </form>

      <div className="mt-4 text-center text-xs text-slate-500">
        By continuing, you agree to prioritize safety and use providers responsibly.
      </div>
    </div>
  );
}
