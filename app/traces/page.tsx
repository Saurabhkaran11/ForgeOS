'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Cpu, ChevronRight, ChevronDown, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { Trace } from '@/lib/types';

interface TreeNodeProps {
  title: string;
  agentRole?: string;
  sponsor?: string;
  mode?: 'live' | 'mock' | 'unavailable';
  latency?: string;
  input?: string;
  output?: string;
  status: 'completed' | 'running' | 'queued' | 'paused' | 'failed';
  children?: React.ReactNode;
}

function TraceNode({ title, agentRole, sponsor, mode, latency, input, output, status, children }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true);

  const statusStyles = {
    completed: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    running: 'text-amber-400 border-amber-500/20 bg-amber-500/5 animate-pulse',
    queued: 'text-zinc-500 border-zinc-900 bg-zinc-950/20',
    paused: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
    failed: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
  };

  return (
    <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-4.5 space-y-3 transition-colors">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {children && (
            <button onClick={() => setExpanded(!expanded)} className="text-zinc-500 hover:text-zinc-300">
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              {title}
              {agentRole && <span className="text-3xs text-indigo-400 font-medium">({agentRole})</span>}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {sponsor && (
            <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-4xs font-semibold text-zinc-300">
              {sponsor} {mode && `[${mode}]`}
            </span>
          )}
          {latency && (
            <span className="text-4xs text-zinc-500 font-mono">{latency}</span>
          )}
          <span className={`rounded-full border px-2 py-0.5 text-4xs font-bold uppercase tracking-wider ${statusStyles[status]}`}>
            {status}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="space-y-3 pl-6 border-l border-zinc-900/80 ml-2">
          {input && (
            <div className="text-3xs leading-relaxed text-zinc-400 bg-zinc-950/80 p-2.5 rounded border border-zinc-900/60 font-mono">
              <span className="text-zinc-600 font-bold block uppercase tracking-wider mb-1">Input Summary</span>
              {input}
            </div>
          )}
          {output && (
            <div className="text-3xs leading-relaxed text-zinc-300 bg-zinc-950/80 p-2.5 rounded border border-zinc-900/60 font-mono">
              <span className="text-zinc-500 font-bold block uppercase tracking-wider mb-1">Output Summary</span>
              {output}
            </div>
          )}
          {children && <div className="space-y-4 pt-2">{children}</div>}
        </div>
      )}
    </div>
  );
}

