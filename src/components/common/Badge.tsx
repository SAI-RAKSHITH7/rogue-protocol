import React from 'react';
import { SeverityLevel, IncidentStatus, ProcessingStatus, ApprovalStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'severity' | 'status' | 'outline' | 'neutral';
  severity?: SeverityLevel;
  status?: IncidentStatus | ProcessingStatus | ApprovalStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const SeverityBadge: React.FC<{ severity: SeverityLevel; size?: 'sm' | 'md' }> = ({ severity, size = 'sm' }) => {
  const styles: Record<SeverityLevel, string> = {
    CRITICAL: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    HIGH: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    MEDIUM: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    LOW: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
  };

  const dots: Record<SeverityLevel, string> = {
    CRITICAL: 'bg-rose-400 animate-pulse',
    HIGH: 'bg-orange-400',
    MEDIUM: 'bg-amber-400',
    LOW: 'bg-emerald-400'
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md font-medium tracking-wide ${styles[severity]} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[severity]}`} />
      {severity}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: IncidentStatus | ProcessingStatus | ApprovalStatus; size?: 'sm' | 'md' }> = ({ status, size = 'sm' }) => {
  const styles: Record<string, string> = {
    NEW: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    INVESTIGATING: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    ACTION_REQUIRED: 'bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse',
    CONTAINED: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
    RESOLVED: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    FALSE_POSITIVE: 'bg-slate-700/50 text-slate-400 border border-slate-600/30',
    PENDING: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    APPROVED: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    REJECTED: 'bg-slate-700/50 text-slate-400 border border-slate-600/30',
    PROCESSED: 'bg-slate-800 text-slate-300 border border-slate-700',
    CORRELATED: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm font-medium';

  return (
    <span className={`inline-flex items-center rounded-md font-mono ${styles[status] || 'bg-slate-800 text-slate-400 border border-slate-700'} ${sizeClasses}`}>
      {status.replace('_', ' ')}
    </span>
  );
};
