export function AnimatedGradientBg() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
      <div className="orb orb-one bg-blue-500" />
      <div className="orb orb-two bg-cyan-400" />
      <div className="orb orb-three bg-indigo-500" />
    </div>
  )
}