export default function TracesPage() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTraces = () => {
    const workflowId = localStorage.getItem('active_workflow_id');
    const url = workflowId ? `/api/traces?workflowId=${workflowId}` : '/api/traces';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setTraces(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTraces();
    const interval = setInterval(fetchTraces, 2000);
    return () => clearInterval(interval);
  }, []);

  // Compute node statuses and metrics based on actual logs presence
  const hasTrace = (phrase: string) => traces.some(t => t.message.toLowerCase().includes(phrase.toLowerCase()));
  const getTraceObj = (phrase: string) => traces.find(t => t.message.toLowerCase().includes(phrase.toLowerCase()) || (t.sponsorUsed && t.sponsorUsed.toLowerCase().includes(phrase.toLowerCase())));

  const ceoStatus = hasTrace('aborted') ? 'failed' : hasTrace('strategy deck') ? 'completed' : hasTrace('accept') ? 'completed' : 'queued';
  const resStatus = hasTrace('competitor') ? 'completed' : hasTrace('research') ? 'running' : 'queued';
  const evStatus = hasTrace('citations') ? 'completed' : hasTrace('validate') ? 'running' : 'queued';
  const prodStatus = hasTrace('roadmap') ? 'completed' : hasTrace('spec') ? 'running' : 'queued';
  const prosStatus = hasTrace('enriched') ? 'completed' : hasTrace('leads') ? 'running' : 'queued';
  const gtmStatus = hasTrace('templates') ? 'completed' : hasTrace('campaign') ? 'running' : 'queued';
  const govStatus = hasTrace('approval verified') ? 'completed' : (hasTrace('paused') ? 'paused' : 'queued');
  const kylonStatus = hasTrace('report') ? 'completed' : (hasTrace('approval verified') ? 'running' : 'queued');
  const evalStatus = hasTrace('report') ? 'completed' : (hasTrace('report') ? 'running' : 'queued');

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
          <Activity className="h-3.5 w-3.5 animate-pulse" />
          <span>Execution Telemetry Traces</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Hierarchical Traces</h1>
        <p className="text-zinc-500 text-xs mt-1">
          Granular outline view displaying agent execution hierarchy and sponsor middleware bindings.
        </p>
      </div>

      <div className="space-y-6">
        {/* CEO Root Node */}
        <TraceNode
          title="Aries"
          agentRole="CEO Orchestrator"
          sponsor="HydraDB"
          mode="mock"
          latency="120ms"
          input="Goal: Build B2B SaaS restaurant food waste platform (WasteLess AI)"
          output="Successfully spawned specialized specialist agents to handle research and speculation details"
          status={ceoStatus}
        >
          {/* Research Subtree */}
          <TraceNode
            title="Curio"
            agentRole="Research Agent"
            status={resStatus}
            input="Search query parameters: restaurant food waste competitors"
          >
            <TraceNode
              title="Tavily Search API"
              sponsor="Tavily"
              mode="mock"
              latency="650ms"
              output="Found competitors (Winnow, Leanpath) targeting hotel clients. Mapped restaurant niche."
              status={resStatus}
            />
            <TraceNode
              title="You.com Validation"
              sponsor="You.com"
              mode="mock"
              latency="420ms"
              output="Validated 86% of independent diner owners concerned with waste."
              status={evStatus}
            />
          </TraceNode>

          {/* Product spec node */}
          <TraceNode
            title="Vulcan"
            agentRole="Product Agent"
            sponsor="Nebius"
            mode="mock"
            latency="1100ms"
            input="Competitor matrix details"
            output="MVP features outline: waste logging photos checker, POS supplier REST order sync."
            status={prodStatus}
          />

          {/* Prospecting Node */}
          <TraceNode
            title="Scout"
            agentRole="Prospecting Agent"
            status={prosStatus}
          >
            <TraceNode
              title="Nimble Enrichment"
              sponsor="Nimble"
              mode="mock"
              latency="900ms"
              input="SF Bay Area target restaurant locations"
              output="Extracted 5 restaurant groups details (Maria Alvarez, Giovanni Rossi, Sarah Jenkins)"
              status={prosStatus}
            />
          </TraceNode>

          {/* GTM copywriting node */}
          <TraceNode
            title="Calypso"
            agentRole="GTM / Outreach"
            sponsor="RocketRide"
            mode="mock"
            latency="780ms"
            input="5 prospects contact details"
            output="Campaign outline: 3 step sequence personalized cold email drafts"
            status={gtmStatus}
          />

          {/* Governance / Approval Node */}
          <TraceNode
            title="Themis"
            agentRole="Governance Agent"
            status={govStatus}
          >
            <TraceNode
              title="Human Approval Inbox Gate"
              sponsor="Local Approval"
              mode="live"
              latency="Pending decision"
              input="Outbound campaign template payload details"
              output={govStatus === 'completed' ? 'Human approval verified. Dispatched outflow campaign.' : 'Inbox gate pending manual confirmation'}
              status={govStatus}
            />
          </TraceNode>

          {/* Local GTM Dispatch Node */}
          {hasTrace('approval verified') && (
            <TraceNode
              title="Campaign Outbound Delivery"
              sponsor="Local Dispatch"
              mode="live"
              latency="600ms"
              input="Outbound campaign dispatch trigger"
              output="Execution Completed: Email delivery templates queued for dispatch."
              status={kylonStatus}
            />
          )}

          {/* Local Evaluator Node */}
          {hasTrace('consensus') && (
            <TraceNode
              title="Critique"
              agentRole="Evaluator Agent"
              sponsor="Local Assessment"
              mode="live"
              latency="320ms"
              input="Workflow state execution traces array"
              output="Verification scorecard: 88/100 alignment score compiled."
              status={evalStatus}
            />
          )}
        </TraceNode>
      </div>
    </div>
  );
}
