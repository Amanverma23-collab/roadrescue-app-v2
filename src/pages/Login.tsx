import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Phone } from 'lucide-react';
import { auth } from '../firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';

declare global {
  interface Window {
    confirmationResult: any;
    recaptchaVerifier: any;
  }
}

function normalizePhone(input: string) {
  const trimmed = input.trim();
  const digits = trimmed.replace(/[^0-9+]/g, '');
  return digits;
}

export default function Login({ onLogin }: { onLogin: (phone: string) => void }) {
  const nav = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<'phone' | 'otp'>('phone');

  const cleanPhone = useMemo(() => normalizePhone(phone), [phone]);

  const canContinue = stage === 'phone' ? cleanPhone.length >= 9 : otp.trim().length >= 4;
const sendOTP = async () => {
  setStage("otp");
  alert("Demo OTP: 1234");
};
const verifyOTP = async () => {

  if (otp !== "1234") {
    alert("Wrong OTP");
    return;
  }

  onLogin(cleanPhone);

  nav("/location");
};

  const submit = async (
e: React.FormEvent
) => {

e.preventDefault();

if(!canContinue) return;

if(stage==="phone"){
 await sendOTP();
}else{
 await verifyOTP();
}

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
        <div className="text-sm font-semibold text-slate-900">Phone login</div>
        <div className="mt-1 text-xs text-slate-500">Secure login with Firebase OTP</div>

        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-700">Phone number</label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 focus-within:border-blue-400">
            <Phone className="h-5 w-5 text-slate-400" />
            <input
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +971501234567"
              className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
              aria-label="Phone number"
            />
          </div>
        </div>

        {stage === 'otp' ? (
          <div className="mt-4">
            <label className="text-xs font-semibold text-slate-700">OTP code</label>
            <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 focus-within:border-blue-400">
              <input
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
                aria-label="OTP"
              />
            </div>
         <div className="mt-2 text-[11px] text-slate-500">
 Demo OTP:
 <span className="font-semibold text-slate-700">
 1234
 </span>
</div>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canContinue}
          className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition enabled:hover:bg-blue-700 enabled:active:bg-blue-800 disabled:opacity-50"
        >
          {stage === 'phone' ? 'Send OTP' : 'Verify & Continue'}
        </button>

       
      </form>

      <div className="mt-4 text-center text-xs text-slate-500">
        By continuing, you agree to prioritize safety and use providers responsibly.
      </div>
    </div>
  );
}
