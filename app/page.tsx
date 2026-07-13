import React from 'react';
import Link from 'next/link';
import { Rocket, ShieldCheck, ArrowRight, Activity, Users, Sparkles, Layers, Cpu, Database } from 'lucide-react';
import { demoCompany } from '@/lib/demo-data';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-zinc-950 p-6 md:p-12">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute bottom-10 right-10 -z-10 h-[300px] w-[300px] rounded-full bg-purple-500/5 blur-[80px]" />

      <div className="max-w-4xl w-full text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/5 px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-8 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>ForgeOS v1.0.0 Alpha</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Build and operate an <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            AI company in minutes.
          </span>
        </h1>

        {/* Not a Chatbot Positioning */}
        <div className="mt-4 text-sm font-semibold tracking-wider text-zinc-500 uppercase">
          Not a chatbot — an operating AI workforce
        </div>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-base md:text-lg text-zinc-400 leading-relaxed">
          ForgeOS converts a business goal into a coordinated team of AI employees that research a market, design a product, discover prospects, prepare outreach campaigns, request human approval, and produce an investor-ready company plan.
        </p>

        {/* CTA Button */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/launch"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-98"
          >
            Launch WasteLess AI Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Sponsor Products Strip */}
        <div className="mt-12 w-full max-w-3xl border-y border-zinc-900 py-6">
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-extrabold block mb-4">Powered by Sponsor Infrastructure</span>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-mono font-semibold text-zinc-500">
            <span>• Nebius</span>
            <span>• Tavily</span>
            <span>• You.com</span>
            <span>• Nimble</span>
            <span>• InsForge</span>
            <span>• HydraDB</span>
            <span>• RocketRide</span>
          </div>
        </div>

        {/* Architecture Flow Tree */}
        <div className="mt-12 w-full max-w-2xl text-left border border-zinc-900 bg-zinc-950/40 backdrop-blur-md rounded-2xl p-6">
          <span className="text-3xs uppercase tracking-widest font-extrabold text-indigo-400 block mb-4">Multi-Agent Collaborative Pipeline Architecture</span>
          
          <div className="space-y-3.5 text-xs font-mono">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              <span><strong>Aries (CEO Orchestrator):</strong> Accept Venture Mission $\rightarrow$ Delegate Tasks</span>
            </div>
            <div className="pl-6 border-l border-zinc-900 ml-1 space-y-3">
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-zinc-600 font-bold">├──</span>
                <span><strong>Curio (Research Agent):</strong> Competitor analysis & market sizing (Tavily / You.com)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-zinc-600 font-bold">├──</span>
                <span><strong>Vulcan (Product Agent):</strong> Feature roadmap & wireframe specifications (Nebius)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-zinc-600 font-bold">├──</span>
                <span><strong>Scout (Prospecting Agent):</strong> Lead harvesting and verification (Nimble)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-zinc-600 font-bold">├──</span>
                <span><strong>Calypso (GTM Outbound):</strong> Outreach copies & campaign design (RocketRide)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-zinc-600 font-bold">├──</span>
                <span><strong>Themis (Governance Agent):</strong> Compliance audit & Human confirmation gate</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-zinc-600 font-bold">└──</span>
                <span><strong>Critique (Evaluator Agent):</strong> Perform consensus latency & accuracy audits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
