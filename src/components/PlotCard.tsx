import clsx from 'clsx'
import type { Plot } from '../types/game'

interface PlotCardProps {
  plot: Plot
  selected: boolean
  onSelect: () => void
}

const statusLabels: Record<Plot['status'], string> = {
  idle: 'Listo',
  watering: 'Riego',
  scanning: 'Escaneo',
  harvesting: 'Cosecha',
  pest_control: 'Plaga',
}

const statusClasses: Record<Plot['status'], string> = {
  idle: 'border-slate-200 bg-white text-slate-500',
  watering: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  scanning: 'border-sky-200 bg-sky-50 text-sky-700',
  harvesting: 'border-lime-200 bg-lime-50 text-lime-700',
  pest_control: 'border-amber-200 bg-amber-50 text-amber-700',
}

function ProgressBar({ value, tone }: { value: number; tone: string }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
      <div className={clsx('h-full rounded-full', tone)} style={{ width: `${Math.round(value)}%` }} />
    </div>
  )
}

function MiniMetric({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: string
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[10px] font-bold text-slate-500">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <ProgressBar value={value} tone={tone} />
    </div>
  )
}

export function PlotCard({ plot, selected, onSelect }: PlotCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        'min-h-0 rounded-2xl border p-2.5 text-left transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-300/50',
        selected
          ? 'border-cyan-300 bg-cyan-50 shadow-[0_12px_24px_rgba(6,182,212,0.16)]'
          : 'border-white bg-white/80 hover:border-lime-200 hover:bg-lime-50/70',
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-base font-black text-slate-950">{plot.name}</div>
          <div className="text-[11px] font-medium text-slate-500">Trigo</div>
        </div>
        <span className={clsx('rounded-full border px-2 py-0.5 text-[10px] font-bold', statusClasses[plot.status])}>
          {statusLabels[plot.status]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        <MiniMetric label="Crece" value={plot.growth} tone="bg-lime-400" />
        <MiniMetric label="Salud" value={plot.cropHealth} tone="bg-emerald-400" />
        <MiniMetric label="Agua" value={plot.moisture} tone="bg-cyan-400" />
        <MiniMetric label="Plaga" value={plot.pestLevel} tone="bg-amber-400" />
      </div>
    </button>
  )
}
