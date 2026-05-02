import clsx from 'clsx'
import type { Plot } from '../types/game'

interface PlotCardProps {
  plot: Plot
  selected: boolean
  onSelect: () => void
}

const statusLabels: Record<Plot['status'], string> = {
  idle: 'Idle',
  watering: 'Watering',
  scanning: 'Scanning',
  harvesting: 'Harvesting',
  pest_control: 'Pest control',
}

const statusClasses: Record<Plot['status'], string> = {
  idle: 'border-slate-600/60 bg-slate-800/70 text-slate-300',
  watering: 'border-cyan-300/30 bg-cyan-400/10 text-cyan-100',
  scanning: 'border-sky-300/30 bg-sky-400/10 text-sky-100',
  harvesting: 'border-lime-300/30 bg-lime-400/10 text-lime-100',
  pest_control: 'border-amber-300/30 bg-amber-400/10 text-amber-100',
}

function ProgressBar({ value, tone }: { value: number; tone: string }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
      <div className={clsx('h-full rounded-full', tone)} style={{ width: `${Math.round(value)}%` }} />
    </div>
  )
}

export function PlotCard({ plot, selected, onSelect }: PlotCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        'min-h-[164px] rounded-lg border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-300/40',
        selected
          ? 'border-cyan-300/60 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.14)]'
          : 'border-emerald-300/10 bg-slate-950/70 hover:border-emerald-300/30 hover:bg-slate-900/80',
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <div className="text-base font-semibold text-white">{plot.name}</div>
          <div className="text-xs text-slate-500">{plot.cropType}</div>
        </div>
        <span className={clsx('rounded border px-2 py-1 text-[11px]', statusClasses[plot.status])}>
          {statusLabels[plot.status]}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-xs text-slate-400">
            <span>Growth</span>
            <span>{Math.round(plot.growth)}%</span>
          </div>
          <ProgressBar value={plot.growth} tone="bg-lime-300" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs text-slate-400">
            <span>Health</span>
            <span>{Math.round(plot.cropHealth)}%</span>
          </div>
          <ProgressBar value={plot.cropHealth} tone="bg-emerald-300" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs text-slate-400">
            <span>Moisture</span>
            <span>{Math.round(plot.moisture)}%</span>
          </div>
          <ProgressBar value={plot.moisture} tone="bg-cyan-300" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs text-slate-400">
            <span>Pest</span>
            <span>{Math.round(plot.pestLevel)}%</span>
          </div>
          <ProgressBar value={plot.pestLevel} tone="bg-amber-300" />
        </div>
      </div>
    </button>
  )
}
