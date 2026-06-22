import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { User, Mail, Phone, Camera, ArrowRight, Check, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EditProfile() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('rr_customer_name_v1') || '';
    const savedEmail = localStorage.getItem('rr_customer_email_v1') || '';
    const savedPhone = localStorage.getItem('rr_phone_v1') || '';
    setName(savedName);
    setEmail(savedEmail);
    setPhone(savedPhone);
  }, []);

  const handleSave = () => {
    localStorage.setItem('rr_customer_name_v1', name);
    if (email) localStorage.setItem('rr_customer_email_v1', email);
    else localStorage.removeItem('rr_customer_email_v1');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-24">
      <TopBar title="Edit Profile" backTo="/home" />

      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
        >
          <h2 className="text-[15px] font-semibold text-gray-900">Personal Information</h2>
          <p className="mt-1 text-[12px] text-gray-500">Update your account details and preferences.</p>

          <div className="mt-5 flex justify-center">
            <label className="relative cursor-pointer group">
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 group-hover:border-gray-300 transition-colors">
                {photoName ? (
                  <Check className="h-8 w-8 text-emerald-500" />
                ) : (
                  <Camera className="h-7 w-7 text-gray-400" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white shadow-sm">
                <Camera className="h-3.5 w-3.5" />
              </div>
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setPhotoName(file.name);
                }}
              />
            </label>
          </div>
          <p className="mt-2 text-center text-[11px] text-gray-400">Tap to change photo</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-4 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Full Name</label>
              <div className="mt-1.5 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all">
                <User size={18} className="text-gray-400" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent text-[13px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Email Address</label>
              <div className="mt-1.5 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all">
                <Mail size={18} className="text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full bg-transparent text-[13px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Phone Number</label>
              <div className="mt-1.5 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3 py-3">
                <Phone size={18} className="text-gray-400" />
                <input
                  value={phone}
                  disabled
                  className="w-full bg-transparent text-[13px] font-medium text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-[10px] text-gray-400">Phone number cannot be changed</p>
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Saved Location</label>
              <div className="mt-1.5 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3 py-3">
                <MapPin size={18} className="text-gray-400" />
                <span className="text-[13px] font-medium text-gray-500">GPS-based location</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mt-4 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
        >
          <h3 className="text-[14px] font-semibold text-gray-900">Account Stats</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 p-3.5">
              <div className="text-[11px] text-gray-500">Member Since</div>
              <div className="text-[13px] font-semibold text-gray-900 mt-1">Jan 2026</div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3.5">
              <div className="text-[11px] text-gray-500">Total SOS</div>
              <div className="text-[13px] font-semibold text-gray-900 mt-1">0 requests</div>
            </div>
          </div>
        </motion.div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 btn-primary"
          >
            {saved ? (
              <><Check className="h-4 w-4" /> Saved!</>
            ) : (
              <><span>Save Changes</span> <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
