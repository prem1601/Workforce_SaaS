import type { LucideIcon } from 'lucide-react';
import { cn } from '../utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-card)]', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {description && <p className="text-xs text-muted">{description}</p>}
          {trend && (
            <p className={cn('text-xs font-medium', trend.positive ? 'text-emerald-600' : 'text-red-600')}>
              {trend.value}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-primary-50 p-2.5">
          <Icon className="h-5 w-5 text-primary-600" />
        </div>
      </div>
    </div>
  );
}
