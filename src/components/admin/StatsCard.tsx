import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  alert?: boolean;
}

export default function StatsCard({ icon: Icon, label, value, trend, alert }: StatsCardProps) {
  return (
    <div className="glass-panel rounded-2xl shadow-card p-6 flex items-start gap-4 transition-all hover:shadow-lg">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          alert
            ? 'bg-error/10 text-error'
            : 'bg-secondary/10 text-secondary'
        }`}
      >
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <p className="text-on-surface-variant font-label-bold text-xs uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="font-headline-lg text-[28px] font-bold text-primary leading-tight">
          {value}
        </p>
        {trend && (
          <p className={`text-sm font-label-bold mt-1 ${
            trend.startsWith('+') ? 'text-green-600' : 'text-error'
          }`}>
            {trend} vs last month
          </p>
        )}
      </div>
    </div>
  );
}
