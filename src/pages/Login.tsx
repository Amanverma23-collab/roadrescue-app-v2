import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Phone, User, Briefcase, Mail, UserRound, ArrowRight, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

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
          localStorage.setItem(
            'provider_demo',
            JSON.stringify({
              phone: normalizedIndia
            })
          );
        }
        localStorage.setItem("userType", "provider");
        localStorage.setItem('rr_role', 'provider');

        onLogin(normalizedIndia, 'provider');
        nav('/provider-profile');
      } catch (e: any) {
        setServerMsg(e?.message || 'Something went wrong');
      } finally {
        setBusy(false);
      }
      return;
    }

    try {
      localStorage.setItem('rr_customer_name_v1', customerName.trim());
      if (customerEmail.trim()) {
        localStorage.setItem('rr_customer_email_v1', customerEmail.trim());
      } else {
        localStorage.removeItem('rr_customer_email_v1');
      }
      localStorage.setItem('rr_role', 'customer');
      localStorage.setItem('userType', 'customer');

      onLogin(normalizedIndia, 'customer');
      nav('/location');
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--color-surface)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 pointer-events-none">
        <div className="absolute top-0 right-10 w-64 h-64 rounded-full bg-blue-400/8 blur-[60px]" />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-[var(--color-accent)]/5 blur-[60px]" />
      </div>

      <div className="relative mx-auto w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-[var(--color-primary)] p-6 text-white relative overflow-hidden"
        >
          <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-white/5 blur-xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">RoadRescue</h2>
                <p className="text-[12px] text-white/70">Premium Roadside Assistance</p>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-white/80">
              Join thousands of drivers and verified mechanics. Get instant help when you need it most.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90">
                24/7 Active
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90">
                Verified Network
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 rounded-2xl bg-white p-6 border border-gray-100 shadow-sm"
        >
          <form onSubmit={submit}>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-[15px] font-semibold text-gray-900">Account Access</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-600">
                Demo: 1234
              </span>
            </div>

            <div className="mt-5">
              <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">I want to use the app as</label>
              <div className="mt-2 grid grid-cols-2 gap-1.5 rounded-xl bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => { setRole('customer'); setStage('phone'); }}
                  className={`relative flex items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                    role === 'customer'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <User className="h-4 w-4" /> Customer
                </button>
                <button
                  type="button"
                  onClick={() => { setRole('provider'); setStage('phone'); }}
                  className={`relative flex items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                    role === 'provider'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Briefcase className="h-4 w-4" /> Service Provider
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {stage === 'phone' ? (
                <motion.div
                  key="phone-fields"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-5 space-y-4"
                >
                  {role === 'customer' ? (
                    <>
                      <div>
                        <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Full Name <span className="text-[var(--color-accent)]">*</span></label>
                        <div className="mt-1.5 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all">
                          <UserRound className="h-4 w-4 text-gray-400" />
                          <input
                            value={customerName}
                            required
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full bg-transparent text-[13px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Email Address (Optional)</label>
                        <div className="mt-1.5 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="name@email.com"
                            className="w-full bg-transparent text-[13px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-gray-100 p-1">
                        <button
                          type="button"
                          onClick={() => setProviderMode('register')}
                          className={`rounded-lg py-2 text-[12px] font-medium cursor-pointer transition-all duration-200 ${
                            providerMode === 'register'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          New Shop Registration
                        </button>
                        <button
                          type="button"
                          onClick={() => setProviderMode('signin')}
                          className={`rounded-lg py-2 text-[12px] font-medium cursor-pointer transition-all duration-200 ${
                            providerMode === 'signin'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Already Registered
                        </button>
                      </div>

                      {providerMode === 'register' ? (
                        <>
                          <div>
                            <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Shop / Company Name <span className="text-[var(--color-accent)]">*</span></label>
                            <div className="mt-1.5 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all">
                              <UserRound className="h-4 w-4 text-gray-400" />
                              <input
                                value={providerName}
                                required
                                onChange={(e) => setProviderName(e.target.value)}
                                placeholder="e.g. Sharma Auto Care"
                                className="w-full bg-transparent text-[13px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Business Email (Optional)</label>
                            <div className="mt-1.5 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <input
                                type="email"
                                value={providerEmail}
                                onChange={(e) => setProviderEmail(e.target.value)}
                                placeholder="shop@email.com"
                                className="w-full bg-transparent text-[13px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-[13px] text-gray-600 leading-relaxed">
                          Enter your verified mobile number to log in and open your business dashboard.
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Phone number</label>
                    <div className="mt-1.5 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (!v.startsWith('+91')) {
                            const normalized = normalizeIndia(v);
                            setPhone(normalized ? normalized : '+91');
                          } else {
                            setPhone(v);
                          }
                        }}
                        placeholder="+91XXXXXXXXXX"
                        className="w-full bg-transparent text-[13px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] text-gray-400">India only. Prefix +91 is required.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-fields"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-5 space-y-4"
                >
                  <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-[13px] font-medium text-amber-800">
                    Verification SMS sent to {normalizedIndia}. Enter demo code 1234 to proceed.
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">One-Time Password (OTP)</label>
                    <div className="mt-1.5 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all">
                      <Smartphone className="h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 1234"
                        className="w-full bg-transparent text-[15px] font-bold text-gray-900 tracking-[0.3em] outline-none placeholder:text-gray-400 placeholder:font-medium placeholder:tracking-normal"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setStage('phone'); setOtp(''); }}
                    className="text-[13px] font-medium text-[var(--color-primary)] hover:underline transition cursor-pointer"
                  >
                    Edit phone number
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {serverMsg && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-[13px] font-medium text-red-700">
                {serverMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={!canContinue}
              className="mt-6 btn-primary w-full"
            >
              {stage === 'phone' ? (
                <>
                  <span>Send OTP Code</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <span>{busy ? 'Verifying...' : 'Verify & Log In'}</span>
              )}
            </button>

            <button
              type="button"
              className="mt-3 btn-secondary w-full"
              onClick={() => {
                setCustomerName('Rahul Sharma');
                setCustomerEmail('');
                setProviderName('Sharma Auto Care');
                setProviderEmail('');
                setPhone('+919812345678');
                setStage('otp');
                setOtp('1234');
              }}
            >
              Use Mock Demo Account
            </button>
          </form>
        </motion.div>

        <p className="mt-6 text-center text-[11px] text-gray-400 leading-relaxed">
          By accessing RoadRescue, you consent to standard GPS terms and partner verification controls.
        </p>
      </div>
    </div>
  );
}
