'use client';

import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, AlertTriangle, Key, ShieldCheck, HelpCircle, Activity, User } from 'lucide-react';

interface IntegrationInfo {
  id: string;
  name: string;
  role: string;
  owningAgent: string;
  isConfigured: boolean;
  mode: 'live' | 'mock' | 'unavailable';
  healthStatus: 'healthy' | 'unhealthy' | 'degraded';
  healthMessage: string;
  latencyMs: number;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIntegrations = () => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        setIntegrations(data.integrations);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchIntegrations();
    const interval = setInterval(fetchIntegrations, 4000);
    return () => clearInterval(interval);
  }, []);

  const getModeBadge = (mode: string) => {
    const styles = {
      live: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      mock: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      unavailable: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    };
    return (
      <span className={`rounded-full border px-2.5 py-0.5 text-3xs font-semibold uppercase tracking-wider ${styles[mode as keyof typeof styles] || styles.unavailable}`}>
        {mode === 'live' ? 'Live API Connected' : mode === 'mock' ? 'Mock Fallback' : 'Unavailable'}
      </span>
    );
  };

  const getHealthBadge = (status: string) => {
    const styles = {
      healthy: 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20',
      degraded: 'bg-amber-600/10 text-amber-400 border-amber-500/20',
      unhealthy: 'bg-rose-600/10 text-rose-400 border-rose-500/20',
    };
    return (
      <span className={`rounded px-1.5 py-0.5 text-4xs font-extrabold uppercase tracking-wide border ${styles[status as keyof typeof styles] || styles.unhealthy}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
          <Cpu className="h-3.5 w-3.5" />
          <span>Sponsor Ecosystem Integrations</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Platform Integration Status</h1>
        <p className="text-zinc-500 text-xs mt-1">
          Monitor connection states, latencies, and agent assignments for all nine prize-relevant sponsors.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center p-12 text-zinc-500 text-sm">
          Loading integrations configurations...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((item) => (
            <div 
              key={item.id}
              className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-5 space-y-4 hover:border-zinc-800 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{item.name}</h3>
                  <span className="text-[10px] text-indigo-400 font-medium tracking-tight block mt-0.5">
                    {item.role}
                  </span>
                </div>
                {getModeBadge(item.mode)}
              </div>

              {/* Status details */}
              <div className="grid grid-cols-2 gap-4 border-y border-zinc-900/60 py-3.5 text-2xs text-zinc-400">
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-600 uppercase font-semibold text-4xs">Health Status</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {getHealthBadge(item.healthStatus)}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-600 uppercase font-semibold text-4xs">Checked Latency</span>
                  <div className="flex items-center gap-1.5 text-zinc-200 mt-0.5 font-mono font-semibold">
                    <Activity className="h-3 w-3 text-zinc-500" />
                    {item.latencyMs} ms
                  </div>
                </div>
              </div>

              {/* Owning Agent Assignment */}
              <div className="flex items-center gap-2 bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-900/40 text-2xs text-zinc-400">
                <User className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>
                  <strong className="text-zinc-300 font-medium">Assigned Agent:</strong> {item.owningAgent}
                </span>
              </div>

              {/* Health message */}
              <div className="text-[10px] text-zinc-500 italic bg-zinc-950 p-2.5 rounded border border-zinc-900/40 truncate">
                {item.healthMessage}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
