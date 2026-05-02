import type {
  Drone,
  EventDraft,
  FarmAction,
  GameEvent,
  GameState,
  Plot,
  ResourceCost,
  ResourceKey,
} from '../types/game'
import {
  ACTION_BATTERY_COSTS,
  ACTION_PLOT_STATUS,
  ACTION_RESOURCE_COSTS,
  AUTOMATION_INTERVALS,
  CROP_SELL_PRICE,
  HARVEST_MIN_GROWTH,
  MAX_EVENTS,
} from './balancing'
import {
  addResources,
  calculateGrowthDelta,
  calculateHarvestYield,
  calculateHealthDelta,
  calculateIncomePerSecond,
  canAfford,
  clamp,
  getDroneActionMultiplier,
  getShortage,
  isDroneAvailable,
  spendResources,
} from './calculations'
import { formatResourceName } from './formatters'

const actionLabels: Record<FarmAction, string> = {
  scan: 'escaneo',
  water: 'riego',
  pestControl: 'control de plaga',
  harvest: 'cosecha',
}

const droneStatusByAction: Record<FarmAction, Drone['status']> = {
  scan: 'scanning',
  water: 'watering',
  pestControl: 'pest_control',
  harvest: 'harvesting',
}

export interface AutomationResult {
  gameState: GameState
  eventDrafts: EventDraft[]
}

function makeEvent(event: EventDraft): GameEvent {
  return {
    ...event,
    id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  }
}

export function appendEvents(events: GameEvent[], drafts: EventDraft[]): GameEvent[] {
  if (drafts.length === 0) return events
  return [...drafts.map(makeEvent).reverse(), ...events].slice(0, MAX_EVENTS)
}

export function scaleCost(cost: ResourceCost, multiplier: number): ResourceCost {
  return Object.fromEntries(
    (Object.entries(cost) as Array<[ResourceKey, number]>).map(([key, value]) => [
      key,
      Math.ceil(value * multiplier),
    ]),
  ) as ResourceCost
}

export function spendOrWarn(state: GameState, cost: ResourceCost): ResourceKey | null {
  return canAfford(state.resources, cost) ? null : getShortage(state.resources, cost)
}

function updatePlot(plots: Plot[], plotId: string, updater: (plot: Plot) => Plot): Plot[] {
  return plots.map((plot) => (plot.id === plotId ? updater(plot) : plot))
}

function createDroneName(index: number): string {
  return `Dron-${String(index).padStart(2, '0')}`
}

export function createDrone(index: number): Drone {
  const types: Drone['type'][] = ['irrigation', 'harvester', 'scout', 'hybrid']

  return {
    id: `drone-${Date.now()}-${index}`,
    name: createDroneName(index),
    type: types[(index - 2) % types.length],
    level: 1,
    battery: 100,
    maxBattery: 100,
    efficiency: 1,
    status: 'idle',
  }
}

export function performDroneAction(
  state: GameState,
  action: FarmAction,
  droneId: string,
): GameState {
  const selectedPlotId = state.selectedPlotId
  const drone = state.drones.find((item) => item.id === droneId)
  const plot = selectedPlotId ? state.plots.find((item) => item.id === selectedPlotId) : null

  if (!selectedPlotId || !plot) {
    return {
      ...state,
      events: appendEvents(state.events, [
        { type: 'warning', message: 'Elegí una parcela antes de enviar un dron.' },
      ]),
    }
  }

  if (!drone) {
    return {
      ...state,
      events: appendEvents(state.events, [{ type: 'warning', message: 'No se encontró ese dron.' }]),
    }
  }

  if (!isDroneAvailable(drone)) {
    return {
      ...state,
      events: appendEvents(state.events, [
        { type: 'warning', message: `${drone.name} está terminando su tarea.` },
      ]),
    }
  }

  const batteryCost = ACTION_BATTERY_COSTS[action]
  if (drone.battery < batteryCost) {
    return {
      ...state,
      events: appendEvents(state.events, [
        { type: 'warning', message: `${drone.name} necesita más batería para ${actionLabels[action]}.` },
      ]),
    }
  }

  const resourceCost = ACTION_RESOURCE_COSTS[action]
  const shortage = spendOrWarn(state, resourceCost)
  if (shortage) {
    return {
      ...state,
      events: appendEvents(state.events, [
        { type: 'warning', message: `Falta ${formatResourceName(shortage)} para ${actionLabels[action]}.` },
      ]),
    }
  }

  if (action === 'harvest' && plot.growth < HARVEST_MIN_GROWTH) {
    return {
      ...state,
      events: appendEvents(state.events, [
        { type: 'warning', message: `${plot.name} necesita ${HARVEST_MIN_GROWTH}% de crecimiento para cosechar.` },
      ]),
    }
  }

  const multiplier = getDroneActionMultiplier(drone, action)
  let resources = spendResources(state.resources, resourceCost)
  let event: EventDraft

  const plots = updatePlot(state.plots, plot.id, (currentPlot) => {
    if (action === 'scan') {
      resources = addResources(resources, { agriData: Math.round(18 * multiplier) })
      event = {
        type: 'success',
        message: `${drone.name} escaneó ${currentPlot.name} y generó datos.`,
      }
      return {
        ...currentPlot,
        cropHealth: clamp(currentPlot.cropHealth + 1.5 * multiplier),
        status: ACTION_PLOT_STATUS[action],
        lastScannedTick: state.tick,
      }
    }

    if (action === 'water') {
      event = {
        type: 'success',
        message: `${drone.name} regó ${currentPlot.name}. La humedad subió.`,
      }
      return {
        ...currentPlot,
        moisture: clamp(currentPlot.moisture + 30 * multiplier),
        cropHealth: clamp(currentPlot.cropHealth + 5 * multiplier),
        status: ACTION_PLOT_STATUS[action],
      }
    }

    if (action === 'pestControl') {
      event = {
        type: 'success',
        message: `${drone.name} redujo plagas en ${currentPlot.name}.`,
      }
      return {
        ...currentPlot,
        pestLevel: clamp(currentPlot.pestLevel - 38 * multiplier),
        cropHealth: clamp(currentPlot.cropHealth + 3 * multiplier),
        status: ACTION_PLOT_STATUS[action],
      }
    }

    const yieldResult = calculateHarvestYield(currentPlot, multiplier)
    resources = addResources(resources, {
      crops: yieldResult.crops,
      money: Math.round(yieldResult.money * state.marketMultiplier),
    })
    event = {
      type: 'success',
      message: `${drone.name} cosechó ${yieldResult.crops} unidades en ${currentPlot.name}.`,
    }
    return {
      ...currentPlot,
      growth: 0,
      moisture: clamp(currentPlot.moisture - 5),
      cropHealth: clamp(currentPlot.cropHealth + 1),
      status: ACTION_PLOT_STATUS[action],
    }
  })

  const drones = state.drones.map((currentDrone) =>
    currentDrone.id === drone.id
      ? {
          ...currentDrone,
          battery: clamp(currentDrone.battery - batteryCost, 0, currentDrone.maxBattery),
          status: droneStatusByAction[action],
          assignedPlotId: plot.id,
        }
      : currentDrone,
  )

  return {
    ...state,
    resources,
    plots,
    drones,
    incomePerSecond: calculateIncomePerSecond({ ...state, resources, plots, drones }),
    events: appendEvents(state.events, [event!]),
  }
}

