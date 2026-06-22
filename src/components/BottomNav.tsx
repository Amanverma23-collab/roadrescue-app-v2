import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PhoneCall, Clock } from 'lucide-react';

function Item({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center justify-center gap-1 py-2 px-1 text-[10px] font-medium transition-colors duration-200 ` +
        (isActive
          ? 'text-[var(--color-primary)]'
          : 'text-gray-400 hover:text-gray-600')
      }
    >
      <div className="h-5 w-5">{icon}</div>
      <div className="leading-none">{label}</div>
    </NavLink>
  );
}

export default function BottomNav({ sosEnabled }: { sosEnabled: boolean }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto w-full max-w-md px-4 pb-[max(8px,env(safe-area-inset-bottom))]">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-lg shadow-black/5 p-1.5">
          <div className="flex items-center gap-0.5">
            <Item to="/home" label="Home" icon={<Home className="h-5 w-5" />} />
            <Item to="/search" label="Search" icon={<Search className="h-5 w-5" />} />
            
            <NavLink
              to={sosEnabled ? '/sos' : '/location'}
              className={({ isActive }) =>
                `relative flex flex-1 flex-col items-center justify-center gap-1 py-2 px-1 text-[10px] font-semibold transition-all duration-200 rounded-xl ` +
                (isActive
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                  : 'bg-red-500 text-white shadow-sm shadow-red-500/15 hover:bg-red-600 active:scale-95')
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
