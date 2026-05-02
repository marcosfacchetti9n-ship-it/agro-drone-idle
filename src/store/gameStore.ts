import { create } from 'zustand'
import { createInitialGameState } from '../data/initialGameState'
import { generateAdvisorRecommendation, generateFarmEvent } from '../services/aiService'
import { clearSavedGame, loadGameState, saveGameState } from '../services/saveService'
import type {
  AutomationKey,
  EventDraft,
  GameState,
  UpgradeId,
} from '../types/game'
import {
  MAX_UPGRADE_LEVELS,
  UPGRADE_MULTIPLIERS,
} from '../utils/balancing'
import {
  appendEvents,
  createDrone,
  performDroneAction,
  runAutomation,
  scaleCost,
  spendOrWarn,
  tickDrones,
  tickPlots,
} from '../utils/gameEngine'
import {
  calculateIncomePerSecond,
  clamp,
  getEnergyCap,
  getWaterCap,
  spendResources,
} from '../utils/calculations'
import { formatResourceName } from '../utils/formatters'

interface GameStore extends GameState {
  selectPlot: (plotId: string) => void
  scanPlot: (droneId: string) => void
  waterPlot: (droneId: string) => void
  pestControl: (droneId: string) => void
  harvestPlot: (droneId: string) => void
  buyDrone: () => void
  upgradeDroneEfficiency: () => void
  upgradeBattery: () => void
  upgradeControlCenter: () => void
  unlockAutomation: (automation: AutomationKey) => void
  analyzeField: () => void
  runTick: () => void
  resetGame: () => void
  addEvent: (event: EventDraft) => void
}

const bootState = loadGameState() ?? createInitialGameState()

const automationLabels: Record<AutomationKey, string> = {
  watering: 'riego',
  scanning: 'escaneo',
  harvesting: 'cosecha',
}

