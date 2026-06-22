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
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';
import VerificationPending from './pages/VerificationPending';
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
    const dark = localStorage.getItem('rr_settings_dark_mode') === 'true';
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    const lang = localStorage.getItem('rr_settings_language') || 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, []);

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
    <div className="min-h-screen bg-[var(--color-surface)]">
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
<Route path="/verification-pending" element={<VerificationPending />} />
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
        <Route path="/profile" element={<EditProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<HelpSupport />} />
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