export function tickPlots(plots: Plot[], controlCenterLevel: number): Plot[] {
  return plots.map((plot) => {
    const moistureLoss = 0.22 + Math.random() * 0.12 + plot.pestLevel / 520
    const pestRise = Math.random() < 0.35 ? 0.16 + Math.random() * 0.22 : 0.03

    return {
      ...plot,
      cropHealth: clamp(plot.cropHealth + calculateHealthDelta(plot)),
      moisture: clamp(plot.moisture - moistureLoss),
      pestLevel: clamp(plot.pestLevel + pestRise),
      growth: clamp(plot.growth + calculateGrowthDelta(plot, controlCenterLevel)),
      status: 'idle',
    }
  })
}

export function tickDrones(drones: Drone[], controlCenterLevel: number): Drone[] {
  return drones.map((drone) => {
    const recoverRate = 4 + controlCenterLevel * 0.65
    const canRecover = drone.status === 'idle' || drone.status === 'charging'
    const nextBattery = canRecover
      ? clamp(drone.battery + recoverRate, 0, drone.maxBattery)
      : drone.battery

    return {
      ...drone,
      battery: nextBattery,
      status: nextBattery < drone.maxBattery ? 'charging' : 'idle',
      assignedPlotId: undefined,
    }
  })
}

export function runAutomation(state: GameState): AutomationResult {
  let resources = { ...state.resources }
  let plots = [...state.plots]
  const eventDrafts: EventDraft[] = []

  if (state.automation.watering && state.tick % AUTOMATION_INTERVALS.watering === 0) {
    const target = [...plots].sort((a, b) => a.moisture - b.moisture)[0]
    const cost = { water: 4, energy: 2 }

    if (target && target.moisture < 58 && canAfford(resources, cost)) {
      resources = spendResources(resources, cost)
      plots = updatePlot(plots, target.id, (plot) => ({
        ...plot,
        moisture: clamp(plot.moisture + 20),
        cropHealth: clamp(plot.cropHealth + 2.2),
        status: 'watering',
      }))
      eventDrafts.push({
        type: 'info',
        message: `Riego automático corrigió baja humedad en ${target.name}.`,
      })
    }
  }

  if (state.automation.scanning && state.tick % AUTOMATION_INTERVALS.scanning === 0) {
    resources = addResources(resources, { agriData: 10 + state.controlCenterLevel * 3 })
    eventDrafts.push({
      type: 'ai',
      message: 'Escaneo automático subió nuevos datos del cultivo.',
    })
  }

  if (state.automation.harvesting && state.tick % AUTOMATION_INTERVALS.harvesting === 0) {
    const target = plots.find((plot) => plot.growth >= 100)

    if (target) {
      const yieldResult = calculateHarvestYield(target, 0.9)
      resources = addResources(resources, {
        crops: yieldResult.crops,
        money: Math.round(yieldResult.crops * CROP_SELL_PRICE * state.marketMultiplier),
      })
      plots = updatePlot(plots, target.id, (plot) => ({
        ...plot,
        growth: 0,
        moisture: clamp(plot.moisture - 4),
        status: 'harvesting',
      }))
      eventDrafts.push({
        type: 'success',
        message: `Cosecha automática recolectó ${yieldResult.crops} unidades en ${target.name}.`,
      })
    }
  }

  return {
    gameState: {
      ...state,
      resources,
      plots,
    },
    eventDrafts,
  }
}
