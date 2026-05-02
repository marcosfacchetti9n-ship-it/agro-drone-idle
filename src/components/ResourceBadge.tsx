import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface ResourceBadgeProps {
  icon: LucideIcon
  label: string
  value: string
  tone: 'money' | 'crop' | 'water' | 'energy' | 'data'
}

const toneClasses: Record<ResourceBadgeProps['tone'], string> = {
  money: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  crop: 'border-lime-200 bg-lime-50 text-lime-700',
  water: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  energy: 'border-amber-200 bg-amber-50 text-amber-700',
  data: 'border-sky-200 bg-sky-50 text-sky-700',
}

export function ResourceBadge({ icon: Icon, label, value, tone }: ResourceBadgeProps) {
  return (
    <div
      className={clsx(
        'flex min-w-[104px] items-center gap-2 rounded-2xl border px-2.5 py-1.5',
        toneClasses[tone],
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase text-slate-500">{label}</div>
        <div className="truncate text-sm font-bold text-slate-900">{value}</div>
      </div>
    </div>
  )
}
