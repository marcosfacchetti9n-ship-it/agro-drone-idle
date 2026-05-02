import { Map, Sprout } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { PlotCard } from './PlotCard'

export function FieldGrid() {
  const plots = useGameStore((state) => state.plots)
  const selectedPlotId = useGameStore((state) => state.selectedPlotId)
  const selectPlot = useGameStore((state) => state.selectPlot)
  const selectedPlot = plots.find((plot) => plot.id === selectedPlotId)

  return (
    <section className="panel flex min-h-[520px] flex-col gap-4 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase text-slate-500">Field map</p>
          <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
            <Map className="h-5 w-5 text-emerald-200" aria-hidden="true" />
            Wheat sector grid
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-300/15 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
          <Sprout className="h-4 w-4" aria-hidden="true" />
          Selected: {selectedPlot?.name ?? 'None'}
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {plots.map((plot) => (
          <PlotCard
            key={plot.id}
            plot={plot}
            selected={plot.id === selectedPlotId}
            onSelect={() => selectPlot(plot.id)}
          />
        ))}
      </div>
    </section>
  )
}
