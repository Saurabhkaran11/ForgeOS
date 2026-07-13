import React from 'react';
import { Agent } from '../lib/types';

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const statusColors = {
    idle: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
    working: 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse',
    waiting: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    failed: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };

  const statusLabels = {
    idle: 'Idle',
    working: 'Executing...',
    waiting: 'Waiting Approval',
    failed: 'Failed',
    completed: 'Finished',
  };

  return (
    <div 
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 p-5 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-950/60 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Agent Avatar */}
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${agent.avatarColor} text-lg font-bold text-white shadow-lg`}>
          {agent.name.charAt(0)}
        </div>

        {/* Agent Core Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-white truncate">{agent.name}</h3>
            <span className={`rounded-full border px-2.5 py-0.5 text-2xs font-semibold ${statusColors[agent.status]}`}>
              {statusLabels[agent.status]}
            </span>
          </div>
          <p className="text-xs text-indigo-400 font-medium mt-0.5">{agent.role} Agent</p>
          <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">{agent.description}</p>
        </div>
      </div>

      {/* Model & Active Task Info */}
      <div className="mt-4 pt-3 border-t border-zinc-900 flex flex-col gap-2">
        <div className="flex items-center justify-between text-2xs text-zinc-500">
          <span>Inference Model</span>
          <span className="font-mono text-zinc-400">{agent.model}</span>
        </div>
        
        {agent.currentTask && (
          <div className="rounded bg-zinc-900/60 p-2 text-2xs">
            <span className="text-zinc-500 font-medium block mb-0.5">Active Task:</span>
            <span className="text-zinc-300 line-clamp-1">{agent.currentTask}</span>
          </div>
        )}
      </div>
    </div>
  );
}
