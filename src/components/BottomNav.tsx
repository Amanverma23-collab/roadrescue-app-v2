import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PhoneCall, Clock } from 'lucide-react';

function Item({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium transition ` +
        (isActive
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 active:bg-slate-200')
      }
    >
      <div className="h-5 w-5">{icon}</div>
      <div className="leading-none">{label}</div>
    </NavLink>
  );
}

export default function BottomNav({ sosEnabled }: { sosEnabled: boolean }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto w-full max-w-md px-4 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-2 shadow-[0_12px_40px_rgba(2,6,23,0.14)] backdrop-blur">
          <div className="flex items-stretch gap-2">
            <Item to="/home" label="Home" icon={<Home className="h-5 w-5" />} />
            <Item to="/search" label="Search" icon={<Search className="h-5 w-5" />} />
            <NavLink
              to={sosEnabled ? '/sos' : '/location'}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition ` +
                (isActive
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700')
              }
            >
              <div className="h-5 w-5">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div className="leading-none">SOS</div>
            </NavLink>
            <Item to="/history" label="History" icon={<Clock className="h-5 w-5" />} />
          </div>
        </div>
      </div>
    </div>
  );
}
