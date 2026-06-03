import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, MapPin, Camera } from "lucide-react";

export default function ProviderProfile() {
  const [docType, setDocType] = useState("aadhaar");
 const [profileName,setProfileName]=useState('');
 const [frontName,setFrontName]=useState('');
const [backName,setBackName]=useState('');
const nav = useNavigate();
  return (
<div className="mx-auto w-full max-w-md min-h-screen bg-slate-50 px-4 py-5 pb-32">
      
      {/* progress */}
      <div className="mb-6">
        <div className="text-sm font-semibold">
          Step 1 / 2
        </div>

        <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/2 rounded-full bg-blue-600"></div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">

        <div className="text-xl font-bold">
          Complete Your Profile
        </div>

        <div className="mt-1 text-sm text-slate-500">
          Complete required details to continue
        </div>

        {/* owner name */}

        <div className="mt-6">
          <label className="text-sm font-semibold">
            Owner Name *
          </label>

          <div className="mt-2 flex items-center gap-2 rounded-2xl border p-3">
            <User size={18}/>
            <input
              placeholder="Enter owner name"
              className="w-full outline-none"
            />
          </div>
        </div>


        {/* email */}

        <div className="mt-4">
          <label className="text-sm font-semibold">
            Email (optional)
          </label>

          <div className="mt-2 flex items-center gap-2 rounded-2xl border p-3">
            <Mail size={18}/>
            <input
              placeholder="name@email.com"
              className="w-full outline-none"
            />
          </div>
        </div>


        {/* address */}

        <div className="mt-4">
          <label className="text-sm font-semibold">
            Home Address *
          </label>

          <div className="mt-2 flex items-center gap-2 rounded-2xl border p-3">
            <MapPin size={18}/>
            <input
              placeholder="Enter address"
              className="w-full outline-none"
            />
          </div>
        </div>


        {/* profile photo */}

        <div className="mt-6">

          <div className="text-sm font-semibold">
            Profile Photo *
          </div>

         <label className="mt-2 flex h-32 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed">

{profileName ? (
<>
<div className="text-xl">✅</div>

<div className="font-semibold">
{profileName}
</div>

<div className="text-green-600 text-xs">
Photo Added Successfully
</div>
</>
):(
<>
<Camera size={30}/>

<div className="mt-2 text-sm">
Upload profile photo
</div>
</>
)}

<input
hidden
type="file"
accept="image/*"
onChange={(e)=>{
 const file=e.target.files?.[0];

 if(file){
   setProfileName(file.name)
 }
}}
/>

</label>

        </div>


        {/* choose document */}

        <div className="mt-6">

          <div className="text-sm font-semibold">
            Identity Verification *
          </div>

          <div className="mt-3 flex gap-3">

            <button
              onClick={()=>setDocType("aadhaar")}
              className={`flex-1 rounded-2xl p-3 border ${
                docType==="aadhaar"
                ? "bg-blue-600 text-white"
                :"bg-white"
              }`}
            >
              Aadhaar
            </button>


            <button
              onClick={()=>setDocType("pan")}
              className={`flex-1 rounded-2xl p-3 border ${
                docType==="pan"
                ? "bg-blue-600 text-white"
                :"bg-white"
              }`}
            >
              PAN
            </button>

          </div>

        </div>


        {/* document number */}

        <div className="mt-4">

          <label className="text-sm font-semibold">
            {docType==="aadhaar"
            ?"Aadhaar Number *"
            :"PAN Number *"}
          </label>

          <input
            className="mt-2 w-full rounded-2xl border p-3 outline-none"
            placeholder="Enter number"
          />

        </div>


        {/* front */}

        <div className="mt-4">

          <div className="text-sm font-semibold">
            Front Side Upload *
          </div>

<label className="mt-2 flex h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed">

{frontName ? (
<>
<div className="text-lg">✅</div>

<div className="font-semibold">
{frontName}
</div>

<div className="text-xs text-green-600">
Front uploaded
</div>
</>
):(
<>Upload Front</>
)}

<input
hidden
type="file"
accept="image/*"
onChange={(e)=>{
 const file=e.target.files?.[0];

 if(file){
   setFrontName(file.name)
 }
}}
/>

</label>

           

        </div>


        {/* back */}

        <div className="mt-4">

          <div className="text-sm font-semibold">
            Back Side Upload *
          </div>

         <label className="mt-2 flex h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed">

{backName ? (
<>
<div className="text-lg">✅</div>

<div className="font-semibold">
{backName}
</div>

<div className="text-xs text-green-600">
Back uploaded
</div>
</>
):(
<>Upload Back</>
)}

<input
hidden
type="file"
accept="image/*"
onChange={(e)=>{
 const file=e.target.files?.[0];

 if(file){
   setBackName(file.name)
 }
}}
/>

</label>

        </div>


        <button
 onClick={() => nav('/provider-shop-register')}
  className="mt-8 w-full cursor-pointer rounded-2xl bg-blue-600 p-4 font-semibold text-white"
>
  Save & Continue
</button>

      </div>

    </div>
  );
}