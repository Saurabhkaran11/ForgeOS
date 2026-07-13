'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Cpu, Layers, ShieldCheck, Sparkles, FileText, X, Maximize2, AlertTriangle, Hammer, Target } from 'lucide-react';

interface Slide {
  title: string;
  subtitle: string;
  content: React.ReactNode;
  speakerNotes: string;
}

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const slides: Slide[] = [
    {
      title: 'Slide 1 — The Problem',
      subtitle: 'Startup creation is slow, manual, and chatbot-centric',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[280px]">
          {/* Card 1: Chatbot Limits */}
          <div className="border border-zinc-900 bg-zinc-950/60 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-xs font-bold text-white mt-4">The Chatbot Fallacy</h3>
              <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed font-normal">
                Standard LLMs are linear, lack persistent memory, cannot verify their own claims, and cannot perform external tasks automatically.
              </p>
            </div>
            <span className="text-[9px] font-mono text-zinc-600 block">✕ Prompters do the manual work</span>
          </div>

          {/* Card 2: Manual Research */}
          <div className="border border-zinc-900 bg-zinc-950/60 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-xs font-bold text-white mt-4">Manual Context Loops</h3>
              <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed font-normal">
                Founders must manually collect competitor reports, scrape contact databases, and copy-paste outreach pitches between tabs.
              </p>
            </div>
            <span className="text-[9px] font-mono text-zinc-600 block">✕ Spends weeks of human labor</span>
          </div>

          {/* Card 3: Unmanaged Spoilage */}
          <div className="border border-zinc-900 bg-zinc-950/60 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-xs font-bold text-white mt-4">Thin Profit Margins</h3>
              <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed font-normal">
                Independent retail operators regularly lose up to 8% of revenue to inventory wastage because ordering is based on guesswork.
              </p>
            </div>
            <span className="text-[9px] font-mono text-zinc-600 block">✕ Inefficient inventory forecasting</span>
          </div>
        </div>
      ),
      speakerNotes: 'Slide 1 (The Problem): Founders spend weeks on scrappy, manual setup tasks. Legacy AI platforms are just simple text inputs that lack coordinate execution, memory state, or actual verification checks.',
    },
    {
      title: 'Slide 2 — How I Built It',
      subtitle: 'Next.js App Router, local file database, and strict API adapters',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[280px]">
          {/* Card 1: Core System */}
          <div className="border border-zinc-900 bg-zinc-950/60 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Hammer className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-xs font-bold text-white mt-4">Event-Driven Engine</h3>
              <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed font-normal">
                Built with a Next.js App Router workspace, utilizing a local file database (db.json) for persistence and an event-bus orchestrator for coordinate task dispatching.
              </p>
            </div>
            <span className="text-[9px] font-mono text-indigo-400 font-semibold block">TypeScript / NextJS 15+</span>
          </div>

          {/* Card 2: API Adapters */}
          <div className="border border-zinc-900 bg-zinc-950/60 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Cpu className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-xs font-bold text-white mt-4">Sponsor API Middleware</h3>
              <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed font-normal">
                Strict, mock-free API integrations: Nebius (Llama 3.3 model inference), Tavily (real competitor lookup), You.com (live claim citations), and Nimble (contact scraper).
              </p>
            </div>
            <span className="text-[9px] font-mono text-indigo-400 font-semibold block">7 Production Integrations</span>
          </div>

          {/* Card 3: Local Persistence */}
          <div className="border border-zinc-900 bg-zinc-950/60 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Layers className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-xs font-bold text-white mt-4">Fallback Resilience</h3>
              <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed font-normal">
                InsForge, HydraDB, and RocketRide adapters query actual endpoints, with fallback handling for DNS resolution constraints.
              </p>
            </div>
            <span className="text-[9px] font-mono text-indigo-400 font-semibold block">Vitest Integration Verified</span>
          </div>
        </div>
      ),
      speakerNotes: 'Slide 2 (How I Built It): Built on Next.js 15 App Router. I engineered a coordinate event bus that controls task loops. To execute live, I built HTTP adapters mapping Nebius, Tavily, You.com, and Nimble, with unit test suites validating key integrations.',
    },
    {
      title: 'Slide 3 — How I Am Solving It',
      subtitle: 'Coordinated Multi-Agent Workforce & dynamic outcomes',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-[280px]">
          {/* Solution details */}
          <div className="space-y-4">
            <span className="text-3xs uppercase tracking-widest font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded inline-block">The Solution</span>
            <h3 className="text-base font-bold text-white">Coordinated Pipelines</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              A single input spawns a team of 6 coordinate agents that perform dynamic search, PM specification writing, leads prospecting, and campaign copy validation. All actions are gated by human-in-the-loop approvals before delivery.
            </p>
            <div className="text-3xs font-mono text-emerald-400 font-bold flex items-center gap-1.5 mt-2">
              <span>✓ Exports 20-Point Strategic strategy Memo</span>
            </div>
          </div>

          {/* Interactive Image box */}
          <div className="relative group border border-zinc-900 bg-zinc-950 rounded-2xl overflow-hidden h-[240px] cursor-pointer" onClick={() => setIsZoomed(true)}>
            <img 
              src="/coordinated_agents_flow.png" 
              alt="Multi-agent collaboration workflow diagram" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Maximize2 className="h-5 w-5 text-white" />
              <span className="text-xs font-bold text-white">Expand Diagram</span>
            </div>
            <div className="absolute bottom-3 right-3 bg-zinc-900/80 border border-zinc-800 rounded px-2 py-0.5 text-[9px] text-zinc-400 pointer-events-none">
              Click to Zoom
            </div>
          </div>
        </div>
      ),
      speakerNotes: 'Slide 3 (How We Solve It): We solve this by introducing an autonomous workforce. A founder types a goal, agents discover competitors, Vulcan designs features, Scout scrapes contacts, and calypso drafts outbound sequences, outputting a 20-point Strategy Memo.',
    },
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  const active = slides[currentSlide];

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>ForgeOS Pitch Console</span>
        </div>
        <span className="text-3xs font-mono text-zinc-500 font-semibold">
          Slide {currentSlide + 1} of {slides.length}
        </span>
      </div>

      {/* Slide Container */}
      <div className="border border-zinc-900 bg-zinc-950/40 rounded-3xl p-8 space-y-6 relative overflow-hidden min-h-[460px] flex flex-col justify-between">
        
        {/* Slide Title Info */}
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-white">{active.title}</h1>
          <p className="text-zinc-500 text-xs font-normal">{active.subtitle}</p>
        </div>

        {/* Slide Visual Content */}
        <div className="my-auto py-4">
          {active.content}
        </div>

        {/* Navigation Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-zinc-900/60">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
            disabled={currentSlide === 0}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-white transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 w-1.5 rounded-full transition-all ${currentSlide === idx ? 'bg-indigo-500 w-4' : 'bg-zinc-800'}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))}
            disabled={currentSlide === slides.length - 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-white transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Speaker Notes Drawer */}
      <div className="border border-indigo-500/10 bg-indigo-500/5 rounded-2xl p-5 space-y-2">
        <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest font-mono">Speaker Notes / Demo Instructions</span>
        <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-normal">
          {active.speakerNotes}
        </p>
        <span className="text-[10px] text-zinc-500 block font-normal pt-1">
          💡 Tip: Use Left / Right Arrow keys or Spacebar on your keyboard to navigate slides.
        </span>
      </div>

      {/* Click-to-Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <button 
            className="absolute top-6 right-6 text-zinc-400 hover:text-white bg-zinc-900/60 p-2 rounded-full border border-zinc-800"
            onClick={() => setIsZoomed(false)}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-zinc-850 shadow-[0_0_50px_rgba(99,102,241,0.15)]">
            <img 
              src="/coordinated_agents_flow.png" 
              alt="Multi-agent collaboration workflow diagram zoomed" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
