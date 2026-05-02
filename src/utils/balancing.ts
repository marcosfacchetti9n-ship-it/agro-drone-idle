import type { FarmAction, PlotStatus, ResourceCost, UpgradeCosts } from '../types/game'

export const MAX_EVENTS = 20

export const RESOURCE_CAPS = {
  baseEnergy: 100,
  energyPerControlLevel: 25,
  baseWater: 180,
  waterPerControlLevel: 20,
}

export const ACTION_RESOURCE_COSTS: Record<FarmAction, ResourceCost> = {
  scan: { energy: 3 },
  water: { water: 6, energy: 4 },
  pestControl: { money: 10, energy: 5 },
  harvest: { energy: 7 },
}

export const ACTION_BATTERY_COSTS: Record<FarmAction, number> = {
  scan: 7,
  water: 10,
  pestControl: 13,
  harvest: 15,
}

export const ACTION_PLOT_STATUS: Record<FarmAction, PlotStatus> = {
  scan: 'scanning',
  water: 'watering',
  pestControl: 'pest_control',
  harvest: 'harvesting',
}

export const AUTOMATION_INTERVALS = {
  watering: 3,
  scanning: 4,
  harvesting: 3,
}

export const BASE_UPGRADE_COSTS: UpgradeCosts = {
  newDrone: { money: 120 },
  droneEfficiency: { money: 70, agriData: 10 },
  droneBattery: { money: 80, agriData: 8 },
  controlCenter: { money: 160, agriData: 18 },
  autoWatering: { money: 190, agriData: 28 },
  autoScanning: { money: 180, agriData: 24 },
  autoHarvesting: { money: 230, agriData: 40 },
}

export const UPGRADE_MULTIPLIERS = {
  newDrone: 1.45,
  droneEfficiency: 1.35,
  droneBattery: 1.35,
  controlCenter: 1.5,
}

export const MAX_UPGRADE_LEVELS = {
  droneEfficiency: 12,
  droneBattery: 12,
  controlCenter: 8,
}

export const HARVEST_MIN_GROWTH = 75

export const CROP_SELL_PRICE = 4
