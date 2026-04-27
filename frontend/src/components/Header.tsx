export default function Header() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-5 text-white">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -right-4 top-4 h-20 w-20 rounded-full bg-white/10" />

      <div className="relative flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-2xl shadow-inner backdrop-blur-sm">
            🏥
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Medical Assistant</h1>
            <p className="text-xs text-blue-100">Powered by GPT-4o &amp; RAG</p>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
          <span className="text-xs font-medium text-white/90">Online</span>
        </div>
      </div>
    </div>
  )
}
