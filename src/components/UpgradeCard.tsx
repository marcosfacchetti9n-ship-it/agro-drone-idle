import clsx from 'clsx'
import { CheckCircle2, Lock, type LucideIcon } from 'lucide-react'
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
    <article className="rounded-lg border border-slate-700/70 bg-slate-950/70 p-3">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-300/15 bg-emerald-400/10 text-emerald-100">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{upgrade.name}</h3>
            {upgrade.level ? <p className="text-xs text-slate-500">Level {upgrade.level}</p> : null}
          </div>
        </div>
        {unlocked ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-200" aria-hidden="true" />
        ) : maxed ? (
          <CheckCircle2 className="h-4 w-4 text-cyan-200" aria-hidden="true" />
        ) : (
          <Lock className="h-4 w-4 text-slate-500" aria-hidden="true" />
        )}
      </div>

      <p className="min-h-[44px] text-sm leading-5 text-slate-400">{upgrade.description}</p>

      <button
        type="button"
        disabled={disabled}
        onClick={onBuy}
        className={clsx(
          'mt-4 flex w-full items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-300/40',
          disabled
            ? 'cursor-not-allowed border-slate-700 bg-slate-900 text-slate-500'
            : 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100 hover:border-emerald-300/40 hover:bg-emerald-400/20',
        )}
      >
        {unlocked ? 'Online' : maxed ? 'Maxed' : formatCost(upgrade.cost)}
      </button>
    </article>
  )
}
