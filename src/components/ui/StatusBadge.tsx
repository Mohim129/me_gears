import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const normalized = status.trim().toLowerCase();

  let styles = 'bg-surface-container text-on-surface';

  if (normalized === 'delivered' || normalized === 'in stock') {
    styles = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/20';
  } else if (normalized === 'shipped') {
    styles = 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-200/20';
  } else if (normalized === 'confirmed') {
    styles = 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200/20';
  } else if (normalized === 'pending' || normalized === 'low stock') {
    styles = 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/20';
  } else if (normalized === 'cancelled' || normalized === 'out of stock') {
    styles = 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/20';
  } else if (normalized === 'processing') {
    styles = 'bg-orange-100 text-orange-800 dark:bg-orange-950/30 dark:text-orange-400 border border-orange-200/20';
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-label-bold tracking-wide transition-all ${styles} ${className}`}
    >
      {status}
    </span>
  );
}
