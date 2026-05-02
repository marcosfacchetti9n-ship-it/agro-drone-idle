import { Activity, BrainCircuit, Monitor, RadioTower } from 'lucide-react'
import { useMemo } from 'react'
import { playSound } from '../services/soundService'
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
    <aside className="panel flex flex-col gap-3 p-3 xl:row-span-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase text-emerald-600">Estación</p>
          <h2 className="text-lg font-black text-slate-950">Operador</h2>
        </div>
        <Monitor className="h-5 w-5 text-cyan-600" aria-hidden="true" />
      </div>

      <OperatorVisual />

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
          <div className="flex items-center gap-2 text-slate-500">
            <RadioTower className="h-4 w-4" aria-hidden="true" />
            Centro
          </div>
          <div className="mt-1 text-lg font-black text-emerald-800">Nv. {controlCenterLevel}</div>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3">
          <div className="flex items-center gap-2 text-slate-500">
            <Activity className="h-4 w-4" aria-hidden="true" />
            Ingreso
          </div>
          <div className="mt-1 text-lg font-black text-amber-800">
            {formatCurrency(incomePerSecond)}/s
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-lime-100 bg-lime-50 p-3">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-500">Campo</span>
          <span className="font-bold text-lime-800">{fieldStatus}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
          <div>
            <div className="text-base font-black text-slate-950">{Math.round(metrics.averageHealth)}%</div>
            Salud
          </div>
          <div>
            <div className="text-base font-black text-slate-950">{Math.round(metrics.averageMoisture)}%</div>
            Humedad
          </div>
          <div>
            <div className="text-base font-black text-slate-950">{drones.length}</div>
            Drones
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          playSound('ai')
          analyzeField()
        }}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
      >
        <BrainCircuit className="h-4 w-4" aria-hidden="true" />
        Analizar con IA
      </button>

      <AdvisorPanel recommendation={advisorRecommendation} />
    </aside>
  )
}
