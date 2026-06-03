import {
ShieldCheck,
Eye,
Phone,
MapPin,
Star,
Clock,
Edit,
ImageIcon,
Wrench,
Power
} from "lucide-react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

export default function ProviderDashboard(){
    const nav = useNavigate();
    const [services,setServices]=useState({
tyre:true,
fuel:true,
battery:false
});

return (
<div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pb-32">

<div className="max-w-md mx-auto px-4 pt-5">

{/* top profile card */}
<div className="rounded-[32px] overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-[0_20px_50px_rgba(37,99,235,.35)]">

<div className="flex items-center justify-between">

<div>
<div className="text-sm opacity-80">
Welcome back 👋
</div>

<h1 className="text-2xl font-extrabold mt-1">
Rajesh Tyre Repair
</h1>

<div className="flex items-center gap-2 mt-3">

<div className="bg-white/20 px-3 py-1 rounded-full text-xs">
<ShieldCheck className="inline h-3 w-3"/>
Verified
</div>

<div className="bg-emerald-500 px-3 py-1 rounded-full text-xs">
Premium Active
</div>

</div>
</div>

<img
src="https://i.pravatar.cc/100"
className="w-16 h-16 rounded-full border-4 border-white"
/>

</div>

<div className="mt-5 bg-white/15 rounded-2xl p-3">
<div className="text-xs opacity-80">
Subscription expires
</div>

<div className="font-bold mt-1">
27 days remaining
</div>
</div>

</div>


{/* status control */}

<div className="bg-white rounded-[32px] p-5 shadow mt-5">

<div className="font-bold text-xl">
Availability Status
</div>

<div className="space-y-4 mt-6">

<div className="rounded-3xl border p-4 flex justify-between">
<div>
<div className="font-bold">🟡 Busy Mode</div>
<div className="text-xs text-slate-500">
Customers see busy
</div>
</div>

<button className="w-14 h-8 rounded-full bg-orange-500 relative">
<div className="absolute right-1 top-1 h-6 w-6 bg-white rounded-full"/>
</button>

</div>

<div className="rounded-3xl border p-4 flex justify-between">
<div>
<div className="font-bold">🔴 Closed Mode</div>
<div className="text-xs text-slate-500">
Temporarily hidden
</div>
</div>

<button className="w-14 h-8 rounded-full bg-slate-300 relative">
<div className="absolute left-1 top-1 h-6 w-6 bg-white rounded-full"/>
</button>

</div>

</div>

</div>


{/* analytics */}

<div className="grid grid-cols-2 gap-3 mt-4">

<div className="bg-white rounded-3xl p-4 shadow">
<Eye/>
<div className="text-2xl font-bold">1284</div>
<div className="text-xs">Profile Views</div>
</div>

<div className="bg-white rounded-3xl p-4 shadow">
<Phone/>
<div className="text-2xl font-bold">326</div>
<div className="text-xs">Call Clicks</div>
</div>

</div>


{/* services */}

<div className="bg-white rounded-[32px] p-5 shadow mt-5">

<div className="font-bold text-lg">
Manage Services
</div>

<div className="space-y-3 mt-4">

<div className="flex justify-between">

<div className="flex gap-3">
<Wrench/>
Tyre Repair
</div>

<button
onClick={()=>setServices({...services,tyre:!services.tyre})}
className={`px-4 py-2 rounded-full text-white ${
services.tyre
?"bg-emerald-500"
:"bg-slate-400"
}`}
>
{services.tyre?"ON":"OFF"}
</button>

</div>

<div className="flex justify-between">

<div className="flex gap-3">
<Wrench/>
Fuel Delivery
</div>

<button
onClick={()=>setServices({...services,fuel:!services.fuel})}
className={`px-4 py-2 rounded-full text-white ${
services.fuel
?"bg-emerald-500"
:"bg-slate-400"
}`}
>
{services.fuel?"ON":"OFF"}
</button>

</div>

<div className="flex justify-between">

<div className="flex gap-3">
<Wrench/>
Battery Jumpstart
</div>

<button
onClick={()=>setServices({...services,battery:!services.battery})}
className={`px-4 py-2 rounded-full text-white ${
services.battery
?"bg-emerald-500"
:"bg-slate-400"
}`}
>
{services.battery?"ON":"OFF"}
</button>

</div>

</div>

</div>

</div>

</div>
);
}