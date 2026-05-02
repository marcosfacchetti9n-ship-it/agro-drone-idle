import clsx from 'clsx'
import { CheckCircle2, Lock, type LucideIcon } from 'lucide-react'
import { playSound } from '../services/soundService'
import type { Upgrade } from '../types/game'
import { formatCost } from '../utils/formatters'

interface UpgradeCardProps {
  upgrade: Upgrade
  icon: LucideIcon
  affordable: boolean
  onBuy: () => void
}

export function UpgradeCard({ upgrade, icon: Icon, affordable, onBuy }: UpgradeCardProps) {
  const maxed = Boolean(upgrade.maxLevel && upgrade.level && upgrade.level >= upgrade.maxLevel)
  const unlocked = Boolean(upgrade.unlocked)
  const disabled = unlocked || maxed || !affordable

  return (
    <article className="rounded-2xl border border-white bg-white/80 p-2 shadow-sm" title={upgrade.description}>
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-200 to-cyan-200 text-emerald-800">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black text-slate-950">{upgrade.name}</h3>
            {upgrade.level ? <p className="text-[11px] font-medium text-slate-500">Nv. {upgrade.level}</p> : null}
          </div>
        </div>
        {unlocked ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
        ) : maxed ? (
          <CheckCircle2 className="h-4 w-4 text-cyan-600" aria-hidden="true" />
        ) : (
          <Lock className="h-4 w-4 text-slate-300" aria-hidden="true" />
        )}
      </div>

      <p className="line-clamp-1 min-h-4 text-[11px] leading-4 text-slate-500">{upgrade.description}</p>

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          playSound('upgrade')
          onBuy()
        }}
        className={clsx(
          'mt-1.5 flex w-full items-center justify-center rounded-xl border px-2 py-1 text-xs font-black transition focus:outline-none focus:ring-2 focus:ring-emerald-300/50',
          disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
            : 'border-emerald-200 bg-emerald-500 text-white hover:bg-emerald-600',
        )}
      >
        {unlocked ? 'Activo' : maxed ? 'Máx.' : formatCost(upgrade.cost)}
      </button>
    </article>
  )
}
