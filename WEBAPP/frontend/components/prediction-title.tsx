'use client'

interface PredictionTitleProps {
  prediction: string
  probability: number
}

export function PredictionTitle({ prediction, probability }: PredictionTitleProps) {
  const normalizedPrediction = prediction.trim().toLowerCase()
  const isHeavyRain =
    normalizedPrediction === 'heavy rain' ||
    normalizedPrediction === 'heavy rain detected' ||
    normalizedPrediction === 'heavy rainfall'
  const boundedProbability = Math.max(0, Math.min(1, probability))
  const confidence = Math.round(boundedProbability * 100)
  const riskBand = confidence < 40 ? 'low' : confidence < 70 ? 'medium' : 'high'
  const title = isHeavyRain ? 'Heavy Rain Risk' : 'No Heavy Rain Signal'
  const statusPill =
    riskBand === 'high'
      ? 'Severe Alert'
      : riskBand === 'medium'
        ? 'Watch'
        : 'Stable'
  const description = isHeavyRain
    ? 'High-impact rainfall conditions are likely within the next 90 minutes.'
    : 'No heavy rainfall signature is currently predicted for the next 90 minutes.'
  const shellClass =
    riskBand === 'high'
      ? 'border-red-400/35 bg-gradient-to-r from-red-500/15 via-rose-500/10 to-orange-500/10'
      : riskBand === 'medium'
        ? 'border-yellow-400/35 bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-orange-500/10'
        : 'border-emerald-400/35 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/10'
  const iconShellClass =
    riskBand === 'high'
      ? 'bg-red-500/20 text-red-300 border-red-300/35'
      : riskBand === 'medium'
        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-300/35'
        : 'bg-emerald-500/20 text-emerald-300 border-emerald-300/35'
  const pillClass =
    riskBand === 'high'
      ? 'bg-red-500/20 text-red-200 border-red-300/35'
      : riskBand === 'medium'
        ? 'bg-yellow-500/20 text-yellow-200 border-yellow-300/35'
        : 'bg-emerald-500/20 text-emerald-200 border-emerald-300/35'
  const titleColor =
    riskBand === 'high'
      ? 'text-red-200'
      : riskBand === 'medium'
        ? 'text-yellow-200'
        : 'text-emerald-200'
  const statusIcon = riskBand === 'high' ? '!' : riskBand === 'medium' ? '~' : 'OK'

  return (
    <div className={`w-full rounded-2xl border p-4 md:p-5 ${shellClass}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${pillClass}`}>
          {statusPill}
        </span>
        <span className="text-xs text-slate-300">Confidence: {confidence}%</span>
      </div>

      <div className="flex items-start gap-3">
        <div className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${iconShellClass}`}>
          {statusIcon}
        </div>
        <div className="min-w-0">
          <h2 className={`text-lg sm:text-xl font-bold ${titleColor}`}>{title}</h2>
          <p className="mt-1 text-sm text-slate-300">{description}</p>
        </div>
      </div>
    </div>
  )
}
