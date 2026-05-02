import {
  BatteryCharging,
  Cpu,
  Droplets,
  Gauge,
  PlusCircle,
  ScanLine,
  Wheat,
} from 'lucide-react'
import { buildUpgradeList } from '../data/upgrades'
import { useGameStore } from '../store/gameStore'
import type { UpgradeId } from '../types/game'
import { canAfford } from '../utils/calculations'
import { UpgradeCard } from './UpgradeCard'

const upgradeIcons: Record<UpgradeId, typeof PlusCircle> = {
  newDrone: PlusCircle,
  droneEfficiency: Gauge,
  droneBattery: BatteryCharging,
  controlCenter: Cpu,
  autoWatering: Droplets,
  autoScanning: ScanLine,
  autoHarvesting: Wheat,
}

export function UpgradePanel() {
  const resources = useGameStore((state) => state.resources)
  const costs = useGameStore((state) => state.upgradeCosts)
  const levels = useGameStore((state) => state.upgradeLevels)
  const automation = useGameStore((state) => state.automation)
  const buyDrone = useGameStore((state) => state.buyDrone)
  const upgradeDroneEfficiency = useGameStore((state) => state.upgradeDroneEfficiency)
  const upgradeBattery = useGameStore((state) => state.upgradeBattery)
  const upgradeControlCenter = useGameStore((state) => state.upgradeControlCenter)
  const unlockAutomation = useGameStore((state) => state.unlockAutomation)

  const upgrades = buildUpgradeList(costs, levels, automation)
  const handlers: Record<UpgradeId, () => void> = {
    newDrone: buyDrone,
    droneEfficiency: upgradeDroneEfficiency,
    droneBattery: upgradeBattery,
    controlCenter: upgradeControlCenter,
    autoWatering: () => unlockAutomation('watering'),
    autoScanning: () => unlockAutomation('scanning'),
    autoHarvesting: () => unlockAutomation('harvesting'),
  }

  return (
    <section className="panel p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-500">Upgrades</p>
          <h2 className="text-xl font-semibold text-white">Operations budget</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {upgrades.map((upgrade) => {
          const Icon = upgradeIcons[upgrade.id]

          return (
            <UpgradeCard
              key={upgrade.id}
              upgrade={upgrade}
              icon={Icon}
              affordable={canAfford(resources, upgrade.cost)}
              onBuy={handlers[upgrade.id]}
            />
          )
        })}
      </div>
    </section>
  )
}
