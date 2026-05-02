import type { ResourceCost, ResourceKey } from '../types/game'

const resourceLabels: Record<ResourceKey, string> = {
  money: '$',
  crops: 'cosecha',
  water: 'agua',
  energy: 'energía',
  agriData: 'datos',
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 10_000) return `${(value / 1_000).toFixed(1)}k`
  if (value >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 0 })
  return value.toLocaleString(undefined, { maximumFractionDigits: value < 10 ? 1 : 0 })
}

export function formatCurrency(value: number): string {
  return `$${formatNumber(value)}`
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function formatCost(cost: ResourceCost): string {
  return (Object.entries(cost) as Array<[ResourceKey, number]>)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => `${resourceLabels[key]} ${formatNumber(value)}`)
    .join(' + ')
}

export function formatResourceName(key: ResourceKey): string {
  return resourceLabels[key]
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
