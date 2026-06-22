import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import { ChevronDown, ChevronRight, MessageCircle, Phone, Mail, FileText, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
  {
    q: 'How do I request emergency roadside assistance?',
    a: 'Open the app, select the service you need (towing, battery, fuel, etc.), and tap "Dispatch Now" to send an SOS request to nearby verified providers.'
  },
  {
    q: 'How does the SOS emergency system work?',
    a: 'When you tap SOS, your GPS coordinates are broadcast to all active responders in your area. The nearest available provider receives your request and can accept it to start live tracking.'
  },
  {
    q: 'Is my location data safe?',
    a: 'Yes. Your coordinates remain on-device and are shared only when you initiate an SOS request. We do not track or store your location otherwise.'
  },
  {
    q: 'How do I become a verified service provider?',
    a: 'Tap "Service Provider" on the login screen, complete your shop registration with documents (Aadhaar/PAN), and wait for verification. Once approved, activate a subscription to go live.'
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept UPI, Credit/Debit Cards, and Net Banking. All payments are processed securely.'
  },
  {
    q: 'How do I track my rescue request in real-time?',
    a: 'After your request is accepted by a provider, the app shows a live map with the responder\'s location, distance remaining, and estimated time of arrival.'
  }
];

function FAQItem({ item, index }: { item: typeof faqData[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left cursor-pointer"
      >
        <span className="text-[13px] font-medium text-gray-900 pr-4">{item.q}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-[12px] leading-relaxed text-gray-500">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HelpSupport() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-24">
      <TopBar title="Help & Support" backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-[var(--color-primary)] p-5 text-white relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5 blur-xl" />
          <div className="relative z-10">
            <h2 className="text-lg font-bold">Need Help?</h2>
            <p className="mt-1 text-[13px] text-white/70">We're here to assist you 24/7</p>
            <div className="mt-4 flex gap-2">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-[12px] font-medium text-white hover:bg-white/20 transition-colors"
              >
                <Phone className="h-4 w-4" /> Call Us
              </a>
              <a
                href="mailto:support@roadrescue.in"
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-[12px] font-medium text-white hover:bg-white/20 transition-colors"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-4 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-[14px] font-semibold text-gray-900">Contact Options</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium text-gray-900">Emergency Helpline</div>
                <div className="text-[12px] text-gray-500">+91 98765 43210</div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </a>

            <a
              href="mailto:support@roadrescue.in"
              className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium text-gray-900">Email Support</div>
                <div className="text-[12px] text-gray-500">support@roadrescue.in</div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </a>

            <button className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors w-full cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[13px] font-medium text-gray-900">Live Chat</div>
                <div className="text-[12px] text-gray-500">Chat with support agent</div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="mt-4 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-[14px] font-semibold text-gray-900">Frequently Asked Questions</h3>
          </div>
          <div className="px-5">
            {faqData.map((item, i) => (
              <FAQItem key={i} item={item} index={i} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mt-4 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-[14px] font-semibold text-gray-900">Legal</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <button className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors w-full cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[13px] font-medium text-gray-900">Terms of Service</div>
                <div className="text-[12px] text-gray-500">Usage terms and conditions</div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </button>

            <button className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors w-full cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[13px] font-medium text-gray-900">Privacy Policy</div>
                <div className="text-[12px] text-gray-500">Data handling practices</div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </motion.div>

        <p className="mt-6 text-center text-[11px] text-gray-400">
          RoadRescue v2.0 — Made with care for drivers across India
        </p>
      </div>
    </div>
  );
}
