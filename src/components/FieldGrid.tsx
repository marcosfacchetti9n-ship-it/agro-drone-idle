import { Map, Sprout } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { PlotCard } from './PlotCard'

export function FieldGrid() {
  const plots = useGameStore((state) => state.plots)
  const selectedPlotId = useGameStore((state) => state.selectedPlotId)
  const selectPlot = useGameStore((state) => state.selectPlot)
  const selectedPlot = plots.find((plot) => plot.id === selectedPlotId)

  return (
    <section className="panel flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase text-lime-600">Mapa</p>
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
            <Map className="h-5 w-5 text-lime-600" aria-hidden="true" />
            Parcelas
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl border border-lime-200 bg-lime-50 px-3 py-1.5 text-sm font-bold text-lime-800">
          <Sprout className="h-4 w-4" aria-hidden="true" />
          {selectedPlot?.name ?? 'Sin selección'}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-3 gap-2">
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
