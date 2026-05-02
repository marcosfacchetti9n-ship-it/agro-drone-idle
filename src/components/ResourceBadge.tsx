import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface ResourceBadgeProps {
  icon: LucideIcon
  label: string
  value: string
  tone: 'money' | 'crop' | 'water' | 'energy' | 'data'
}

const toneClasses: Record<ResourceBadgeProps['tone'], string> = {
  money: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100',
  crop: 'border-lime-300/20 bg-lime-400/10 text-lime-100',
  water: 'border-cyan-300/20 bg-cyan-400/10 text-cyan-100',
  energy: 'border-amber-300/20 bg-amber-400/10 text-amber-100',
  data: 'border-sky-300/20 bg-sky-400/10 text-sky-100',
}

export function ResourceBadge({ icon: Icon, label, value, tone }: ResourceBadgeProps) {
  return (
    <div
      className={clsx(
        'flex min-w-[128px] items-center gap-2 rounded-lg border px-3 py-2',
        toneClasses[tone],
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <div className="text-[11px] uppercase text-slate-400">{label}</div>
        <div className="truncate text-sm font-semibold text-white">{value}</div>
      </div>
    </div>
  )
}
