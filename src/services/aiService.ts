import type { EventDraft, GameState, Plot } from '../types/game'
import { getFieldMetrics } from '../utils/calculations'

const hasOpenAiKey = Boolean(import.meta.env.VITE_OPENAI_API_KEY)

function getLowestMoisturePlot(plots: Plot[]): Plot {
  return [...plots].sort((a, b) => a.moisture - b.moisture)[0]
}

function getHighestPestPlot(plots: Plot[]): Plot {
  return [...plots].sort((a, b) => b.pestLevel - a.pestLevel)[0]
}

export function isOpenAIConfigured(): boolean {
  return hasOpenAiKey
}

export function generateFarmEvent(gameState: GameState): EventDraft {
  const metrics = getFieldMetrics(gameState.plots)
  const lowestMoisture = getLowestMoisturePlot(gameState.plots)
  const highestPest = getHighestPestPlot(gameState.plots)

  if (metrics.averageMoisture < 38 || lowestMoisture.moisture < 28) {
    return {
      type: 'ai',
      message: `AI Advisor detected low moisture in plot ${lowestMoisture.name}. Irrigation should be prioritized.`,
    }
  }

  if (metrics.averagePestLevel > 36 || highestPest.pestLevel > 55) {
    return {
      type: 'warning',
      message: `Pest risk is climbing near plot ${highestPest.name}. Dispatch pest control before crop health drops.`,
    }
  }

  if (gameState.resources.energy < 22) {
    return {
      type: 'warning',
      message: 'Energy reserves are low. Let drones recharge or upgrade the control center for better recovery.',
    }
  }

  if (metrics.readyPlots > 0) {
    return {
      type: 'success',
      message: `${metrics.readyPlots} wheat plot${metrics.readyPlots > 1 ? 's are' : ' is'} ready for harvest.`,
    }
  }

  if (gameState.resources.agriData > 80) {
    return {
      type: 'ai',
      message: 'The data lake is rich enough for upgrades. Drone efficiency has the best short-term payoff.',
    }
  }

  return {
    type: 'info',
    message: `Telemetry sweep complete. Average crop health is ${Math.round(metrics.averageHealth)}%.`,
  }
}

export function generateAdvisorRecommendation(gameState: GameState): string {
  const metrics = getFieldMetrics(gameState.plots)
  const lowestMoisture = getLowestMoisturePlot(gameState.plots)
  const highestPest = getHighestPestPlot(gameState.plots)

  if (metrics.averageMoisture < 42 || lowestMoisture.moisture < 30) {
    return `Prioritize irrigation on ${lowestMoisture.name}. Moisture is the main growth bottleneck right now.`
  }

  if (metrics.averagePestLevel > 34 || highestPest.pestLevel > 52) {
    return `Send pest control to ${highestPest.name}. Reducing pest pressure will protect the next harvest cycle.`
  }

  if (gameState.resources.energy < 25) {
    return 'Energy is constrained. Wait for recovery before chaining actions, then consider upgrading the control center.'
  }

  if (metrics.readyPlots > 0) {
    return `Harvest ${metrics.readyPlots} ready plot${metrics.readyPlots > 1 ? 's' : ''} before growth time is wasted.`
  }

  if (gameState.resources.agriData >= 50 && gameState.resources.money >= 120) {
    return 'You have enough data to make upgrades meaningful. Efficiency upgrades will amplify every drone action.'
  }

  if (gameState.resources.crops >= 80) {
    return 'Crop reserves are healthy. Push toward auto harvest to turn mature plots into steady cash flow.'
  }

  return 'Field conditions are balanced. Scan one more plot, then invest in battery capacity for longer action chains.'
}

export async function generateOpenAIRecommendation(_gameState: GameState): Promise<string> {
  if (!hasOpenAiKey) {
    return generateAdvisorRecommendation(_gameState)
  }

  return Promise.resolve(
    'OpenAI adapter placeholder: move this request to a backend before enabling real production calls.',
  )
}
