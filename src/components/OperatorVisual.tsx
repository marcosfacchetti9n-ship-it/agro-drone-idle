export function OperatorVisual() {
  return (
    <div className="relative h-32 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-lime-100 via-cyan-50 to-amber-50">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.12)_1px,transparent_1px)] bg-[size:22px_22px]" />
      <div className="absolute left-1/2 top-5 h-14 w-28 -translate-x-1/2 rounded-2xl border border-cyan-200 bg-slate-900 shadow-[0_14px_28px_rgba(6,182,212,0.22)]">
        <div className="m-2 h-3 rounded-full bg-lime-300" />
        <div className="mx-2 h-2 w-16 rounded-full bg-cyan-300" />
        <div className="mx-2 mt-2 h-2 w-20 rounded-full bg-amber-300" />
      </div>
      <div className="absolute left-1/2 top-[68px] h-4 w-10 -translate-x-1/2 rounded-b-xl bg-slate-500" />
      <div className="absolute left-1/2 top-[94px] h-9 w-20 -translate-x-1/2 rounded-t-full border border-emerald-200 bg-emerald-300/50" />
      <div className="absolute left-1/2 top-[78px] h-8 w-8 -translate-x-1/2 rounded-full border border-cyan-200 bg-amber-200" />
      <div className="absolute bottom-3 left-6 right-6 h-2 rounded-full bg-emerald-700/70" />
    </div>
  )
}
