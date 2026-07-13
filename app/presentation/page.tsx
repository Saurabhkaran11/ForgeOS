'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Cpu, Users, Layers, ShieldCheck, Sparkles, FileText, X, Maximize2 } from 'lucide-react';

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
      title: 'Moving Beyond Chatbots',
      subtitle: 'Not a chatbot — an operating AI workforce',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-[280px]">
          {/* Text block */}
          <div className="space-y-4">
            <span className="text-3xs uppercase tracking-widest font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded inline-block">ForgeOS Autonomy</span>
            <h3 className="text-base font-bold text-white">Coordinated Agent Workforces</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Instead of manually prompting chatbots, copy-pasting results, and designing GTM campaigns by hand, ForgeOS instantiates a team of coordinates agents that manage the research, product PM specs, and outreach flows automatically.
            </p>
            <div className="text-3xs font-mono text-indigo-400 font-bold flex items-center gap-1.5 mt-2">
              <span>✓ Fully automated workforce execution</span>
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
      speakerNotes: 'Every AI product today is another chatbot. But founders don\'t need a bot to chat with—they need an operating workforce. ForgeOS changes that by turning goals into autonomous pipelines.',
    },
    {
      title: 'Coordinated Agent Workforces',
      subtitle: '6 specialized agents collaborating via HydraDB shared context',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[280px] overflow-y-auto pr-1">
          {[
            { role: 'CEO Orchestrator', agent: 'Aries', desc: 'Directs specialists & compiles reports' },
            { role: 'Market Researcher', agent: 'Curio', desc: 'Discovers competitors via Tavily' },
            { role: 'Evidence Validator', agent: 'Verifier', desc: 'Validates citations via You.com' },
            { role: 'Product Manager', agent: 'Vulcan', desc: 'Generates MVP feature specs' },
            { role: 'Lead Prospector', agent: 'Scout', desc: 'Scrapes restaurant leads via Nimble' },
            { role: 'GTM Copywriter', agent: 'Calypso', desc: 'Drafts outreach sales copy' },
          ].map((a) => (
            <div key={a.role} className="border border-zinc-900 bg-zinc-950 p-4 rounded-xl space-y-1.5">
              <span className="text-[10px] text-zinc-500 font-mono block">{a.role}</span>
              <h4 className="text-xs font-bold text-white">{a.agent}</h4>
              <p className="text-[10px] text-zinc-400 leading-normal font-normal">{a.desc}</p>
            </div>
          ))}
        </div>
      ),
      speakerNotes: 'Instead of one generic model, we spawn a coordinated team of six specialist agents. They pass structured outputs and state parameter contexts down the workflow sequentially.',
    },
    {
      title: 'Live Ecosystem Integrations',
      subtitle: 'Running on real APIs for production intelligence',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[280px] items-center">
          {[
            { name: 'Nebius', role: 'Primary inference', status: 'Live' },
            { name: 'Tavily', role: 'Competitor scans', status: 'Live' },
            { name: 'You.com', role: 'Citation checks', status: 'Live' },
            { name: 'Nimble', role: 'Scrapes contacts', status: 'Live' },
            { name: 'InsForge', role: 'Cluster sandboxes', status: 'Live' },
            { name: 'HydraDB', role: 'Context memory', status: 'Live' },
            { name: 'RocketRide', role: 'Task runners', status: 'Live' },
            { name: 'Local Store', role: 'Safety compliance', status: 'Live' },
          ].map((s) => (
            <div key={s.name} className="border border-zinc-900 bg-zinc-950/60 p-4 rounded-xl text-center space-y-1">
              <span className="text-3xs uppercase tracking-wider text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {s.status}
              </span>
              <h4 className="text-xs font-extrabold text-white mt-2">{s.name}</h4>
              <p className="text-[9px] text-zinc-500 font-medium leading-tight">{s.role}</p>
            </div>
          ))}
        </div>
      ),
      speakerNotes: 'This is fully connected. We perform live Web research on Tavily, factcheck claims on You.com, harvest leads from Nimble, and run model instructions using Nebius Llama 3.3.',
    },
    {
      title: 'Outlining the Outcomes',
      subtitle: 'Complete 20-point strategic investor deliverables',
      content: (
        <div className="border border-zinc-900 bg-zinc-950 p-6 rounded-2xl flex flex-col justify-between h-[280px]">
          <div className="space-y-4">
            <span className="text-3xs uppercase tracking-widest font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">Venture Output</span>
            <h3 className="text-sm font-bold text-white">The Investor Strategy Memo</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              A comprehensive, exportable strategic outline containing executive summaries, competitor matrices, technical architecture mappings, next steps, and validated citations.
            </p>
          </div>
          <div className="flex gap-4 items-center border-t border-zinc-900 pt-4">
            <div className="flex items-center gap-2 text-3xs font-mono text-zinc-400">
              <FileText className="h-4 w-4 text-zinc-500" />
              <span>20 Strategic Checkpoints</span>
            </div>
            <div className="flex items-center gap-2 text-3xs font-mono text-zinc-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Admin Approved Campaign Logs</span>
            </div>
          </div>
        </div>
      ),
      speakerNotes: 'The final deliverable is an investor-ready strategy memo covering all 20 key parameters. The founder gets a fully researched venture roadmap and campaign setup in two minutes.',
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
