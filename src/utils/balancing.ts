import type { FarmAction, PlotStatus, ResourceCost, UpgradeCosts } from '../types/game'

export const MAX_EVENTS = 20

export const RESOURCE_CAPS = {
  baseEnergy: 100,
  energyPerControlLevel: 25,
  baseWater: 180,
  waterPerControlLevel: 20,
}

export const ACTION_RESOURCE_COSTS: Record<FarmAction, ResourceCost> = {
  scan: { energy: 4 },
  water: { water: 8, energy: 6 },
  pestControl: { money: 15, energy: 8 },
  harvest: { energy: 10 },
}

export const ACTION_BATTERY_COSTS: Record<FarmAction, number> = {
  scan: 10,
  water: 14,
  pestControl: 18,
  harvest: 20,
}

export const ACTION_PLOT_STATUS: Record<FarmAction, PlotStatus> = {
  scan: 'scanning',
  water: 'watering',
  pestControl: 'pest_control',
  harvest: 'harvesting',
}

export const AUTOMATION_INTERVALS = {
  watering: 5,
  scanning: 7,
  harvesting: 4,
}

export const BASE_UPGRADE_COSTS: UpgradeCosts = {
  newDrone: { money: 150 },
  droneEfficiency: { money: 100, agriData: 15 },
  droneBattery: { money: 120, agriData: 10 },
  controlCenter: { money: 250, agriData: 25 },
  autoWatering: { money: 300, agriData: 40 },
  autoScanning: { money: 300, agriData: 35 },
  autoHarvesting: { money: 350, agriData: 60 },
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

export const CROP_SELL_PRICE = 3
