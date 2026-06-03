import { useState } from "react";
import { Store, MapPin, Camera, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProviderShopRegister() {
const nav=useNavigate();

const [shopPhoto,setShopPhoto]=useState('');
const [services,setServices]=useState([
 {name:'',price:''}
]);

const addService=()=>{
 setServices([
   ...services,
   {name:'',price:''}
 ])
}

return(

<div className="mx-auto w-full max-w-md min-h-screen bg-slate-50 px-4 py-5 pb-10">

<div className="mb-6">
<div className="text-sm font-semibold">
Step 2 / 2
</div>

<div className="mt-2 h-3 rounded-full bg-slate-200">
<div className="h-full w-full rounded-full bg-blue-600"/>
</div>
</div>


<div className="rounded-3xl bg-white p-5 shadow-sm">

<h1 className="text-2xl font-bold">
Register Your Shop
</h1>

<p className="mt-1 text-sm text-slate-500">
Complete shop details
</p>


<div className="mt-6">
<label className="text-sm font-semibold">
Shop Name *
</label>

<div className="mt-2 flex items-center gap-2 rounded-2xl border p-3">
<Store size={18}/>
<input
className="w-full outline-none"
placeholder="Sharma Auto Care"
/>
</div>
</div>


<div className="mt-5">
<div className="text-sm font-semibold">
Shop Front Photo *
</div>

<label className="mt-2 flex h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed">

{shopPhoto ? (
<>
<div>✅</div>

<div className="font-semibold">
{shopPhoto}
</div>

<div className="text-xs text-green-600">
Photo uploaded
</div>
</>
):(
<>Upload Shop Photo</>
)}

<input
hidden
type="file"
accept="image/*"
onChange={(e)=>{
 const file=e.target.files?.[0];

 if(file){
   setShopPhoto(file.name)
 }
}}
/>

</label>
</div>


<div className="mt-5">
<label className="text-sm font-semibold">
GST (optional)
</label>

<input
className="mt-2 w-full rounded-2xl border p-3 outline-none"
placeholder="GST number"
/>
</div>


<div className="mt-5">
<label className="text-sm font-semibold">
Service Category *
</label>

<select className="mt-2 w-full rounded-2xl border p-3">

<option>Car Mechanic</option>
<option>Bike Mechanic</option>
<option>Towing</option>
<option>Puncture</option>

</select>
</div>


<div className="mt-5">
<label className="text-sm font-semibold">
Shop Address *
</label>

<div className="mt-2 flex items-center gap-2 rounded-2xl border p-3">
<MapPin size={18}/>
<input
className="w-full outline-none"
placeholder="Enter address"
/>
</div>
</div>


<div className="mt-5">
<label className="text-sm font-semibold">
Google Map Pin *
</label>

<div className="mt-2 rounded-2xl border p-4 text-center">
📍 Select map location
</div>
</div>


<div className="mt-5 flex gap-3">

<div className="flex-1">
<label>Open</label>

<input
type="time"
className="mt-2 w-full rounded-2xl border p-3"
/>
</div>

<div className="flex-1">
<label>Close</label>

<input
type="time"
className="mt-2 w-full rounded-2xl border p-3"
/>
</div>

</div>



<div className="mt-6">

<div className="flex items-center justify-between">

<div className="font-semibold">
Services & Products
</div>

<button
onClick={addService}
className="cursor-pointer rounded-xl bg-blue-600 p-2 text-white"
>

<Plus size={18}/>

</button>

</div>


{services.map((s,index)=>(

<div
key={index}
className="mt-3 rounded-2xl border p-3"
>

<input
placeholder="Service name"
className="w-full outline-none"
/>

<input
placeholder="Price optional"
className="mt-3 w-full outline-none"
/>

</div>

))}

</div>



<button
onClick={()=>nav('/verification-pending')}
className="mt-8 w-full cursor-pointer rounded-2xl bg-blue-600 p-4 font-semibold text-white"
>
Save & Submit
</button>


</div>
</div>

)

}