import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import LocationGate from './pages/LocationGate';
import Home from './pages/Home';
import ServiceProviders from './pages/ServiceProviders';
import ProviderDetail from './pages/ProviderDetail';
import ProviderConsole from './pages/ProviderConsole';
import Search from './pages/Search';
import SOS from './pages/SOS';
import History from './pages/History';
import RequestFlow from './pages/RequestFlow';
import Tracking from './pages/Tracking';
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
    return authed && !['/'].includes(loc.pathname);
  }, [authed, loc.pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route
          path="/"
          element={
            authed ? (
              <Navigate to={hasLocation ? '/home' : '/location'} replace />
            ) : (
              <Login onLogin={(p) => setPhone(p)} />
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
        <Route path="/track/:id" element={<Tracking location={location} />} />
        <Route path="/sos" element={<SOS phone={phone} location={location} services={services} />} />
        <Route path="/history" element={<History phone={phone} />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      {showNav ? <BottomNav sosEnabled={hasLocation} /> : null}
    </div>
  );
}
