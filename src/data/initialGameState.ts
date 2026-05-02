import type { GameState, Plot } from '../types/game'
import { BASE_UPGRADE_COSTS } from '../utils/balancing'

const initialPlots: Array<Pick<Plot, 'name' | 'cropHealth' | 'moisture' | 'pestLevel' | 'growth'>> = [
  { name: 'A1', cropHealth: 78, moisture: 62, pestLevel: 12, growth: 18 },
  { name: 'A2', cropHealth: 74, moisture: 56, pestLevel: 18, growth: 22 },
  { name: 'A3', cropHealth: 70, moisture: 48, pestLevel: 24, growth: 15 },
  { name: 'B1', cropHealth: 82, moisture: 67, pestLevel: 10, growth: 26 },
  { name: 'B2', cropHealth: 76, moisture: 52, pestLevel: 20, growth: 20 },
  { name: 'B3', cropHealth: 68, moisture: 44, pestLevel: 28, growth: 14 },
  { name: 'C1', cropHealth: 73, moisture: 58, pestLevel: 16, growth: 19 },
  { name: 'C2', cropHealth: 69, moisture: 46, pestLevel: 25, growth: 12 },
  { name: 'C3', cropHealth: 80, moisture: 64, pestLevel: 14, growth: 24 },
]

export function createInitialPlots(): Plot[] {
  return initialPlots.map((plot) => ({
    id: `plot-${plot.name.toLowerCase()}`,
    name: plot.name,
    cropType: 'Wheat',
    cropHealth: plot.cropHealth,
    moisture: plot.moisture,
    pestLevel: plot.pestLevel,
    growth: plot.growth,
    status: 'idle',
  }))
}

export function createInitialGameState(): GameState {
  const now = Date.now()

  return {
    resources: {
      money: 100,
      crops: 0,
      water: 80,
      energy: 100,
      agriData: 0,
    },
    plots: createInitialPlots(),
    drones: [
      {
        id: 'drone-1',
        name: 'Scout-01',
        type: 'hybrid',
        level: 1,
        battery: 100,
        maxBattery: 100,
        efficiency: 1,
        status: 'idle',
      },
    ],
    selectedPlotId: 'plot-b2',
    events: [
      {
        id: `event-${now}`,
        type: 'info',
        message: 'Control station online. Scout-01 is ready for field operations.',
        timestamp: now,
      },
    ],
    advisorRecommendation:
      'Baseline telemetry is stable. Start by scanning B2, then water any plot below 45% moisture.',
    controlCenterLevel: 1,
    automation: {
      watering: false,
      scanning: false,
      harvesting: false,
    },
    upgradeLevels: {
      droneEfficiency: 1,
      droneBattery: 1,
      controlCenter: 1,
    },
    upgradeCosts: { ...BASE_UPGRADE_COSTS },
    tick: 0,
    incomePerSecond: 0,
    marketMultiplier: 1,
    marketBoostTicksRemaining: 0,
    lastSavedAt: now,
  }
}
