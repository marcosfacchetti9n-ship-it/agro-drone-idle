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
    <aside className="panel flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-500">Drone fleet</p>
          <h2 className="text-lg font-semibold text-white">Dispatch queue</h2>
        </div>
        <RadioTower className="h-5 w-5 text-cyan-200" aria-hidden="true" />
      </div>

      {selectedPlot ? (
        <div className="rounded-lg border border-emerald-300/15 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
          Target plot: {selectedPlot.name} | Growth {Math.round(selectedPlot.growth)}%
        </div>
      ) : (
        <div className="rounded-lg border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
          Select a plot to enable drone actions.
        </div>
      )}

      <div className="flex flex-col gap-3">
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