export const useGameStore = create<GameStore>((set) => ({
  ...bootState,

  selectPlot: (plotId) => set({ selectedPlotId: plotId }),

  scanPlot: (droneId) => set((state) => performDroneAction(state, 'scan', droneId)),
  waterPlot: (droneId) => set((state) => performDroneAction(state, 'water', droneId)),
  pestControl: (droneId) => set((state) => performDroneAction(state, 'pestControl', droneId)),
  harvestPlot: (droneId) => set((state) => performDroneAction(state, 'harvest', droneId)),

  buyDrone: () =>
    set((state) => {
      const cost = state.upgradeCosts.newDrone
      const shortage = spendOrWarn(state, cost)
      if (shortage) {
        return {
          ...state,
          events: appendEvents(state.events, [
            { type: 'warning', message: `Falta ${formatResourceName(shortage)} para comprar un dron.` },
          ]),
        }
      }

      const nextIndex = state.drones.length + 1
      const drone = createDrone(nextIndex)
      const resources = spendResources(state.resources, cost)
      const upgradeCosts = {
        ...state.upgradeCosts,
        newDrone: scaleCost(cost, UPGRADE_MULTIPLIERS.newDrone),
      }

      return {
        ...state,
        resources,
        drones: [...state.drones, drone],
        upgradeCosts,
        events: appendEvents(state.events, [
          { type: 'success', message: `${drone.name} se sumó a la flota.` },
        ]),
      }
    }),

  upgradeDroneEfficiency: () =>
    set((state) => {
      const cost = state.upgradeCosts.droneEfficiency
      if (state.upgradeLevels.droneEfficiency >= MAX_UPGRADE_LEVELS.droneEfficiency) {
        return {
          ...state,
          events: appendEvents(state.events, [
            { type: 'info', message: 'La eficiencia ya está al máximo.' },
          ]),
        }
      }

      const shortage = spendOrWarn(state, cost)
      if (shortage) {
        return {
          ...state,
          events: appendEvents(state.events, [
            { type: 'warning', message: `Falta ${formatResourceName(shortage)} para mejorar eficiencia.` },
          ]),
        }
      }

      const resources = spendResources(state.resources, cost)
      const drones = state.drones.map((drone) => ({
        ...drone,
        level: drone.level + 1,
        efficiency: Number((drone.efficiency + 0.08).toFixed(2)),
      }))
      const upgradeLevels = {
        ...state.upgradeLevels,
        droneEfficiency: state.upgradeLevels.droneEfficiency + 1,
      }
      const upgradeCosts = {
        ...state.upgradeCosts,
        droneEfficiency: scaleCost(cost, UPGRADE_MULTIPLIERS.droneEfficiency),
      }

      return {
        ...state,
        resources,
        drones,
        upgradeLevels,
        upgradeCosts,
        events: appendEvents(state.events, [
          { type: 'success', message: 'Eficiencia mejorada en toda la flota.' },
        ]),
      }
    }),

  upgradeBattery: () =>
    set((state) => {
      const cost = state.upgradeCosts.droneBattery
      if (state.upgradeLevels.droneBattery >= MAX_UPGRADE_LEVELS.droneBattery) {
        return {
          ...state,
          events: appendEvents(state.events, [
            { type: 'info', message: 'Las baterías ya están al máximo.' },
          ]),
        }
      }

      const shortage = spendOrWarn(state, cost)
      if (shortage) {
        return {
          ...state,
          events: appendEvents(state.events, [
            { type: 'warning', message: `Falta ${formatResourceName(shortage)} para mejorar batería.` },
          ]),
        }
      }

      const resources = spendResources(state.resources, cost)
      const drones = state.drones.map((drone) => ({
        ...drone,
        maxBattery: drone.maxBattery + 18,
        battery: drone.battery + 18,
      }))
      const upgradeLevels = {
        ...state.upgradeLevels,
        droneBattery: state.upgradeLevels.droneBattery + 1,
      }
      const upgradeCosts = {
        ...state.upgradeCosts,
        droneBattery: scaleCost(cost, UPGRADE_MULTIPLIERS.droneBattery),
      }

      return {
        ...state,
        resources,
        drones,
        upgradeLevels,
        upgradeCosts,
        events: appendEvents(state.events, [
          { type: 'success', message: 'Batería aumentada en toda la flota.' },
        ]),
      }
    }),

  upgradeControlCenter: () =>
    set((state) => {
      const cost = state.upgradeCosts.controlCenter
      if (state.controlCenterLevel >= MAX_UPGRADE_LEVELS.controlCenter) {
        return {
          ...state,
          events: appendEvents(state.events, [
            { type: 'info', message: 'El centro ya está al máximo.' },
          ]),
        }
      }

      const shortage = spendOrWarn(state, cost)
      if (shortage) {
        return {
          ...state,
          events: appendEvents(state.events, [
            { type: 'warning', message: `Falta ${formatResourceName(shortage)} para mejorar el centro.` },
          ]),
        }
      }

      const resources = spendResources(state.resources, cost)
      const controlCenterLevel = state.controlCenterLevel + 1
      const upgradeLevels = {
        ...state.upgradeLevels,
        controlCenter: controlCenterLevel,
      }
      const upgradeCosts = {
        ...state.upgradeCosts,
        controlCenter: scaleCost(cost, UPGRADE_MULTIPLIERS.controlCenter),
      }

      return {
        ...state,
        resources,
        controlCenterLevel,
        upgradeLevels,
        upgradeCosts,
        events: appendEvents(state.events, [
          { type: 'success', message: `Centro mejorado a nivel ${controlCenterLevel}.` },
        ]),
      }
    }),

  unlockAutomation: (automation) =>
    set((state) => {
      if (state.automation[automation]) {
        return {
          ...state,
          events: appendEvents(state.events, [
            { type: 'info', message: 'Esa automatización ya está activa.' },
          ]),
        }
      }

      const costByAutomation: Record<AutomationKey, UpgradeId> = {
        watering: 'autoWatering',
        scanning: 'autoScanning',
        harvesting: 'autoHarvesting',
      }
      const cost = state.upgradeCosts[costByAutomation[automation]]
      const shortage = spendOrWarn(state, cost)

      if (shortage) {
        return {
          ...state,
          events: appendEvents(state.events, [
            { type: 'warning', message: `Falta ${formatResourceName(shortage)} para activar automatización.` },
          ]),
        }
      }

      return {
        ...state,
        resources: spendResources(state.resources, cost),
        automation: {
          ...state.automation,
          [automation]: true,
        },
        events: appendEvents(state.events, [
          { type: 'success', message: `Automatización de ${automationLabels[automation]} activada.` },
        ]),
      }
    }),

  analyzeField: () =>
    set((state) => {
      const advisorRecommendation = generateAdvisorRecommendation(state)
      return {
        ...state,
        advisorRecommendation,
        events: appendEvents(state.events, [
          { type: 'ai', message: `Asesor IA: ${advisorRecommendation}` },
        ]),
      }
    }),

  runTick: () =>
    set((state) => {
      const tick = state.tick + 1
      const marketBoostTicksRemaining = Math.max(0, state.marketBoostTicksRemaining - 1)
      const marketMultiplier = marketBoostTicksRemaining > 0 ? state.marketMultiplier : 1

      const tickedPlots = tickPlots(state.plots, state.controlCenterLevel)
      const tickedDrones = tickDrones(state.drones, state.controlCenterLevel)

      let nextState: GameState = {
        ...state,
        tick,
        marketMultiplier,
        marketBoostTicksRemaining,
        resources: {
          ...state.resources,
          energy: clamp(
            state.resources.energy + 0.45 + state.controlCenterLevel * 0.15,
            0,
            getEnergyCap(state.controlCenterLevel),
          ),
          water: clamp(
            state.resources.water + 0.12 + state.controlCenterLevel * 0.04,
            0,
            getWaterCap(state.controlCenterLevel),
          ),
        },
        plots: tickedPlots,
        drones: tickedDrones,
      }

      const passiveIncome = calculateIncomePerSecond(nextState)
      nextState = {
        ...nextState,
        resources: {
          ...nextState.resources,
          money: nextState.resources.money + passiveIncome,
        },
      }

      const automationResult = runAutomation(nextState)
      nextState = automationResult.gameState
      const eventDrafts = [...automationResult.eventDrafts]

      if (tick % 14 === 0) {
        eventDrafts.push(generateFarmEvent(nextState))
      }

      if (tick % 30 === 0) {
        nextState.advisorRecommendation = generateAdvisorRecommendation(nextState)
      }

      if (tick % 55 === 0 && Math.random() < 0.35 && nextState.marketBoostTicksRemaining === 0) {
        nextState.marketMultiplier = 1.1
        nextState.marketBoostTicksRemaining = 60
        eventDrafts.push({
          type: 'success',
          message: 'Subió la demanda de trigo. Ventas +10% por 60 segundos.',
        })
      }

      const incomePerSecond = calculateIncomePerSecond(nextState)

      return {
        ...nextState,
        incomePerSecond,
        events: appendEvents(state.events, eventDrafts),
      }
    }),

  resetGame: () => {
    clearSavedGame()
    set(createInitialGameState())
  },

  addEvent: (event) => set((state) => ({ events: appendEvents(state.events, [event]) })),
}))

let lastAutoSaveAt = 0

useGameStore.subscribe((state) => {
  const now = Date.now()
  if (state.tick === 0 || now - lastAutoSaveAt >= 1500) {
    saveGameState(state)
    lastAutoSaveAt = now
  }
})
