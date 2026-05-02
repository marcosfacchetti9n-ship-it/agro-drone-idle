import { BatteryCharging, Droplets, ScanLine, ShieldCheck, Wheat } from 'lucide-react'
import type { Drone, FarmAction, Plot, Resources } from '../types/game'
import { ACTION_BATTERY_COSTS, ACTION_RESOURCE_COSTS } from '../utils/balancing'
import { canAfford, isDroneAvailable } from '../utils/calculations'
import { formatPercent } from '../utils/formatters'

interface DroneCardProps {
  drone: Drone
  selectedPlot?: Plot
  resources: Resources
  onScan: () => void
  onWater: () => void
  onPestControl: () => void
  onHarvest: () => void
}

const statusLabels: Record<Drone['status'], string> = {
  idle: 'Idle',
  scanning: 'Scanning',
  watering: 'Watering',
  harvesting: 'Harvesting',
  pest_control: 'Pest control',
  charging: 'Charging',
}

function batteryWidth(drone: Drone): string {
  return `${Math.round((drone.battery / drone.maxBattery) * 100)}%`
}

function getActionHint(drone: Drone, selectedPlot?: Plot): string {
  if (!selectedPlot) return 'Select a plot to dispatch this unit.'
  if (!isDroneAvailable(drone)) return 'Task finishing. Ready on the next tick.'
  if (selectedPlot.growth < 85) return 'Harvest unlocks at 85% growth; other tasks stay available.'
  return 'Ready for scan, irrigation, pest control or harvest.'
}

export function DroneCard({
  drone,
  selectedPlot,
  resources,
  onScan,
  onWater,
  onPestControl,
  onHarvest,
}: DroneCardProps) {
  const available = isDroneAvailable(drone)
  const canRun = (action: FarmAction) =>
    Boolean(selectedPlot) &&
    available &&
    drone.battery >= ACTION_BATTERY_COSTS[action] &&
    canAfford(resources, ACTION_RESOURCE_COSTS[action])
  const canScan = canRun('scan')
  const canWater = canRun('water')
  const canPest = canRun('pestControl')
  const canHarvest = canRun('harvest') && Boolean(selectedPlot && selectedPlot.growth >= 85)

  return (
    <article className="rounded-lg border border-slate-700/70 bg-slate-950/70 p-3">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{drone.name}</h3>
          <p className="text-xs capitalize text-slate-500">
            {drone.type} | Lv. {drone.level} | {formatPercent(drone.efficiency)}
          </p>
        </div>
        <span className="rounded border border-cyan-300/20 bg-cyan-400/10 px-2 py-1 text-[11px] text-cyan-100">
          {statusLabels[drone.status]}
        </span>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex justify-between text-xs text-slate-400">
          <span>Battery</span>
          <span>
            {Math.round(drone.battery)}/{drone.maxBattery}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-amber-300" style={{ width: batteryWidth(drone) }} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          title="Scan plot"
          aria-label="Scan plot"
          disabled={!canScan}
          onClick={onScan}
          className="drone-action"
        >
          <ScanLine className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          title="Water plot"
          aria-label="Water plot"
          disabled={!canWater}
          onClick={onWater}
          className="drone-action"
        >
          <Droplets className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          title="Control pest"
          aria-label="Control pest"
          disabled={!canPest}
          onClick={onPestControl}
          className="drone-action"
        >
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          title="Harvest plot"
          aria-label="Harvest plot"
          disabled={!canHarvest}
          onClick={onHarvest}
          className="drone-action"
        >
          <Wheat className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <BatteryCharging className="h-3.5 w-3.5" aria-hidden="true" />
        {getActionHint(drone, selectedPlot)}
      </div>
    </article>
  )
}
