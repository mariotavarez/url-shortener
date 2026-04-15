import { formatNumber } from '@/lib/utils';
import clsx from 'clsx';
import type { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  color: 'violet' | 'purple' | 'fuchsia';
}

const colorMap = {
  violet: {
    bg: 'bg-violet-500/10',
    icon: 'text-violet-400',
    border: 'border-violet-500/20',
    value: 'text-violet-300',
  },
  purple: {
    bg: 'bg-purple-500/10',
    icon: 'text-purple-400',
    border: 'border-purple-500/20',
    value: 'text-purple-300',
  },
  fuchsia: {
    bg: 'bg-fuchsia-500/10',
    icon: 'text-fuchsia-400',
    border: 'border-fuchsia-500/20',
    value: 'text-fuchsia-300',
  },
};

export function StatsCard({ label, value, icon, color }: StatsCardProps) {
  const c = colorMap[color];

  return (
    <div
      className={clsx(
        'p-5 bg-gray-900 rounded-2xl border',
        c.border
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-400 font-medium">{label}</p>
        <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center', c.bg, c.icon)}>
          {icon}
        </div>
      </div>
      <p className={clsx('text-3xl font-extrabold tracking-tight', c.value)}>
        {formatNumber(value)}
      </p>
    </div>
  );
}
