'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, Sparkles, Server, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { demoCompany } from '@/lib/demo-data';

export default function LaunchPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchStep, setLaunchStep] = useState(0);

  const steps = [
    'Initializing HydraDB context space...',
    'Provisioning InsForge execution container sandbox...',
    'Spawning Aries (CEO Agent) to coordinate workflow...',
    'Mapping Tavily / You.com research search filters...',
    'Verifying Nimble API endpoint bindings for prospecting...',
    'Registering dynamic evaluation metrics hooks...',
    'Starting GTM orchestration engine...',
  ];

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLaunching(true);
    setLaunchStep(0);

    try {
      const response = await fetch('/api/workflows/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, goal }),
      });

      if (!response.ok) {
        throw new Error('Launch failed');
      }

      const workflow = await response.json();
      localStorage.setItem('active_workflow_id', workflow.id);

      // Simulate launch progression UI
      const interval = setInterval(() => {
        setLaunchStep((prev) => {
          if (prev >= steps.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              router.push('/dashboard');
            }, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 700);

    } catch (err: any) {
      alert(`Launch error: ${err.message}`);
      setIsLaunching(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden bg-zinc-950">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-500/5 blur-[120px]" />

      <div className="max-w-xl w-full">
        {!isLaunching ? (
          <div className="border border-zinc-800 bg-zinc-900/40 backdrop-blur-md rounded-2xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Create your AI Company</h1>
                  <p className="text-xs text-zinc-500">Provide the seed ideas to generate your automated venture.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setName(demoCompany.name);
                  setGoal(demoCompany.goal);
                }}
                className="text-3xs uppercase font-extrabold tracking-widest text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded"
              >
                Preload Demo
              </button>
            </div>

            <form onSubmit={handleLaunch} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Company Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. WasteLess AI"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Primary Business Goal</label>
                <textarea
                  rows={4}
                  required
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Describe what your startup should do..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none transition-colors leading-relaxed resize-none"
                />
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/20 p-4 flex gap-3 text-xs text-zinc-400">
                <Sparkles className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  ForgeOS will automatically initialize 8 specialized AI agents running on <strong className="text-zinc-200">Nebius Llama-3.1-70B</strong> to construct research plans, GTM campaigns, prospect lists, and a full strategy.
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition-all hover:bg-indigo-500 active:scale-98"
              >
                Launch Company Instance
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="border border-zinc-800 bg-zinc-900/40 backdrop-blur-md rounded-2xl p-8 text-center shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mx-auto mb-6" />
            <h2 className="text-lg font-bold text-white mb-2">Deploying ForgeOS Instance</h2>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-8">
              Setting up agent roles, database vectors, and sandboxes...
            </p>

            <div className="space-y-3.5 text-left max-w-md mx-auto">
              {steps.map((step, idx) => {
                const isDone = idx < launchStep;
                const isCurrent = idx === launchStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                      isDone || isCurrent ? 'opacity-100' : 'opacity-25'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4.5 w-4.5 text-indigo-400 animate-spin shrink-0" />
                    ) : (
                      <Server className="h-4.5 w-4.5 text-zinc-700 shrink-0" />
                    )}
                    <span className={isDone ? 'text-zinc-400 line-through' : isCurrent ? 'text-indigo-300 font-medium' : 'text-zinc-600'}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
