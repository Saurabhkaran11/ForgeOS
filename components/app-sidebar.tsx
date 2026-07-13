'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  CheckSquare, 
  Activity, 
  FileText, 
  Cpu, 
  Rocket, 
  Layers
} from 'lucide-react';

export function AppSidebar() {
  const pathname = usePathname();
  const [isDemoMode, setIsDemoMode] = useState(true);

  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        setIsDemoMode(data.isDemoMode);
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { name: 'Mission Control', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Employees', href: '/dashboard#employees', icon: Users },
    { name: 'Evidence', href: '/dashboard#prospects', icon: Database },
    { name: 'Approvals', href: '/approvals', icon: CheckSquare, badge: 2 },
    { name: 'Traces', href: '/traces', icon: Activity },
    { name: 'Investor Report', href: '/report', icon: FileText },
    { name: 'Integrations', href: '/integrations', icon: Cpu },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex flex-col shrink-0 h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-250">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
            Forge<span className="text-indigo-400">OS</span>
          </span>
        </Link>
      </div>

      {/* Preloaded startup identity indicator */}
      <div className="px-6 py-4 border-b border-zinc-900 bg-zinc-900/10">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-zinc-500">Active Startup</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <p className="mt-1 text-sm font-semibold text-zinc-200">WasteLess AI</p>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href.includes('#') && pathname === item.href.split('#')[0]);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge ? (
                <span className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 text-3xs font-bold text-amber-400">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Demo Mode status */}
      <div className="p-4 border-t border-zinc-900">
        {isDemoMode ? (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="text-3xs font-extrabold uppercase tracking-wider text-amber-400">Demo Mode</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-normal">
              Running with mock integration adapters. No API keys required.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-3xs font-extrabold uppercase tracking-wider text-emerald-400">Live Orchestration</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-normal">
              API integrations connected. Running in live sandbox mode.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
