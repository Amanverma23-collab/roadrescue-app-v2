import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import LocationGate from './pages/LocationGate';
import Home from './pages/Home';
import ServiceProviders from './pages/ServiceProviders';
import ProviderDetail from './pages/ProviderDetail';
import ProviderConsole from './pages/ProviderConsole';
import ProviderProfile from './pages/ProviderProfile';
import ProviderShopRegister from './pages/ProviderShopRegister';
import ProviderPaywall from './pages/ProviderPaywall';
import ProviderApproved from './pages/ProviderApproved';
import Search from './pages/Search';
import SOS from './pages/SOS';
import History from './pages/History';
import RequestFlow from './pages/RequestFlow';
import Tracking from './pages/Tracking';
import SubscriptionPayment from './pages/SubscriptionPayment';
import ProviderDashboard from "./pages/ProviderDashboard";
import type { Service } from './lib/api';
import { fetchServices } from './lib/api';



const LS_PHONE = 'rr_phone_v1';
const LS_LOC = 'rr_loc_v1';

type Loc = { lat: number; lng: number; accuracy?: number };

function usePersistedState() {
  const [phone, setPhone] = useState<string | null>(() => localStorage.getItem(LS_PHONE));
  const [location, setLocation] = useState<Loc | null>(() => {
    const raw = localStorage.getItem(LS_LOC);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (phone) localStorage.setItem(LS_PHONE, phone);
    else localStorage.removeItem(LS_PHONE);
  }, [phone]);

  useEffect(() => {
    if (location) localStorage.setItem(LS_LOC, JSON.stringify(location));
    else localStorage.removeItem(LS_LOC);
  }, [location]);

  return { phone, setPhone, location, setLocation };
}

export default function AppShell() {
  const { phone, setPhone, location, setLocation } = usePersistedState();
  const loc = useLocation();
  const nav = useNavigate();

  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const s = await fetchServices();
        setServices(s);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const authed = Boolean(phone);
  const hasLocation = Boolean(location);

  useEffect(() => {
    if (!authed && loc.pathname !== '/') {
      nav('/', { replace: true });
    }
  }, [authed, loc.pathname, nav]);

const showNav = useMemo(() => {
  return authed && ![
    '/',
    '/provider-profile',
    '/provider-console',
    '/provider-shop-register',
    '/verification-pending',
    '/provider-approved',
'/subscription'
  ].includes(loc.pathname);
}, [authed, loc.pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route
  path="/"
  element={
    authed ? (
      localStorage.getItem('rr_role') === 'provider'
        ? <Navigate to="/provider-profile" replace />
        : <Navigate to={hasLocation ? '/home' : '/location'} replace />
    ) : (
      <Login
        onLogin={(p, role) => {
          setPhone(p);

          localStorage.setItem('rr_role', role);

          if (role === 'provider') {
            nav('/provider-profile');
          } else {
            nav(hasLocation ? '/home' : '/location');
          }
        }}
      />
    )
  }
/>
        
        <Route path="/location" element={<LocationGate onAllow={(p) => setLocation(p)} />} />
        <Route path="/home" element={<Home phone={phone} location={location} />} />
        <Route path="/search" element={<Search location={location} />} />
        <Route path="/service/:slug" element={<ServiceProviders location={location} />} />
        <Route path="/service/:slug/request" element={<RequestFlow phone={phone} location={location} />} />
        <Route path="/provider/:id" element={<ProviderDetail location={location} />} />
        <Route path="/provider-console" element={<ProviderConsole />} />
        <Route
 path="/subscription-payment"
 element={<SubscriptionPayment />}
/>
        <Route path="/track/:id" element={<Tracking location={location} />} />
        <Route path="/sos" element={<SOS phone={phone} location={location} services={services} />} />
        <Route path="/history" element={<History phone={phone} />} />

        <Route path="/provider-profile" element={<ProviderProfile />} />
        <Route
 path="/provider-shop-register"
 element={<ProviderShopRegister/>}
/>
<Route
 path="/verification-pending"
 element={
  <div className="mx-auto w-full max-w-md min-h-screen p-5">

   <h1 className="text-2xl font-bold">
    Verification Pending
   </h1>

   <div className="mt-6 rounded-3xl border p-5 text-center">

    <div className="text-5xl">
      🟡
    </div>

    <div className="mx-auto w-full max-w-md min-h-screen bg-slate-50 px-4 py-6">

<div className="text-sm font-semibold">
Step 3 / 4
</div>

<div className="mt-2 h-3 rounded-full bg-slate-200 overflow-hidden">
<div className="h-full w-3/4 rounded-full bg-blue-600"/>
</div>

<div className="mt-8 rounded-3xl bg-white p-6 shadow">

<div className="flex justify-center">

<div className="relative">

<div className="h-24 w-24 animate-pulse rounded-full bg-yellow-200"/>

<div className="absolute inset-0 flex items-center justify-center text-5xl">
🛡️
</div>

</div>

</div>

<h1 className="mt-6 text-center text-2xl font-bold">
Verification in Progress
</h1>

<p className="mt-2 text-center text-slate-500">
We're reviewing your profile and shop documents
</p>

<div className="mt-6 rounded-2xl bg-slate-50 p-4">

<div className="flex justify-between">
<span>✅ Profile Completed</span>
</div>

<div className="mt-3">
✅ Shop Registered
</div>

<div className="mt-3 font-semibold text-yellow-600">
🟡 Documents Under Review
</div>

<div className="mt-3 text-slate-400">
⏳ Waiting for approval
</div>

<div className="mt-3 text-slate-400">
🔒 Subscription locked
</div>

</div>

<div className="mt-6 rounded-2xl border p-4">

<div className="text-sm text-slate-500">
Last update
</div>

<div className="font-semibold">
Documents uploaded successfully
</div>

<div className="text-xs text-slate-400">
2 min ago
</div>

</div>


<button className="mt-6 w-full rounded-2xl bg-blue-600 p-4 text-white font-semibold">
🔔 Notify me when approved
</button>
<button
onClick={()=>nav('/provider-approved')}
className="mt-3 w-full rounded-2xl border-2 border-green-600 p-4 font-semibold text-green-600"
>
🛠 Demo Admin Approve
</button>

<div className="mt-4 text-center text-sm text-slate-500">
After approval you’ll get
48 hours to activate subscription
</div>

</div>
</div>

    <p className="mt-2 text-slate-500">
      Verification usually takes 2–24 hours
    </p>

   </div>

  </div>
 }
/>
<Route
path="/provider-approved"
element={<ProviderApproved/>}
/>
<Route
  path="/subscription"
  element={<ProviderPaywall providerPhone={phone || ''} />}
/>
<Route
path="/provider-dashboard"
element={<ProviderDashboard/>}
/>
<Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
{showNav &&
loc.pathname !== "/provider-dashboard" &&
loc.pathname !== "/subscription-payment"
? <BottomNav sosEnabled={hasLocation}/>
: null}
    </div>
  );
}
