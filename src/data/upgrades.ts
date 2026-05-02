import type { Upgrade, UpgradeCosts, UpgradeId } from '../types/game'
import { MAX_UPGRADE_LEVELS } from '../utils/balancing'

type UpgradeCopy = Omit<Upgrade, 'id' | 'cost' | 'level' | 'unlocked'>

export const UPGRADE_COPY: Record<UpgradeId, UpgradeCopy> = {
  newDrone: {
    name: 'New drone',
    description: 'Adds another autonomous unit to the fleet.',
  },
  droneEfficiency: {
    name: 'Drone efficiency',
    description: 'Improves every drone action impact.',
    maxLevel: MAX_UPGRADE_LEVELS.droneEfficiency,
  },
  droneBattery: {
    name: 'Battery cells',
    description: 'Increases max battery and action uptime.',
    maxLevel: MAX_UPGRADE_LEVELS.droneBattery,
  },
  controlCenter: {
    name: 'Control center',
    description: 'Boosts growth analytics, storage and resource recovery.',
    maxLevel: MAX_UPGRADE_LEVELS.controlCenter,
  },
  autoWatering: {
    name: 'Auto irrigation',
    description: 'Periodically waters the driest plot.',
  },
  autoScanning: {
    name: 'Auto scanning',
    description: 'Generates agricultural data on a schedule.',
  },
  autoHarvesting: {
    name: 'Auto harvest',
    description: 'Harvests ready plots without manual input.',
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
