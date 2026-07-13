import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function MetricCard({ title, value, subtext, icon, trend, className = '' }: MetricCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur-md transition-all duration-350 hover:-translate-y-0.5 hover:border-zinc-700/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] ${className}`}>
      {/* Background radial glow */}
      <div className="absolute -right-10 -top-10 -z-10 h-28 w-28 rounded-full bg-indigo-500/5 blur-2xl" />
      
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</span>
        {icon && <div className="text-zinc-500">{icon}</div>}
      </div>
      
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
        {trend && (
          <span className={`inline-flex items-center text-xs font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.isPositive ? '▲' : '▼'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      
      {subtext && (
        <p className="mt-1 text-xs text-zinc-500">{subtext}</p>
      )}
    </div>
  );
}
