import { useEffect,useState } from "react";
import { ShieldCheck,Store,Wallet,Rocket,TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProviderApproved(){

const nav=useNavigate();

const [timeLeft,setTimeLeft]=useState(48*60*60);

useEffect(()=>{

const timer=setInterval(()=>{

setTimeLeft(prev=>{

if(prev<=1){
clearInterval(timer);
return 0;
}

return prev-1;

});

},1000);

return ()=>clearInterval(timer);

},[]);

const hours=Math.floor(timeLeft/3600);

const minutes=Math.floor(
(timeLeft%3600)/60
);

const seconds=timeLeft%60;

return(

<div className="min-h-screen bg-slate-50 px-3 py-2">

<div className="mx-auto max-w-md">

<div className="rounded-[30px] bg-white p-4 shadow-lg">

<div className="relative overflow-hidden pt-6">

{/* confetti */}
<div className="absolute inset-0 pointer-events-none">

<div className="absolute left-8 top-8 text-green-500 animate-bounce">✦</div>
<div className="absolute right-10 top-12 text-yellow-400">◆</div>
<div className="absolute left-16 top-28 text-green-400">✦</div>
<div className="absolute right-20 top-24 text-yellow-500 animate-pulse">❖</div>

<div className="absolute left-20 top-16 text-3xl">
🎊
</div>

<div className="absolute right-20 top-20 text-3xl">
🎉
</div>

</div>


{/* glow area */}
<div className="flex justify-center">

<div className="relative h-36 w-36">

<div className="absolute inset-0 rounded-full bg-green-100 blur-2xl scale-110"/>

<div className="absolute inset-6 rounded-full border-4 border-green-100 opacity-60"/>

<div className="absolute inset-10 rounded-full border-4 border-green-200 opacity-50"/>


{/* platform */}
<div className="absolute bottom-6 left-1/2 h-8 w-36 -translate-x-1/2 rounded-full bg-gradient-to-r from-green-300 to-emerald-500 shadow-xl"/>

<div className="absolute bottom-10 left-1/2 h-8 w-28 -translate-x-1/2 rounded-full bg-white shadow"/>


{/* shield */}
<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

<div className="rounded-[35px] bg-gradient-to-br from-green-400 to-emerald-600 p-8 shadow-2xl">

<ShieldCheck
size={55}
className="text-white"
/>

</div>

</div>

</div>

</div>


<div className="mt-3 flex justify-center">

<div className="rounded-full bg-green-100 px-5 py-2 font-bold text-green-700">

🛡 VERIFICATION COMPLETE

</div>

</div>


<h1 className="mt-4 text-center text-4xl font-extrabold leading-tight text-slate-900">

Verification

Approved 🎉

</h1>

<p className="mt-3 text-center text-sm text-slate-500 leading-8">

Your shop verification is complete.

<br/>

Activate your subscription to make your shop live.

</p>

</div>


<div className="mt-5 rounded-2xl bg-green-50 p-5">

<div className="text-center text-green-700 font-semibold">
⏰ Payment Deadline
</div>

<div className="mt-3 flex justify-center gap-2">

<div className="rounded-2xl bg-white p-4 shadow">
<div className="text-4xl font-bold text-green-600">
{String(hours).padStart(2,'0')}
</div>

<div className="text-xs">
HOURS
</div>
</div>

<div className="text-4xl mt-4">
:
</div>

<div className="rounded-2xl bg-white p-4 shadow">
<div className="text-4xl font-bold text-green-600">
{String(minutes).padStart(2,'0')}
</div>

<div className="text-xs">
MIN
</div>
</div>

<div className="text-4xl mt-4">
:
</div>

<div className="rounded-2xl bg-white p-4 shadow">
<div className="text-4xl font-bold text-green-600">
{String(seconds).padStart(2,'0')}
</div>

<div className="text-xs">
SEC
</div>
</div>

</div>

<div className="mt-4 text-center text-sm">
After 48 hours verification expires
</div>

</div>


<div className="mt-8">




<div className="mt-4 rounded-3xl bg-white p-4 shadow-sm">

<div className="mb-5 flex items-center justify-center gap-2">

<div className="h-[1px] w-14 bg-slate-300"/>

<div className="text-xs font-bold text-slate-500">
WHAT HAPPENS NEXT?
</div>

<div className="h-[1px] w-14 bg-slate-300"/>

</div>


<div className="grid grid-cols-4 gap-3 text-center">

<div className="relative">

<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
<Store className="text-green-600" size={24}/>
</div>

<div className="absolute top-[28px] left-[58px] w-[60px] border-t-[3px] border-dashed border-slate-300"/>

<div className="mt-3 text-xs font-bold">
1. Verified
</div>

<div className="mt-1 text-[9px] text-slate-500">
Your shop approved
</div>

</div>



<div className="relative">

<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
<Wallet className="text-violet-600" size={24}/>
</div>

<div className="absolute top-[27px] left-[52px] w-[72px] border-t-[3px] border-dashed border-slate-300"/>

<div className="mt-3 text-xs font-bold">
2. Payment
</div>

<div className="mt-1 text-[9px] text-slate-500">
Complete payment
</div>

</div>



<div className="relative">

<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
<Rocket className="text-orange-500" size={24}/>
</div>

<div className="absolute top-[27px] left-[52px] w-[72px] border-t-[3px] border-dashed border-slate-300"/>

<div className="mt-3 text-xs font-bold">
3. Go Live
</div>

<div className="mt-1 text-[9px] text-slate-500">
Visible to users
</div>

</div>



<div>

<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
<TrendingUp className="text-blue-600" size={24}/>
</div>

<div className="mt-3 text-xs font-bold">
4. Growth
</div>

<div className="mt-1 text-[9px] text-slate-500">
Get more customers
</div>

</div>

</div>

</div>


</div>


<button
onClick={()=>nav('/subscription')}
className="mt-5 w-full rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 p-5 font-bold text-white shadow-lg"
>

⚡ Continue to Subscription

</button>

<div className="mt-4 text-center text-sm text-slate-400">
🔒 Secure & encrypted payment
</div>

</div>

</div>

</div>

)

}