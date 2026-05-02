import type { Upgrade, UpgradeCosts, UpgradeId } from '../types/game'
import { MAX_UPGRADE_LEVELS } from '../utils/balancing'

type UpgradeCopy = Omit<Upgrade, 'id' | 'cost' | 'level' | 'unlocked'>

export const UPGRADE_COPY: Record<UpgradeId, UpgradeCopy> = {
  newDrone: {
    name: 'Nuevo dron',
    description: 'Suma una unidad a la flota.',
  },
  droneEfficiency: {
    name: 'Eficiencia',
    description: 'Mejora el impacto de cada acción.',
    maxLevel: MAX_UPGRADE_LEVELS.droneEfficiency,
  },
  droneBattery: {
    name: 'Batería',
    description: 'Más autonomía para operar.',
    maxLevel: MAX_UPGRADE_LEVELS.droneBattery,
  },
  controlCenter: {
    name: 'Centro',
    description: 'Mejora análisis y recuperación.',
    maxLevel: MAX_UPGRADE_LEVELS.controlCenter,
  },
  autoWatering: {
    name: 'Riego auto',
    description: 'Riega la parcela más seca.',
  },
  autoScanning: {
    name: 'Escaneo auto',
    description: 'Genera datos cada cierto tiempo.',
  },
  autoHarvesting: {
    name: 'Cosecha auto',
    description: 'Cosecha parcelas listas.',
  },
}

export function buildUpgradeList(
  costs: UpgradeCosts,
  levels: { droneEfficiency: number; droneBattery: number; controlCenter: number },
  automation: { watering: boolean; scanning: boolean; harvesting: boolean },
): Upgrade[] {
  return [
    {
      id: 'newDrone',
      ...UPGRADE_COPY.newDrone,
      cost: costs.newDrone,
    },
    {
      id: 'droneEfficiency',
      ...UPGRADE_COPY.droneEfficiency,
      cost: costs.droneEfficiency,
      level: levels.droneEfficiency,
    },
    {
      id: 'droneBattery',
      ...UPGRADE_COPY.droneBattery,
      cost: costs.droneBattery,
      level: levels.droneBattery,
    },
    {
      id: 'controlCenter',
      ...UPGRADE_COPY.controlCenter,
      cost: costs.controlCenter,
      level: levels.controlCenter,
    },
    {
      id: 'autoWatering',
      ...UPGRADE_COPY.autoWatering,
      cost: costs.autoWatering,
      unlocked: automation.watering,
    },
    {
      id: 'autoScanning',
      ...UPGRADE_COPY.autoScanning,
      cost: costs.autoScanning,
      unlocked: automation.scanning,
    },
    {
      id: 'autoHarvesting',
      ...UPGRADE_COPY.autoHarvesting,
      cost: costs.autoHarvesting,
      unlocked: automation.harvesting,
    },
  ]
}
