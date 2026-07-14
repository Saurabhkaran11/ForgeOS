'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Activity, 
  FileText, 
  Cpu, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Database,
  CheckCircle,
  HelpCircle,
  Code
} from 'lucide-react';
import { MetricCard } from '@/components/metric-card';
import { AgentCard } from '@/components/agent-card';
import { TaskTimeline } from '@/components/task-timeline';
import { demoCompany, demoAgents, demoTasks, demoProspects } from '@/lib/demo-data';
import { WorkflowState } from '@/lib/runtime/workflow-store';

export default function DashboardPage() {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [workflow, setWorkflow] = useState<WorkflowState | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Poll workflow status
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        setIsDemoMode(data.isDemoMode);
      })
      .catch(() => {});

    const workflowId = localStorage.getItem('active_workflow_id');
    if (!workflowId) {
      setLoading(false);
      return;
    }

    const fetchWorkflow = async () => {
      try {
        const response = await fetch(`/api/workflows/${workflowId}`);
        if (response.ok) {
          const data = await response.json();
          setWorkflow(data);
        }
      } catch (err) {
        console.error('Error fetching workflow:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflow();
    const interval = setInterval(fetchWorkflow, 2000);

    return () => clearInterval(interval);
  }, []);

  // Timer simulation for running workflows
  useEffect(() => {
    if (workflow?.status === 'running') {
      const timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [workflow?.status]);

  // Compute values based on whether a workflow exists or fall back to demo data
  const name = workflow ? workflow.name : demoCompany.name;
  const goal = workflow ? workflow.goal : demoCompany.goal;
  const readinessScore = workflow ? workflow.readinessScore : demoCompany.readinessScore;
  const hoursSaved = workflow ? workflow.estimatedHoursSaved : demoCompany.estimatedHoursSaved;
  const cost = workflow ? workflow.executionCost : demoCompany.executionCost;
  
  const agents = workflow ? workflow.agents : demoAgents;
  const tasks = workflow ? workflow.tasks : demoTasks;
  const prospects = workflow ? workflow.prospects : demoProspects;
  const isPausedForApproval = workflow?.status === 'paused';

  const getParsedTaskOutput = (taskId: string) => {
    const task = workflow?.tasks.find(t => t.id === taskId);
    if (task && task.output) {
      try {
        return JSON.parse(task.output);
      } catch (e) {
        return { summary: task.output, output: {} };
      }
    }
    return null;
  };

  const resParsed = getParsedTaskOutput('task-res-2');
  const prodParsed = getParsedTaskOutput('task-prod-4');

  const hydraContext = {
    mission: goal,
    marketSummary: resParsed 
      ? `Found competitors: ${(resParsed.output?.competitors || []).join(', ')}. ${resParsed.output?.differentiation || resParsed.summary}`
      : 'Awaiting Research Agent...',
    ICP: prodParsed
      ? (prodParsed.output?.idealCustomerProfile || prodParsed.summary)
      : 'Awaiting Product Agent...',
    productStrategy: prodParsed
      ? (prodParsed.output?.features || []).join(', ')
      : 'Awaiting Product Agent...',
    prospectsCount: prospects.length,
    approvalState: workflow?.status === 'paused' ? 'Gated (Action Required)' : workflow?.status === 'completed' ? 'Approved & Dispatched' : 'Idle/Pending',
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Pending Approval Alert Banner */}
      {isPausedForApproval && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-start sm:items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Human Approval Inbox Gate Triggered</p>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">
                Outbound cold email copywriting campaigns are generated but locked until verified by an administrator.
              </p>
            </div>
          </div>
          <Link
            href="/approvals"
            className="self-start sm:self-auto inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-3xs font-bold text-zinc-950 px-3.5 transition-all"
          >
            Review Approvals
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Mission Control Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">{name}</h1>
          <p className="text-zinc-500 text-xs mt-1 max-w-2xl leading-relaxed">
            {goal}
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap gap-3 items-center">
          {workflow?.status === 'running' && (
            <div className="rounded-full border border-indigo-500/30 bg-indigo-500/5 px-3.5 py-1 text-2xs font-extrabold text-indigo-400 font-mono">
              Elapsed: {elapsedSeconds}s
            </div>
          )}
          {workflow && (
            <div className="rounded-full border border-zinc-800 bg-zinc-900 px-3.5 py-1 text-2xs font-extrabold uppercase text-zinc-300">
              State: {workflow.status}
            </div>
          )}
          {isDemoMode && (
            <div className="rounded-full border border-amber-500/30 bg-amber-500/5 px-3 py-1 text-2xs font-extrabold uppercase tracking-wider text-amber-400">
              Demo Mode Active
            </div>
          )}
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Company Readiness"
          value={`${readinessScore}%`}
          subtext="CEO, Product, Research ready"
          icon={<TrendingUp className="h-5 w-5 text-indigo-400" />}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Hours Saved"
          value={`${hoursSaved} hrs`}
          subtext="Across active agent runs"
          icon={<Clock className="h-5 w-5 text-emerald-400" />}
          trend={{ value: 24, isPositive: true }}
        />
        <MetricCard
          title="Execution Cost"
          value={`$${cost.toFixed(2)}`}
          subtext="Inference + scraping APIs"
          icon={<DollarSign className="h-5 w-5 text-zinc-400" />}
        />
        <MetricCard
          title="Prospect Leads"
          value={prospects.length}
          subtext="Discovered via Nimble"
          icon={<Users className="h-5 w-5 text-purple-400" />}
        />
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Agents & Prospects) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: AI Employees */}
          <section id="employees" className="scroll-mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white">AI Employees</h2>
                <p className="text-zinc-500 text-2xs mt-0.5">Specialized autonomous entities running on Llama 70B</p>
              </div>
              <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-3xs font-mono text-zinc-400">
                {agents.length} Active
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent as any} />
              ))}
            </div>
          </section>

          {/* Section: Evidence (Prospects Discovered) */}
          <section id="prospects" className="scroll-mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white">Evidence: Prospect leads</h2>
                <p className="text-zinc-500 text-2xs mt-0.5">Target lists discovered by Prospecting Agent using Nimble</p>
              </div>
              <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-3xs font-mono text-zinc-400">
                {prospects.length} Discovered
              </span>
            </div>

            <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-950 text-zinc-400 font-semibold">
                      <th className="p-4">Restaurant</th>
                      <th className="p-4">Owner / Contact</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Estimated Waste Risk</th>
                      <th className="p-4 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {prospects.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-600 font-medium">
                          No prospects scraped yet. Awaiting Prospecting Agent execution...
                        </td>
                      </tr>
                    ) : (
                      prospects.map((prospect, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="p-4 font-bold text-white">{prospect.name}</td>
                          <td className="p-4">
                            <div className="font-medium text-zinc-300">{prospect.owner}</div>
                            <div className="text-3xs text-zinc-500">{prospect.email}</div>
                          </td>
                          <td className="p-4 text-zinc-400">{prospect.location}</td>
                          <td className="p-4 text-amber-400 font-medium">{prospect.wasteProblem}</td>
                          <td className="p-4 text-right">
                            <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-3xs font-semibold text-emerald-400">
                              {prospect.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section: Evaluator Agent Scorecard & Warnings */}
          {workflow?.status === 'completed' && (
            <section className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-white">Venture Safety Assessment</h2>
                  <p className="text-zinc-500 text-2xs mt-0.5">Venture alignment scorecard and latency audits</p>
                </div>
                <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-3xs font-extrabold text-emerald-400">
                  Passed (88/100)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Scorecard */}
                <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-5 space-y-3">
                  <span className="text-3xs uppercase tracking-widest font-extrabold text-zinc-500 block">Assessment Matrix</span>
                  <div className="space-y-2 text-2xs">
                    {[
                      { name: 'Problem Clarity', score: 92 },
                      { name: 'Market Evidence', score: 85 },
                      { name: 'Product Differentiation', score: 90 },
                      { name: 'Technical Feasibility', score: 80 },
                      { name: 'GTM Readiness', score: 88 },
                      { name: 'Citation Coverage', score: 95 },
                    ].map((m) => (
                      <div key={m.name} className="flex justify-between items-center">
                        <span className="text-zinc-400">{m.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${m.score}%` }} />
                          </div>
                          <span className="font-mono text-zinc-300 font-bold w-6 text-right">{m.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warnings / Improvement Opportunities */}
                <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-5 space-y-3.5">
                  <span className="text-3xs uppercase tracking-widest font-extrabold text-zinc-500 block text-amber-500">Credibility Audits (2 Warnings)</span>
                  <div className="space-y-3 text-2xs">
                    <div className="border border-amber-500/10 bg-amber-500/5 p-3 rounded-lg flex items-start gap-2.5">
                      <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-zinc-200 block">Simulated POS Sync APIs</strong>
                        <p className="text-zinc-400 mt-1 leading-normal font-normal">Direct Toast/Square REST connectors are currently mocked. Integration needs partner certification audits before deployment.</p>
                      </div>
                    </div>
                    <div className="border border-amber-500/10 bg-amber-500/5 p-3 rounded-lg flex items-start gap-2.5">
                      <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-zinc-200 block">Limited Prospect Enrichment</strong>
                        <p className="text-zinc-400 mt-1 leading-normal font-normal">The list extracted from Nimble is limited to 5 SF Bay Area records. Broadening scraper location query parameters is advised.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Column (HydraDB Context, Sponsor Usage Panel & Activity Timeline) */}
        <div className="space-y-8">
          
          {/* Panel: HydraDB Shared Context */}
          <section className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Database className="h-4.5 w-4.5 text-indigo-400" />
              <div>
                <h2 className="text-sm font-bold text-white">HydraDB Shared Context</h2>
                <p className="text-zinc-500 text-[10px] mt-0.5">Live workspace parameters synchronized across models</p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-3xs leading-relaxed">
              <div className="rounded bg-zinc-900/40 p-2.5 border border-zinc-900/80">
                <span className="text-zinc-500 uppercase block mb-1">Target Mission</span>
                <span className="text-zinc-300">{hydraContext.mission}</span>
              </div>
              <div className="rounded bg-zinc-900/40 p-2.5 border border-zinc-900/80">
                <span className="text-zinc-500 uppercase block mb-1">Market Discovery Summary</span>
                <span className="text-zinc-300">{hydraContext.marketSummary}</span>
              </div>
              <div className="rounded bg-zinc-900/40 p-2.5 border border-zinc-900/80">
                <span className="text-zinc-500 uppercase block mb-1">Ideal Customer Profile</span>
                <span className="text-zinc-300">{hydraContext.ICP}</span>
              </div>
              <div className="rounded bg-zinc-900/40 p-2.5 border border-zinc-900/80">
                <span className="text-zinc-500 uppercase block mb-1">MVP Product Strategy</span>
                <span className="text-zinc-300">{hydraContext.productStrategy}</span>
              </div>
              <div className="flex justify-between items-center rounded bg-zinc-900/40 p-2.5 border border-zinc-900/80">
                <span className="text-zinc-500 uppercase">Leads Cached</span>
                <span className="text-white font-bold">{hydraContext.prospectsCount} accounts</span>
              </div>
              <div className="flex justify-between items-center rounded bg-zinc-900/40 p-2.5 border border-zinc-900/80">
                <span className="text-zinc-500 uppercase">Approval State</span>
                <span className={`font-bold ${workflow?.status === 'paused' ? 'text-amber-400' : workflow?.status === 'completed' ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  {hydraContext.approvalState}
                </span>
              </div>
            </div>
          </section>

          {/* Panel: Sponsor Usage Dashboard */}
          <section className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Cpu className="h-4.5 w-4.5 text-purple-400" />
              <div>
                <h2 className="text-sm font-bold text-white">Sponsor Integration Panel</h2>
                <p className="text-zinc-500 text-[10px] mt-0.5">Sponsor API triggers mapped to agent routines</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Tavily', desc: 'Market research query checks', isConfig: !isDemoMode },
                { name: 'You.com', desc: 'Validated research citations', isConfig: !isDemoMode },
                { name: 'Nimble', desc: 'Enriched restaurant leads list', isConfig: !isDemoMode },
                { name: 'HydraDB', desc: 'Synchronized cross-agent memory state', isConfig: !isDemoMode },
                { name: 'RocketRide', desc: 'Outreach outbound dispatcher pipelines', isConfig: !isDemoMode },
                { name: 'Nebius', desc: 'Model inference completion routing', isConfig: !isDemoMode },
                { name: 'InsForge', desc: 'Container sandbox environments provisioned', isConfig: !isDemoMode },
              ].map((s) => (
                <div key={s.name} className="flex justify-between items-center text-xs border border-zinc-900 bg-zinc-950 p-2.5 rounded-lg">
                  <div>
                    <span className="font-bold text-zinc-200 block">{s.name}</span>
                    <span className="text-[10px] text-zinc-500 leading-normal block mt-0.5">{s.desc}</span>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-4xs font-semibold uppercase tracking-wider shrink-0 ${s.isConfig ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {s.isConfig ? 'Live' : 'Mock'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity Timeline */}
          <section className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Execution Timeline</h2>
              <p className="text-zinc-500 text-3xs mt-0.5">Real-time state and task transition updates</p>
            </div>
            
            <TaskTimeline tasks={tasks as any} />
          </section>
        </div>

      </div>
    </div>
  );
}
