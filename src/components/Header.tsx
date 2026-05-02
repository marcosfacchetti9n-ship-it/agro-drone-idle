import { Coins, Database, Droplets, RotateCcw, Sprout, Wheat, Zap } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { formatCurrency, formatNumber } from '../utils/formatters'
import { ResourceBadge } from './ResourceBadge'

export function Header() {
  const resources = useGameStore((state) => state.resources)
  const marketMultiplier = useGameStore((state) => state.marketMultiplier)
  const resetGame = useGameStore((state) => state.resetGame)

  function handleReset() {
    if (window.confirm('Reset AgroDrone Idle progress? This cannot be undone.')) {
      resetGame()
    }
  }

  return (
    <header className="border-b border-emerald-300/10 bg-[#07100d]/95 px-4 py-4 backdrop-blur md:px-6">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-400/10 text-emerald-200">
            <Sprout className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">AgroDrone Idle</h1>
            <p className="text-sm text-slate-400">
              Smart farm command center
              {marketMultiplier > 1 ? (
                <span className="ml-2 rounded border border-amber-300/25 bg-amber-400/10 px-2 py-0.5 text-amber-100">
                  Wheat demand +10%
                </span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ResourceBadge
            icon={Coins}
            label="Money"
            value={formatCurrency(resources.money)}
            tone="money"
          />
          <ResourceBadge
            icon={Wheat}
            label="Crops"
            value={formatNumber(resources.crops)}
            tone="crop"
          />
          <ResourceBadge
            icon={Droplets}
            label="Water"
            value={formatNumber(resources.water)}
            tone="water"
          />
          <ResourceBadge
            icon={Zap}
            label="Energy"
            value={formatNumber(resources.energy)}
            tone="energy"
          />
          <ResourceBadge
            icon={Database}
            label="Agri data"
            value={formatNumber(resources.agriData)}
            tone="data"
          />
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg border border-red-300/20 bg-red-500/10 px-3 text-sm font-semibold text-red-100 transition hover:border-red-300/40 hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-300/40"
            title="Reset progress"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>
    </header>
  )
}
