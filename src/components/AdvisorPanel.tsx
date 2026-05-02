import { BrainCircuit, Cpu } from 'lucide-react'
import { isOpenAIConfigured } from '../services/aiService'

interface AdvisorPanelProps {
  recommendation: string
}

export function AdvisorPanel({ recommendation }: AdvisorPanelProps) {
  return (
    <div className="rounded-lg border border-cyan-300/15 bg-cyan-400/10 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
          <BrainCircuit className="h-4 w-4" aria-hidden="true" />
          AI Farm Advisor
        </div>
        <div className="inline-flex items-center gap-1 rounded border border-cyan-300/20 px-2 py-1 text-[11px] text-cyan-100">
          <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
          {isOpenAIConfigured() ? 'API ready' : 'Mock mode'}
        </div>
      </div>
      <p className="text-sm leading-6 text-slate-200">{recommendation}</p>
    </div>
  )
}
