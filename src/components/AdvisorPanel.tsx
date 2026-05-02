import { BrainCircuit, Cpu } from 'lucide-react'
import { isOpenAIConfigured } from '../services/aiService'

interface AdvisorPanelProps {
  recommendation: string
}

export function AdvisorPanel({ recommendation }: AdvisorPanelProps) {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-bold text-cyan-800">
          <BrainCircuit className="h-4 w-4" aria-hidden="true" />
          Asesor IA
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-white/70 px-2 py-1 text-[10px] font-bold text-cyan-700">
          <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
          {isOpenAIConfigured() ? 'API lista' : 'Simulado'}
        </div>
      </div>
      <p className="line-clamp-4 text-sm leading-5 text-slate-700">{recommendation}</p>
    </div>
  )
}
