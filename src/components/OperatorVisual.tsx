export function OperatorVisual() {
  return (
    <div className="relative h-44 overflow-hidden rounded-lg border border-emerald-300/10 bg-[#091613]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute left-1/2 top-8 h-16 w-28 -translate-x-1/2 rounded border border-cyan-300/30 bg-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
        <div className="m-2 h-3 rounded bg-emerald-300/50" />
        <div className="mx-2 h-2 w-16 rounded bg-cyan-300/40" />
        <div className="mx-2 mt-2 h-2 w-20 rounded bg-lime-300/30" />
      </div>
      <div className="absolute left-1/2 top-[84px] h-5 w-10 -translate-x-1/2 rounded-b bg-slate-700" />
      <div className="absolute left-1/2 top-[116px] h-10 w-20 -translate-x-1/2 rounded-t-full border border-emerald-300/20 bg-emerald-500/15" />
      <div className="absolute left-1/2 top-[98px] h-8 w-8 -translate-x-1/2 rounded-full border border-cyan-300/20 bg-slate-800" />
      <div className="absolute bottom-4 left-6 right-6 h-3 rounded-full bg-slate-900" />
    </div>
  )
}
