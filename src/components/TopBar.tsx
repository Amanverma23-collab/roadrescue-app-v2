import { Menu } from 'lucide-react';
import { useState } from 'react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, ChevronLeft } from 'lucide-react';


export default function TopBar({ title, backTo }: { title: string; backTo?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loc = useLocation();
  const canGoBack = Boolean(backTo) && loc.pathname !== backTo;

  return (
    <div className="sticky top-0 z-[100] border-b border-slate-200/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex w-full max-w-md items-center gap-3 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {canGoBack ? (
            <Link
              to={backTo!}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm active:scale-[0.98]"
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          ) : (
           <button
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm"
>
  <Menu className="h-5 w-5" />
</button>
          )}
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold leading-5 text-slate-900">{title}</div>
            <div className="truncate text-xs text-slate-500">Fast help. Verified providers nearby.</div>
          </div>
        </div>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm active:scale-[0.98]"
          aria-label="Alerts"
          onClick={() => alert('Alerts are coming soon.')}
        >
          <Bell className="h-5 w-5" />
        </button>
            </div>
{sidebarOpen && (
  <div
    onClick={() => setSidebarOpen(false)}
    className="fixed inset-0 z-[90] bg-white/30 backdrop-blur-[30px]"
  />
)}

      <div
      className={`fixed top-0 left-0 z-[101] h-full w-72
bg-white shadow-2xl transition-all duration-300
${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-5">

         <div className="flex items-center justify-between">
  <div className="text-lg font-bold">
    Menu
  </div>

  <button
    onClick={() => setSidebarOpen(false)}
    className="rounded-lg px-2 py-1 text-xl"
  >
    ✕
  </button>
</div>
          <div className="mt-5 flex flex-col gap-3">

           <button
onClick={()=>setSidebarOpen(false)}
className="rounded-2xl border p-3 text-left hover:bg-slate-50"
>
              Edit Profile
            </button>

           <button
onClick={()=>setSidebarOpen(false)}
className="rounded-2xl border p-3 text-left hover:bg-slate-50"
>
              Settings
            </button>

            <button
              onClick={() => {
                localStorage.removeItem('rr_phone_v1');
                localStorage.removeItem('rr_loc_v1');
                window.location.href="/";
              }}
              className="rounded-2xl bg-red-500 p-3 text-white"
            >
              Logout
            </button>

          </div>

        </div>
      </div>

    </div>
  );
}
