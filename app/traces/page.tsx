'use client';

import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle2, CircleAlert, Info, XCircle } from 'lucide-react';
import { Trace } from '@/lib/types';

const traceStyle = {
  info: { icon: Info, color: 'text-indigo-400', label: 'Info' },
  success: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Success' },
  warn: { icon: CircleAlert, color: 'text-amber-400', label: 'Warning' },
  error: { icon: XCircle, color: 'text-rose-400', label: 'Error' },
};

export default function TracesPage() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraces = () => {
      const workflowId = localStorage.getItem('active_workflow_id');
      const url = workflowId ? `/api/traces?workflowId=${workflowId}` : '/api/traces';
      fetch(url)
        .then((res) => res.json())
        .then((data) => setTraces(data))
        .catch(() => setTraces([]))
        .finally(() => setLoading(false));
    };

    fetchTraces();
    const interval = setInterval(fetchTraces, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto w-full">
      <div className="border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
          <Activity className="h-3.5 w-3.5 animate-pulse" />
          <span>Execution Telemetry</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Workflow traces</h1>
        <p className="text-zinc-500 text-xs mt-1">Events from the active workflow and its connected services.</p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading workflow events…</p>
      ) : traces.length === 0 ? (
        <div className="rounded-xl border border-zinc-900 bg-zinc-950/30 p-8 text-center text-sm text-zinc-500">
          No events yet. Launch a company to begin collecting workflow telemetry.
        </div>
      ) : (
        <div className="space-y-3">
          {traces.map((trace) => {
            const style = traceStyle[trace.level];
            const Icon = style.icon;
            return (
              <article key={trace.id} className="rounded-xl border border-zinc-900 bg-zinc-950/30 p-4">
                <div className="flex items-start gap-3">
                  <Icon className={`h-4.5 w-4.5 mt-0.5 shrink-0 ${style.color}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-xs font-bold text-white">{trace.agentName}</span>
                      <span className="text-3xs uppercase tracking-wider text-zinc-500">{style.label}</span>
                      {trace.sponsorUsed && <span className="text-3xs text-indigo-400">{trace.sponsorUsed}</span>}
                      <span className="ml-auto text-3xs font-mono text-zinc-600">{trace.timestamp}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-300">{trace.message}</p>
                    {trace.details && <p className="mt-2 rounded bg-zinc-900/60 p-2 text-3xs font-mono text-zinc-500">{trace.details}</p>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
