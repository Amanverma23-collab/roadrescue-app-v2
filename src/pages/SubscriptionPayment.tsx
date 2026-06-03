import React from "react";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
CreditCard,
Landmark,
QrCode,
Repeat,
Tag
} from "lucide-react";
export default function SubscriptionPayment() {

const nav = useNavigate();

const [sp] = useSearchParams();

const plan = sp.get("plan");

const [method,setMethod] = useState("upi");
const [autoRenew,setAutoRenew] = useState(true);

const details = {
 m1:{
   title:"1 Month",
   price:"₹60",
   badge:"Starter"
 },

 m6:{
   title:"6 Months",
   price:"₹300",
   badge:"Popular"
 },

 y1:{
   title:"1 Year",
   price:"₹600",
   badge:"Best Value"
 }
};

const current =
details[plan as keyof typeof details];

 const [coupon,setCoupon]=useState("");
const [discount,setDiscount]=useState(0);

const originalPrice =
parseInt(current?.price.replace("₹","") || "0");

const finalAmount =
originalPrice - discount;

const priceNumber =
parseInt(current?.price.replace("₹","") || "0");

const applyCoupon=()=>{

if(coupon==="WELCOME10"){
setDiscount(priceNumber*0.10)
}

else if(coupon==="FLAT20"){
setDiscount(20)
}

else{
setDiscount(0)
alert("Invalid coupon")
}

}

return (
<div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pb-28">

  <div className="mx-auto max-w-md px-4 pt-5">

    {/* top card */}
    <div className="rounded-[32px] bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,.08)]">

      <div className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
        PREMIUM PLAN
      </div>

      <h1 className="mt-3 text-2xl font-extrabold">
        {current?.title}
      </h1>

      <div className="flex items-center justify-between mt-4">

        <div>
          <div className="text-slate-500 text-sm">
            Total amount
          </div>

          <div className="text-4xl font-extrabold">
            {current?.price}
          </div>
        </div>

        <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-emerald-700 text-sm font-bold">
          {current?.badge}
        </div>

      </div>


      {/* features */}
      <div className="mt-5 grid grid-cols-2 gap-2">

        <div className="rounded-2xl bg-slate-50 p-3 text-xs font-semibold">
          ✅ Shop visibility
        </div>

        <div className="rounded-2xl bg-slate-50 p-3 text-xs font-semibold">
          ✅ Media upload
        </div>

        <div className="rounded-2xl bg-slate-50 p-3 text-xs font-semibold">
          ✅ Priority support
        </div>

        <div className="rounded-2xl bg-slate-50 p-3 text-xs font-semibold">
          ✅ Service editing
        </div>

      </div>

    </div>



    {/* auto renew */}

    <div className="mt-4 rounded-[30px] bg-white p-5 shadow">

      <div className="flex items-center justify-between">

        <div>
          <div className="font-bold">
            Auto renew
          </div>

          <div className="text-xs text-slate-500 mt-1">
            Enabled by default
          </div>
        </div>

        <button
        onClick={()=>setAutoRenew(!autoRenew)}
        className={`px-4 py-3 rounded-2xl font-bold text-white ${
          autoRenew
          ? "bg-emerald-600"
          : "bg-slate-400"
        }`}
        >
        <Repeat className="inline h-4 w-4 mr-1"/>
        {autoRenew ? "ON":"OFF"}
        </button>

      </div>
    </div>



    {/* coupon */}

    <div className="mt-4 rounded-[30px] bg-white p-5 shadow">

      <div className="font-bold">
        Promo code
      </div>

     <div className="mt-3 flex gap-2">

<div className="border rounded-2xl p-4 flex items-center gap-3 flex-1">

<Tag className="text-slate-400"/>

<input
value={coupon}
onChange={(e)=>setCoupon(e.target.value)}
placeholder="WELCOME10 / FLAT20"
/>

</div>

<button
onClick={()=>{
if(coupon==="WELCOME10"){
setDiscount(Math.floor(originalPrice*0.10));
}
else if(coupon==="FLAT20"){
setDiscount(20);
}
else{
setDiscount(0);
}
}}
className="px-5 rounded-2xl bg-blue-600 text-white font-bold"
>
Apply
</button>

</div>

      <div className="mt-2 text-xs text-green-600">
        WELCOME10 → 10% off
      </div>
{discount>0 && (

<div className="mt-4 rounded-2xl bg-green-50 p-3">

<div className="text-sm text-green-700">
Discount: ₹{discount}
</div>

<div className="font-bold text-xl">
Final Amount:
₹{priceNumber-discount}
</div>

</div>

)}
    </div>



    {/* payment methods */}

    <div className="mt-4 rounded-[30px] bg-white p-5 shadow">

      <div className="font-bold">
        Payment method
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">

        <button
        onClick={()=>setMethod("card")}
        className={`rounded-2xl p-4 border ${
        method==="card"
        ?"border-blue-500 bg-blue-50"
        :"border-slate-200"
        }`}
        >
          <CreditCard className="mx-auto"/>
          <div className="mt-2 text-xs">
            Card
          </div>
        </button>


        <button
        onClick={()=>setMethod("net")}
        className={`rounded-2xl p-4 border ${
        method==="net"
        ?"border-blue-500 bg-blue-50"
        :"border-slate-200"
        }`}
        >
          <Landmark className="mx-auto"/>
          <div className="mt-2 text-xs">
            Net
          </div>
        </button>


        <button
        onClick={()=>setMethod("upi")}
        className={`rounded-2xl p-4 border ${
        method==="upi"
        ?"border-blue-500 bg-blue-50"
        :"border-slate-200"
        }`}
        >
          <QrCode className="mx-auto"/>
          <div className="mt-2 text-xs">
            UPI
          </div>
        </button>

      </div>

    </div>


    {/* sticky button */}

    <div className="fixed bottom-5 left-0 right-0 px-4">
      <div className="mx-auto max-w-md">

     <button
onClick={()=>{
alert("Payment Successful 🎉");
nav("/provider-dashboard");
}}
className="w-full rounded-3xl py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-[0_15px_35px_rgba(249,115,22,.4)]"
>

⚡ Pay ₹{finalAmount}

</button>

      </div>
    </div>

  </div>

</div>
);
}