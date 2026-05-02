import { RadioTower } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { DroneCard } from './DroneCard'

export function DronePanel() {
  const drones = useGameStore((state) => state.drones)
  const plots = useGameStore((state) => state.plots)
  const resources = useGameStore((state) => state.resources)
  const selectedPlotId = useGameStore((state) => state.selectedPlotId)
  const scanPlot = useGameStore((state) => state.scanPlot)
  const waterPlot = useGameStore((state) => state.waterPlot)
  const pestControl = useGameStore((state) => state.pestControl)
  const harvestPlot = useGameStore((state) => state.harvestPlot)
  const selectedPlot = plots.find((plot) => plot.id === selectedPlotId)

  return (
    <aside className="panel flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase text-cyan-600">Flota</p>
          <h2 className="text-lg font-black text-slate-950">Drones</h2>
        </div>
        <RadioTower className="h-5 w-5 text-cyan-600" aria-hidden="true" />
      </div>

      {selectedPlot ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">
          Objetivo: {selectedPlot.name} | {Math.round(selectedPlot.growth)}%
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">
          Elegí una parcela.
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {drones.map((drone) => (
          <DroneCard
            key={drone.id}
            drone={drone}
            selectedPlot={selectedPlot}
            resources={resources}
            onScan={() => scanPlot(drone.id)}
            onWater={() => waterPlot(drone.id)}
            onPestControl={() => pestControl(drone.id)}
            onHarvest={() => harvestPlot(drone.id)}
          />
        ))}
      </div>
    </aside>
  )
}
