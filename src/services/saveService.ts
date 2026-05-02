import type { GameState } from '../types/game'
import { createInitialGameState } from '../data/initialGameState'

const SAVE_KEY = 'agro-drone-idle-save'
const SAVE_VERSION = 1

interface SavePayload {
  version: number
  savedAt: number
  state: GameState
}

function canUseLocalStorage(): boolean {
  try {
    return typeof window !== 'undefined' && Boolean(window.localStorage)
  } catch {
    return false
  }
}

function toSerializableState(state: GameState): GameState {
  return {
    resources: state.resources,
    plots: state.plots,
    drones: state.drones,
    selectedPlotId: state.selectedPlotId,
    events: state.events,
    advisorRecommendation: state.advisorRecommendation,
    controlCenterLevel: state.controlCenterLevel,
    automation: state.automation,
    upgradeLevels: state.upgradeLevels,
    upgradeCosts: state.upgradeCosts,
    tick: state.tick,
    incomePerSecond: state.incomePerSecond,
    marketMultiplier: state.marketMultiplier,
    marketBoostTicksRemaining: state.marketBoostTicksRemaining,
    lastSavedAt: Date.now(),
  }
}

function normalizeState(state: GameState): GameState {
  const fresh = createInitialGameState()
  const plots = Array.isArray(state.plots) && state.plots.length > 0 ? state.plots : fresh.plots
  const drones = Array.isArray(state.drones) && state.drones.length > 0 ? state.drones : fresh.drones
  const selectedPlotId = plots.some((plot) => plot.id === state.selectedPlotId)
    ? state.selectedPlotId
    : (plots[0]?.id ?? null)

  return {
    ...fresh,
    ...state,
    resources: { ...fresh.resources, ...state.resources },
    plots,
    drones,
    selectedPlotId,
    events: Array.isArray(state.events) ? state.events.slice(0, 20) : fresh.events,
    automation: { ...fresh.automation, ...state.automation },
    upgradeLevels: { ...fresh.upgradeLevels, ...state.upgradeLevels },
    upgradeCosts: { ...fresh.upgradeCosts, ...state.upgradeCosts },
  }
}

export function loadGameState(): GameState | null {
  if (!canUseLocalStorage()) return null

  try {
    const raw = window.localStorage.getItem(SAVE_KEY)
    if (!raw) return null

    const payload = JSON.parse(raw) as SavePayload
    if (payload.version !== SAVE_VERSION || !payload.state) return null

    return normalizeState(payload.state)
  } catch {
    return null
  }
}

export function saveGameState(state: GameState): void {
  if (!canUseLocalStorage()) return

  const payload: SavePayload = {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    state: toSerializableState(state),
  }

  window.localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
}

export function clearSavedGame(): void {
  if (!canUseLocalStorage()) return
  window.localStorage.removeItem(SAVE_KEY)
}
