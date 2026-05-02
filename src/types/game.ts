export type ResourceKey = 'money' | 'crops' | 'water' | 'energy' | 'agriData'

export type PlotStatus = 'idle' | 'watering' | 'scanning' | 'harvesting' | 'pest_control'

export type DroneType = 'scout' | 'irrigation' | 'harvester' | 'hybrid'

export type DroneStatus = 'idle' | 'scanning' | 'watering' | 'harvesting' | 'pest_control' | 'charging'

export type FarmAction = 'scan' | 'water' | 'pestControl' | 'harvest'

export type EventType = 'info' | 'warning' | 'success' | 'ai'

export type AutomationKey = 'watering' | 'scanning' | 'harvesting'

export type UpgradeId =
  | 'newDrone'
  | 'droneEfficiency'
  | 'droneBattery'
  | 'controlCenter'
  | 'autoWatering'
  | 'autoScanning'
  | 'autoHarvesting'

export interface Resources {
  money: number
  crops: number
  water: number
  energy: number
  agriData: number
}

export type ResourceCost = Partial<Resources>

export interface Plot {
  id: string
  name: string
  cropType: string
  cropHealth: number
  moisture: number
  pestLevel: number
  growth: number
  status: PlotStatus
  lastScannedTick?: number
}

export interface Drone {
  id: string
  name: string
  type: DroneType
  level: number
  battery: number
  maxBattery: number
  efficiency: number
  status: DroneStatus
  assignedPlotId?: string
}

export interface GameEvent {
  id: string
  type: EventType
  message: string
  timestamp: number
}

export interface EventDraft {
  type: EventType
  message: string
}

export interface AutomationState {
  watering: boolean
  scanning: boolean
  harvesting: boolean
}

export interface UpgradeLevels {
  droneEfficiency: number
  droneBattery: number
  controlCenter: number
}

export interface UpgradeCosts {
  newDrone: ResourceCost
  droneEfficiency: ResourceCost
  droneBattery: ResourceCost
  controlCenter: ResourceCost
  autoWatering: ResourceCost
  autoScanning: ResourceCost
  autoHarvesting: ResourceCost
}

export interface Upgrade {
  id: UpgradeId
  name: string
  description: string
  cost: ResourceCost
  level?: number
  maxLevel?: number
  unlocked?: boolean
}

export interface FieldMetrics {
  averageHealth: number
  averageMoisture: number
  averagePestLevel: number
  averageGrowth: number
  readyPlots: number
  lowMoisturePlots: number
  highPestPlots: number
}

export interface GameState {
  resources: Resources
  plots: Plot[]
  drones: Drone[]
  selectedPlotId: string | null
  events: GameEvent[]
  advisorRecommendation: string
  controlCenterLevel: number
  automation: AutomationState
  upgradeLevels: UpgradeLevels
  upgradeCosts: UpgradeCosts
  tick: number
  incomePerSecond: number
  marketMultiplier: number
  marketBoostTicksRemaining: number
  lastSavedAt: number
}
