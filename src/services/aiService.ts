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
      message: `El Asesor IA detectó baja humedad en ${lowestMoisture.name}. Priorizá riego.`,
    }
  }

  if (metrics.averagePestLevel > 36 || highestPest.pestLevel > 55) {
    return {
      type: 'warning',
      message: `Sube el riesgo de plaga en ${highestPest.name}. Enviá control antes de perder salud.`,
    }
  }

  if (gameState.resources.energy < 22) {
    return {
      type: 'warning',
      message: 'La energía está baja. Dejá cargar los drones o mejorá el centro.',
    }
  }

  if (metrics.readyPlots > 0) {
    return {
      type: 'success',
      message: `${metrics.readyPlots} parcela${metrics.readyPlots > 1 ? 's listas' : ' lista'} para cosechar.`,
    }
  }

  if (gameState.resources.agriData > 80) {
    return {
      type: 'ai',
      message: 'Hay datos suficientes para invertir. Eficiencia de drones rinde rápido.',
    }
  }

  return {
    type: 'info',
    message: `Lectura completa. Salud promedio del cultivo: ${Math.round(metrics.averageHealth)}%.`,
  }
}

export function generateAdvisorRecommendation(gameState: GameState): string {
  const metrics = getFieldMetrics(gameState.plots)
  const lowestMoisture = getLowestMoisturePlot(gameState.plots)
  const highestPest = getHighestPestPlot(gameState.plots)

  if (metrics.averageMoisture < 42 || lowestMoisture.moisture < 30) {
    return `Regá ${lowestMoisture.name}. La humedad es el mayor freno del crecimiento ahora.`
  }

  if (metrics.averagePestLevel > 34 || highestPest.pestLevel > 52) {
    return `Mandá control de plaga a ${highestPest.name}. Protege la próxima cosecha.`
  }

  if (gameState.resources.energy < 25) {
    return 'La energía está justa. Esperá recuperación y luego mejorá el centro.'
  }

  if (metrics.readyPlots > 0) {
    return `Cosechá ${metrics.readyPlots} parcela${metrics.readyPlots > 1 ? 's' : ''} lista${metrics.readyPlots > 1 ? 's' : ''}.`
  }

  if (gameState.resources.agriData >= 50 && gameState.resources.money >= 120) {
    return 'Tenés datos y dinero. Mejorar eficiencia potencia todas las acciones.'
  }

  if (gameState.resources.crops >= 80) {
    return 'La reserva de cosecha está bien. Apuntá a cosecha automática.'
  }

  return 'El campo está equilibrado. Escaneá una parcela y subí batería.'
}

export async function generateOpenAIRecommendation(_gameState: GameState): Promise<string> {
  if (!hasOpenAiKey) {
    return generateAdvisorRecommendation(_gameState)
  }

  return Promise.resolve(
    'Adaptador OpenAI listo: mover esta llamada a backend antes de activar producción.',
  )
}
