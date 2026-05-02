import { Activity, BrainCircuit, Monitor, RadioTower } from 'lucide-react'
import { useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import { getFieldMetrics, getFieldStatus } from '../utils/calculations'
import { formatCurrency } from '../utils/formatters'
import { AdvisorPanel } from './AdvisorPanel'
import { OperatorVisual } from './OperatorVisual'

export function OperatorStation() {
  const plots = useGameStore((state) => state.plots)
  const drones = useGameStore((state) => state.drones)
  const controlCenterLevel = useGameStore((state) => state.controlCenterLevel)
  const incomePerSecond = useGameStore((state) => state.incomePerSecond)
  const advisorRecommendation = useGameStore((state) => state.advisorRecommendation)
  const analyzeField = useGameStore((state) => state.analyzeField)

  const metrics = useMemo(() => getFieldMetrics(plots), [plots])
  const fieldStatus = getFieldStatus(metrics)

  return (
    <aside className="panel flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-500">Operator station</p>
          <h2 className="text-lg font-semibold text-white">Control desk</h2>
        </div>
        <Monitor className="h-5 w-5 text-cyan-200" aria-hidden="true" />
      </div>

      <OperatorVisual />

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-slate-700/70 bg-slate-900/60 p-3">
          <div className="flex items-center gap-2 text-slate-400">
            <RadioTower className="h-4 w-4" aria-hidden="true" />
            Center
          </div>
          <div className="mt-1 text-lg font-semibold text-white">Lv. {controlCenterLevel}</div>
        </div>
        <div className="rounded-lg border border-slate-700/70 bg-slate-900/60 p-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Activity className="h-4 w-4" aria-hidden="true" />
            Income
          </div>
          <div className="mt-1 text-lg font-semibold text-emerald-100">
            {formatCurrency(incomePerSecond)}/s
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700/70 bg-slate-900/60 p-3">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-400">Field status</span>
          <span className="font-semibold text-emerald-100">{fieldStatus}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-400">
          <div>
            <div className="text-base font-semibold text-white">{Math.round(metrics.averageHealth)}%</div>
            Health
          </div>
          <div>
            <div className="text-base font-semibold text-white">{Math.round(metrics.averageMoisture)}%</div>
            Moisture
          </div>
          <div>
            <div className="text-base font-semibold text-white">{drones.length}</div>
            Drones
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={analyzeField}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
      >
        <BrainCircuit className="h-4 w-4" aria-hidden="true" />
        Analyze field with AI
      </button>

      <AdvisorPanel recommendation={advisorRecommendation} />
    </aside>
  )
}
