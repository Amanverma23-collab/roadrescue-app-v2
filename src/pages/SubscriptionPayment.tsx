import React from "react";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Landmark,
  QrCode,
  Repeat,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function SubscriptionPayment() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const plan = sp.get("plan");
  const [method, setMethod] = useState("upi");
  const [autoRenew, setAutoRenew] = useState(true);

  const details = {
    m1: { title: "1 Month", price: "₹60", badge: "Starter" },
    m6: { title: "6 Months", price: "₹300", badge: "Popular" },
    y1: { title: "1 Year", price: "₹600", badge: "Best Value" }
  };

  const current = details[plan as keyof typeof details];
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const originalPrice = parseInt(current?.price.replace("₹", "") || "0");
  const finalAmount = originalPrice - discount;
  const priceNumber = parseInt(current?.price.replace("₹", "") || "0");

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-28">
      <div className="mx-auto max-w-md px-4 pt-5">

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)] text-[11px] font-medium text-white">
            <Zap className="h-3 w-3" /> PREMIUM PLAN
          </div>

          <h1 className="mt-3 text-xl font-bold tracking-tight">{current?.title}</h1>

          <div className="flex items-center justify-between mt-4">
            <div>
              <div className="text-gray-500 text-[13px]">Total amount</div>
              <div className="text-3xl font-bold mt-1">{current?.price}</div>
            </div>
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700 text-[12px] font-semibold">
              {current?.badge}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-gray-50 p-3 text-[12px] font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Shop visibility
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-[12px] font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Media upload
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-[12px] font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Priority support
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-[12px] font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Service editing
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm mt-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-[14px] text-gray-900">Auto Renew</div>
              <div className="text-[12px] text-gray-500 mt-1">Enabled by default</div>
            </div>
            <button
              onClick={() => setAutoRenew(!autoRenew)}
              className={`px-4 py-2 rounded-lg font-semibold text-white text-[12px] transition-all cursor-pointer ${
                autoRenew ? "bg-emerald-500" : "bg-gray-400"
              }`}
            >
              <Repeat className="inline h-4 w-4 mr-1" />
              {autoRenew ? "ON" : "OFF"}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm mt-4"
        >
          <div className="font-semibold text-[14px] text-gray-900 flex items-center gap-1.5">
            <Tag className="h-4 w-4 text-blue-500" /> Promo Code
          </div>
          <div className="mt-3 flex gap-2">
            <div className="flex-1 flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 px-3.5 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all">
              <Tag className="text-gray-400 h-4 w-4" />
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="WELCOME10 / FLAT20"
                className="w-full bg-transparent text-[13px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={() => {
                if (coupon === "WELCOME10") {
                  setDiscount(Math.floor(originalPrice * 0.10));
                } else if (coupon === "FLAT20") {
                  setDiscount(20);
                } else {
                  setDiscount(0);
                }
              }}
              className="px-5 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-[12px]"
            >
              Apply
            </button>
          </div>
          <div className="mt-2 text-[12px] text-emerald-600 font-medium flex items-center gap-1">
            WELCOME10 → 10% off
          </div>
          {discount > 0 && (
            <div className="mt-4 rounded-lg bg-emerald-50 p-3">
              <div className="text-[13px] text-emerald-700 font-medium">Discount: ₹{discount}</div>
              <div className="font-bold text-lg mt-1">Final Amount: ₹{priceNumber - discount}</div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm mt-4"
        >
          <div className="font-semibold text-[14px] text-gray-900 flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-blue-500" /> Payment Method
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <button
              onClick={() => setMethod("card")}
              className={`rounded-xl p-4 border-2 transition-all cursor-pointer ${
                method === "card"
                  ? "border-[var(--color-primary)] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <CreditCard className="mx-auto h-5 w-5" />
              <div className="mt-2 text-[12px] font-semibold">Card</div>
            </button>

            <button
              onClick={() => setMethod("net")}
              className={`rounded-xl p-4 border-2 transition-all cursor-pointer ${
                method === "net"
                  ? "border-[var(--color-primary)] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Landmark className="mx-auto h-5 w-5" />
              <div className="mt-2 text-[12px] font-semibold">Net</div>
            </button>

            <button
              onClick={() => setMethod("upi")}
              className={`rounded-xl p-4 border-2 transition-all cursor-pointer ${
                method === "upi"
                  ? "border-[var(--color-primary)] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <QrCode className="mx-auto h-5 w-5" />
              <div className="mt-2 text-[12px] font-semibold">UPI</div>
            </button>
          </div>
        </motion.div>

        <div className="fixed bottom-5 left-0 right-0 px-4">
          <div className="mx-auto max-w-md">
            <button
              onClick={() => {
                alert("Payment Successful!");
                nav("/provider-dashboard");
              }}
              className="btn-primary w-full py-4"
            >
              <Zap className="h-4 w-4" /> Pay ₹{finalAmount}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
