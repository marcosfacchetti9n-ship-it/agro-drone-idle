import clsx from 'clsx'
import { Activity, BrainCircuit, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { playSound } from '../services/soundService'
import { useGameStore } from '../store/gameStore'
import type { EventType } from '../types/game'
import { formatTimestamp } from '../utils/formatters'

const eventStyles: Record<EventType, string> = {
  info: 'border-slate-200 bg-white text-slate-600',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  ai: 'border-cyan-200 bg-cyan-50 text-cyan-800',
}

const eventIcons: Record<EventType, typeof Info> = {
  info: Info,
  warning: TriangleAlert,
  success: CheckCircle2,
  ai: BrainCircuit,
}

const eventLabels: Record<EventType, string> = {
  info: 'info',
  warning: 'alerta',
  success: 'logro',
  ai: 'ia',
}

export function EventFeed() {
  const events = useGameStore((state) => state.events)
  const latestEventId = events[0]?.id
  const previousEventId = useRef(latestEventId)

  useEffect(() => {
    if (!latestEventId || previousEventId.current === latestEventId) return

    const latestEvent = events[0]
    if (latestEvent.type === 'warning') playSound('warning')
    else if (latestEvent.type === 'ai') playSound('ai')
    else if (latestEvent.type === 'success') playSound('success')
    else playSound('click')

    previousEventId.current = latestEventId
  }, [events, latestEventId])

  return (
    <section className="panel flex flex-col p-3 xl:col-start-3 xl:row-start-2">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase text-sky-600">Eventos</p>
          <h2 className="text-lg font-black text-slate-950">Bitácora</h2>
        </div>
        <Activity className="h-5 w-5 text-sky-600" aria-hidden="true" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {events.slice(0, 8).map((event) => {
          const Icon = eventIcons[event.type]
          return (
            <article key={event.id} className={clsx('rounded-2xl border px-2.5 py-2', eventStyles[event.type])}>
              <div className="mb-0.5 flex items-center justify-between gap-2 text-[10px] font-bold uppercase text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {eventLabels[event.type]}
                </span>
                <time>{formatTimestamp(event.timestamp)}</time>
              </div>
              <p className="line-clamp-2 text-xs leading-4">{event.message}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
