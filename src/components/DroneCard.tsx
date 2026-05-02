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
  idle: 'Libre',
  scanning: 'Escanea',
  watering: 'Riega',
  harvesting: 'Cosecha',
  pest_control: 'Plaga',
  charging: 'Carga',
}

const typeLabels: Record<Drone['type'], string> = {
  scout: 'explorador',
  irrigation: 'riego',
  harvester: 'cosecha',
  hybrid: 'híbrido',
}

function batteryWidth(drone: Drone): string {
  return `${Math.round((drone.battery / drone.maxBattery) * 100)}%`
}

function getActionHint(drone: Drone, selectedPlot?: Plot): string {
  if (!selectedPlot) return 'Elegí una parcela.'
  if (!isDroneAvailable(drone)) return 'Tarea en curso.'
  if (selectedPlot.growth < 85) return 'Cosecha desde 85%.'
  return 'Listo para operar.'
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
    <article className="rounded-2xl border border-white bg-white/80 p-2.5 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-black text-slate-950">{drone.name}</h3>
          <p className="text-[11px] capitalize text-slate-500">
            {typeLabels[drone.type]} | Nv. {drone.level} | {formatPercent(drone.efficiency)}
          </p>
        </div>
        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-700">
          {statusLabels[drone.status]}
        </span>
      </div>

      <div className="mb-2">
        <div className="mb-1 flex justify-between text-[11px] font-semibold text-slate-500">
          <span>Batería</span>
          <span>
            {Math.round(drone.battery)}/{drone.maxBattery}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-amber-400" style={{ width: batteryWidth(drone) }} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          title="Escanear parcela"
          aria-label="Escanear parcela"
          disabled={!canScan}
          onClick={onScan}
          className="drone-action"
        >
          <ScanLine className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          title="Regar parcela"
          aria-label="Regar parcela"
          disabled={!canWater}
          onClick={onWater}
          className="drone-action"
        >
          <Droplets className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          title="Controlar plaga"
          aria-label="Controlar plaga"
          disabled={!canPest}
          onClick={onPestControl}
          className="drone-action"
        >
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          title="Cosechar parcela"
          aria-label="Cosechar parcela"
          disabled={!canHarvest}
          onClick={onHarvest}
          className="drone-action"
        >
          <Wheat className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-slate-500">
        <BatteryCharging className="h-3.5 w-3.5" aria-hidden="true" />
        {getActionHint(drone, selectedPlot)}
      </div>
    </article>
  )
}
