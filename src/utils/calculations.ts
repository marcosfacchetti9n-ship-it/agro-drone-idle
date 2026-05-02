import type {
  Drone,
  DroneType,
  FarmAction,
  FieldMetrics,
  GameState,
  Plot,
  ResourceCost,
  ResourceKey,
  Resources,
} from '../types/game'
import { CROP_SELL_PRICE, RESOURCE_CAPS } from './balancing'

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value))
}

export function canAfford(resources: Resources, cost: ResourceCost): boolean {
  return (Object.entries(cost) as Array<[ResourceKey, number]>).every(
    ([key, value]) => resources[key] >= value,
  )
}

export function getShortage(resources: Resources, cost: ResourceCost): ResourceKey | null {
  const missing = (Object.entries(cost) as Array<[ResourceKey, number]>).find(
    ([key, value]) => resources[key] < value,
  )
  return missing?.[0] ?? null
}

export function spendResources(resources: Resources, cost: ResourceCost): Resources {
  return {
    money: resources.money - (cost.money ?? 0),
    crops: resources.crops - (cost.crops ?? 0),
    water: resources.water - (cost.water ?? 0),
    energy: resources.energy - (cost.energy ?? 0),
    agriData: resources.agriData - (cost.agriData ?? 0),
  }
}

export function addResources(resources: Resources, amount: ResourceCost): Resources {
  return {
    money: resources.money + (amount.money ?? 0),
    crops: resources.crops + (amount.crops ?? 0),
    water: resources.water + (amount.water ?? 0),
    energy: resources.energy + (amount.energy ?? 0),
    agriData: resources.agriData + (amount.agriData ?? 0),
  }
}

export function getEnergyCap(controlCenterLevel: number): number {
  return RESOURCE_CAPS.baseEnergy + (controlCenterLevel - 1) * RESOURCE_CAPS.energyPerControlLevel
}

export function getWaterCap(controlCenterLevel: number): number {
  return RESOURCE_CAPS.baseWater + (controlCenterLevel - 1) * RESOURCE_CAPS.waterPerControlLevel
}

export function getFieldMetrics(plots: Plot[]): FieldMetrics {
  const totals = plots.reduce(
    (acc, plot) => ({
      health: acc.health + plot.cropHealth,
      moisture: acc.moisture + plot.moisture,
      pest: acc.pest + plot.pestLevel,
      growth: acc.growth + plot.growth,
      ready: acc.ready + (plot.growth >= 100 ? 1 : 0),
      lowMoisture: acc.lowMoisture + (plot.moisture < 35 ? 1 : 0),
      highPest: acc.highPest + (plot.pestLevel > 45 ? 1 : 0),
    }),
    { health: 0, moisture: 0, pest: 0, growth: 0, ready: 0, lowMoisture: 0, highPest: 0 },
  )

  const count = Math.max(plots.length, 1)
  return {
    averageHealth: totals.health / count,
    averageMoisture: totals.moisture / count,
    averagePestLevel: totals.pest / count,
    averageGrowth: totals.growth / count,
    readyPlots: totals.ready,
    lowMoisturePlots: totals.lowMoisture,
    highPestPlots: totals.highPest,
  }
}

export function getFieldStatus(metrics: FieldMetrics): string {
  if (metrics.averageHealth < 45) return 'Crítico'
  if (metrics.highPestPlots >= 3) return 'Plagas'
  if (metrics.lowMoisturePlots >= 3) return 'Regar'
  if (metrics.readyPlots > 0) return 'Cosechar'
  if (metrics.averageHealth > 75 && metrics.averageMoisture > 45) return 'Estable'
  return 'Monitoreo'
}

export function calculateGrowthDelta(plot: Plot, controlCenterLevel: number): number {
  if (plot.growth >= 100 || plot.cropHealth <= 5) return 0

  const healthFactor = clamp(plot.cropHealth, 0, 100) / 100
  const moistureFactor =
    plot.moisture < 20 ? 0.25 : plot.moisture < 40 ? 0.65 : plot.moisture > 92 ? 0.75 : 1
  const pestFactor = clamp(1 - plot.pestLevel / 130, 0.15, 1)
  const centerBoost = 1 + (controlCenterLevel - 1) * 0.04

  return 1.55 * healthFactor * moistureFactor * pestFactor * centerBoost
}

export function calculateHealthDelta(plot: Plot): number {
  let delta = 0.1

  if (plot.moisture < 22) delta -= 0.65
  else if (plot.moisture < 38) delta -= 0.25
  else if (plot.moisture <= 82) delta += 0.18
  else if (plot.moisture > 94) delta -= 0.22

  if (plot.pestLevel > 65) delta -= 0.65
  else if (plot.pestLevel > 42) delta -= 0.3
  else if (plot.pestLevel < 18) delta += 0.08

  return delta
}

export function getDroneActionMultiplier(drone: Drone, action: FarmAction): number {
  const typeBonus: Record<DroneType, Partial<Record<FarmAction, number>>> = {
    scout: { scan: 1.35, water: 0.8, pestControl: 0.85, harvest: 0.75 },
    irrigation: { scan: 0.85, water: 1.35, pestControl: 0.9, harvest: 0.8 },
    harvester: { scan: 0.85, water: 0.8, pestControl: 0.9, harvest: 1.35 },
    hybrid: { scan: 1.08, water: 1.08, pestControl: 1.08, harvest: 1.08 },
  }

  return drone.efficiency * (1 + (drone.level - 1) * 0.05) * (typeBonus[drone.type][action] ?? 1)
}

export function isDroneAvailable(drone: Drone): boolean {
  return drone.status === 'idle' || drone.status === 'charging'
}

export function calculateHarvestYield(plot: Plot, multiplier: number): { crops: number; money: number } {
  const cropYield = Math.round((22 + plot.cropHealth * 0.34 + plot.growth * 0.14) * multiplier)
  return {
    crops: cropYield,
    money: Math.round(cropYield * CROP_SELL_PRICE),
  }
}

export function calculateIncomePerSecond(state: GameState): number {
  const metrics = getFieldMetrics(state.plots)
  const productivePlots = state.plots.filter((plot) => plot.cropHealth > 10).length
  if (productivePlots === 0 || state.drones.length === 0) return 0

  const healthFactor = metrics.averageHealth / 100
  const growthFactor = 0.35 + metrics.averageGrowth / 100
  const pestFactor = clamp(1 - metrics.averagePestLevel / 180, 0.25, 1)
  const centerFactor = 1 + (state.controlCenterLevel - 1) * 0.07
  const fleetFactor = Math.min(state.drones.length, 12)
  const passiveIncome = healthFactor * growthFactor * pestFactor * centerFactor * fleetFactor * 1.15

  return Number((passiveIncome * state.marketMultiplier).toFixed(2))
}
