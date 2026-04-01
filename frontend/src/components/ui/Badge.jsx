import React from 'react';

const severityStyles = {
  high: 'bg-red-500/15 text-red-400 border-red-500/30',
  medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  low: 'bg-green-500/15 text-green-400 border-green-500/30',
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  active: 'bg-green-500/15 text-green-400 border-green-500/30',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  closed: 'bg-white/10 text-white/50 border-white/20',
  gold: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
};

export default function Badge({ children, variant = 'info', pulse = false, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 
        rounded-full text-xs font-bold uppercase tracking-wider
        border ${severityStyles[variant] || severityStyles.info}
        ${className}
      `}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
