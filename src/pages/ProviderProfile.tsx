import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, MapPin, Camera, ShieldCheck, ArrowRight, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

export default function ProviderProfile() {
  const [docType, setDocType] = useState("aadhaar");
  const [profileName, setProfileName] = useState('');
  const [frontName, setFrontName] = useState('');
  const [backName, setBackName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-surface)] px-4 py-6 pb-32">
      <div className="mx-auto w-full max-w-md">
        
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <div className="flex justify-between items-center text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            <span>Step 1 of 2</span>
            <span className="text-[var(--color-primary)]">Profile Complete</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-1/2 rounded-full bg-[var(--color-primary)] transition-all duration-500"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm"
        >
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Complete Business Profile</h2>
            <p className="mt-1 text-[12px] text-gray-500 leading-relaxed">
              Verify your business profile to open your partner shop account.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Owner Name *</label>
              <div className="mt-1.5 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all">
                <User size={18} className="text-gray-400" />
                <input
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Enter owner full name"
                  className="w-full bg-transparent text-[13px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Business Email (Optional)</label>
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
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Home Address *</label>
              <div className="mt-1.5 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all">
                <MapPin size={18} className="text-gray-400" />
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full address details"
                  className="w-full bg-transparent text-[13px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Owner Profile Photo *</label>
              <label className="mt-2 flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all">
                {profileName ? (
                  <div className="text-center p-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-1">✓</span>
                    <p className="text-[12px] font-medium text-gray-900 truncate max-w-xs">{profileName}</p>
                    <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Photo added successfully</p>
                  </div>
                ) : (
                  <div className="text-center p-3 flex flex-col items-center">
                    <Camera size={24} className="text-gray-400 mb-1" />
                    <span className="text-[12px] font-medium text-gray-700">Upload profile photo</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">JPEG, PNG up to 5MB</span>
                  </div>
                )}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setProfileName(file.name);
                  }}
                />
              </label>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Identity Verification *</label>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDocType("aadhaar")}
                  className={`flex-1 rounded-xl py-2.5 text-[12px] font-semibold border-2 cursor-pointer transition-all ${
                    docType === "aadhaar"
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  Aadhaar Card
                </button>
                <button
                  type="button"
                  onClick={() => setDocType("pan")}
                  className={`flex-1 rounded-xl py-2.5 text-[12px] font-semibold border-2 cursor-pointer transition-all ${
                    docType === "pan"
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  PAN Card
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">
                {docType === "aadhaar" ? "Aadhaar Card Number *" : "PAN Card Number *"}
              </label>
              <input
                required
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="mt-1.5 w-full rounded-xl input-field"
                placeholder={docType === "aadhaar" ? "Enter 12-digit Aadhaar number" : "Enter 10-character alphanumeric PAN"}
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Front Side Card Photo *</label>
              <label className="mt-2 flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all">
                {frontName ? (
                  <div className="text-center p-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-1">✓</span>
                    <p className="text-[12px] font-medium text-gray-900 truncate max-w-xs">{frontName}</p>
                    <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Front uploaded successfully</p>
                  </div>
                ) : (
                  <div className="text-center p-3 flex flex-col items-center">
                    <UploadCloud size={20} className="text-gray-400 mb-1" />
                    <span className="text-[12px] font-medium text-gray-700">Upload Front Side</span>
                  </div>
                )}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFrontName(file.name);
                  }}
                />
              </label>
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Back Side Card Photo *</label>
              <label className="mt-2 flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all">
                {backName ? (
                  <div className="text-center p-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-1">✓</span>
                    <p className="text-[12px] font-medium text-gray-900 truncate max-w-xs">{backName}</p>
                    <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Back uploaded successfully</p>
                  </div>
                ) : (
                  <div className="text-center p-3 flex flex-col items-center">
                    <UploadCloud size={20} className="text-gray-400 mb-1" />
                    <span className="text-[12px] font-medium text-gray-700">Upload Back Side</span>
                  </div>
                )}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setBackName(file.name);
                  }}
                />
              </label>
            </div>
          </div>

          <button
            onClick={() => nav('/provider-shop-register')}
            disabled={!ownerName || !address || !profileName || !docNumber || !frontName || !backName}
            className="mt-8 btn-primary w-full"
          >
            <span>Save & Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
