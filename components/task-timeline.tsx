import React from 'react';
import { Task } from '../lib/types';

interface TaskTimelineProps {
  tasks: Task[];
}

export function TaskTimeline({ tasks }: TaskTimelineProps) {
  const statusConfig = {
    pending: { color: 'bg-zinc-800 text-zinc-500 border-zinc-700', label: 'Queued' },
    in_progress: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse', label: 'Processing' },
    completed: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Success' },
    failed: { color: 'bg-rose-500/10 text-rose-400 border-rose-500/30', label: 'Failed' },
  };

  return (
    <div className="relative border-l border-zinc-800 ml-4 pl-6 space-y-6">
      {tasks.map((task, idx) => {
        const config = statusConfig[task.status];
        return (
          <div key={task.id} className="relative group">
            {/* Timeline Dot Indicator */}
            <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-950 border border-zinc-800 group-hover:border-zinc-500 transition-colors">
              <span className={`h-1.5 w-1.5 rounded-full ${task.status === 'in_progress' ? 'bg-amber-500 animate-ping' : task.status === 'completed' ? 'bg-emerald-500' : task.status === 'failed' ? 'bg-rose-500' : 'bg-zinc-700'}`} />
            </span>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-300">{task.agentName}</span>
                  <span className={`rounded px-1.5 py-0.5 text-3xs font-semibold uppercase tracking-wider border ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <span className="text-3xs text-zinc-500 font-mono">{task.timestamp}</span>
              </div>

              <p className="text-xs text-zinc-400 font-normal leading-relaxed">{task.description}</p>
              
              {task.output && (
                <div className="mt-2 rounded bg-zinc-950/80 border border-zinc-900 p-3 text-xs text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap">
                  <span className="text-zinc-500 text-3xs uppercase tracking-wider block mb-1">Execution Output</span>
                  {task.output}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
