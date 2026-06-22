import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, Clock, FileText, Lock, ArrowRight, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import TopBar from '../components/TopBar';

export default function VerificationPending() {
  const nav = useNavigate();

  const steps = [
    { label: 'Profile Completed', icon: CheckCircle, status: 'done' as const },
    { label: 'Shop Registered', icon: CheckCircle, status: 'done' as const },
    { label: 'Documents Under Review', icon: Clock, status: 'active' as const },
    { label: 'Waiting for Approval', icon: Clock, status: 'pending' as const },
    { label: 'Subscription', icon: Lock, status: 'pending' as const },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-24">
      <TopBar title="Verification" backTo="/" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[var(--color-primary)] p-5 text-white relative overflow-hidden"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5 blur-xl" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Verification in Progress</h1>
              <p className="mt-1 text-[12px] text-white/60">Usually takes 2–24 hours</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Progress</span>
              <span className="text-[11px] font-semibold text-[var(--color-primary)]">Step 3 / 5</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-[var(--color-primary)]"
              />
            </div>
          </div>

          <div className="p-5">
            <div className="space-y-1">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    className="flex items-center gap-3 rounded-xl px-3 py-3"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      step.status === 'done'
                        ? 'bg-emerald-50 text-emerald-600'
                        : step.status === 'active'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-gray-50 text-gray-300'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className={`text-[13px] font-medium ${
                      step.status === 'done'
                        ? 'text-gray-900'
                        : step.status === 'active'
                        ? 'text-amber-700 font-semibold'
                        : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                    {step.status === 'done' && (
                      <CheckCircle className="ml-auto h-4 w-4 text-emerald-500" />
                    )}
                    {step.status === 'active' && (
                      <div className="ml-auto flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-4 rounded-2xl bg-white border border-gray-100 shadow-sm p-5"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-gray-900">What happens next?</h3>
              <p className="mt-1 text-[12px] text-gray-500 leading-relaxed">
                Our team reviews your ID proof and shop documents. You'll get a notification once approved. After approval, you have 48 hours to activate your subscription.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-5 flex flex-col gap-3">
          <button
            onClick={() => alert('You will be notified when approved.')}
            className="btn-primary w-full"
          >
            <Mail className="h-4 w-4" />
            <span>Notify Me When Approved</span>
          </button>
          <button
            onClick={() => nav('/provider-approved')}
            className="btn-secondary w-full"
          >
            <span>Demo Admin Approve</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
