import { useState } from 'react'
import { Coins, Database, Droplets, RotateCcw, Sprout, Volume2, VolumeX, Wheat, Zap } from 'lucide-react'
import { isSoundEnabled, playSound, setSoundEnabled } from '../services/soundService'
import { useGameStore } from '../store/gameStore'
import { formatCurrency, formatNumber } from '../utils/formatters'
import { ResourceBadge } from './ResourceBadge'

export function Header() {
  const resources = useGameStore((state) => state.resources)
  const marketMultiplier = useGameStore((state) => state.marketMultiplier)
  const resetGame = useGameStore((state) => state.resetGame)
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled())

  function handleSoundToggle() {
    const nextValue = !soundOn
    setSoundOn(nextValue)
    setSoundEnabled(nextValue)
    if (nextValue) playSound('success')
  }

  function handleReset() {
    if (window.confirm('¿Reiniciar el progreso de AgroDrone Idle? Esta acción no se puede deshacer.')) {
      playSound('reset')
      resetGame()
    }
  }

  return (
    <header className="h-[76px] border-b border-white/70 bg-white/75 px-3 py-2.5 backdrop-blur md:px-4">
      <div className="mx-auto flex h-full max-w-[1780px] items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-300 via-emerald-300 to-cyan-300 text-emerald-950 shadow-sm">
            <Sprout className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-950 md:text-2xl">AgroDrone Idle</h1>
            <p className="text-xs font-medium text-slate-500">
              Centro agrícola inteligente
              {marketMultiplier > 1 ? (
                <span className="ml-2 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-amber-800">
                  Trigo +10%
                </span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="hidden min-w-0 flex-wrap items-center justify-end gap-2 md:flex">
          <ResourceBadge
            icon={Coins}
            label="Dinero"
            value={formatCurrency(resources.money)}
            tone="money"
          />
          <ResourceBadge
            icon={Wheat}
            label="Cosecha"
            value={formatNumber(resources.crops)}
            tone="crop"
          />
          <ResourceBadge
            icon={Droplets}
            label="Agua"
            value={formatNumber(resources.water)}
            tone="water"
          />
          <ResourceBadge
            icon={Zap}
            label="Energía"
            value={formatNumber(resources.energy)}
            tone="energy"
          />
          <ResourceBadge
            icon={Database}
            label="Datos"
            value={formatNumber(resources.agriData)}
            tone="data"
          />
          <button
            type="button"
            onClick={handleSoundToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700 transition hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300/50"
            title={soundOn ? 'Silenciar sonidos' : 'Activar sonidos'}
            aria-label={soundOn ? 'Silenciar sonidos' : 'Activar sonidos'}
          >
            {soundOn ? <Volume2 className="h-4 w-4" aria-hidden="true" /> : <VolumeX className="h-4 w-4" aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300/50"
            title="Reiniciar progreso"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reiniciar
          </button>
        </div>
      </div>
    </header>
  )
}
