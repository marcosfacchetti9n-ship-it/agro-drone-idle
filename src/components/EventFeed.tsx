import clsx from 'clsx'
import { Activity, BrainCircuit, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import type { EventType } from '../types/game'
import { formatTimestamp } from '../utils/formatters'

const eventStyles: Record<EventType, string> = {
  info: 'border-slate-700/70 bg-slate-950/70 text-slate-300',
  warning: 'border-amber-300/25 bg-amber-400/10 text-amber-100',
  success: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100',
  ai: 'border-cyan-300/20 bg-cyan-400/10 text-cyan-100',
}

const eventIcons: Record<EventType, typeof Info> = {
  info: Info,
  warning: TriangleAlert,
  success: CheckCircle2,
  ai: BrainCircuit,
}

export function EventFeed() {
  const events = useGameStore((state) => state.events)

  return (
    <section className="panel flex max-h-[510px] flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-500">Event feed</p>
          <h2 className="text-xl font-semibold text-white">Recent telemetry</h2>
        </div>
        <Activity className="h-5 w-5 text-emerald-200" aria-hidden="true" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {events.map((event) => {
          const Icon = eventIcons[event.type]
          return (
            <article key={event.id} className={clsx('rounded-lg border p-3', eventStyles[event.type])}>
              <div className="mb-1 flex items-center justify-between gap-2 text-[11px] uppercase text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {event.type}
                </span>
                <time>{formatTimestamp(event.timestamp)}</time>
              </div>
              <p className="text-sm leading-5">{event.message}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
