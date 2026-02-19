'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RiskLevelDisplayProps {
  probability: number
}

export function RiskLevelDisplay({ probability }: RiskLevelDisplayProps) {
  const boundedProbability = Math.max(0, Math.min(probability, 1))
  let riskLevel = 'Low'
  let riskColor = 'text-emerald-300'
  let backgroundColor = 'bg-emerald-500/10 border-emerald-300/30'
  let badgeVariant: 'success' | 'warning' | 'danger' = 'success'
  let guidance = 'Current pattern suggests low heavy-rain likelihood.'
  let meterClass = 'from-emerald-400/85 to-emerald-300/85'

  if (boundedProbability >= 0.4 && boundedProbability < 0.7) {
    riskLevel = 'Medium'
    riskColor = 'text-amber-300'
    backgroundColor = 'bg-amber-500/10 border-amber-300/30'
    badgeVariant = 'warning'
    guidance = 'Conditions are mixed; keep monitoring the next nowcast cycle.'
    meterClass = 'from-amber-400/85 to-orange-300/85'
  } else if (boundedProbability >= 0.7) {
    riskLevel = 'High'
    riskColor = 'text-rose-300'
    backgroundColor = 'bg-rose-500/10 border-rose-300/30'
    badgeVariant = 'danger'
    guidance = 'Strong heavy-rain signature detected; prioritize alert readiness.'
    meterClass = 'from-rose-400/85 to-red-300/85'
  }

  return (
    <Card className={`w-full ${backgroundColor}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-300/90">Risk Level</p>
          <Badge variant={badgeVariant} className={`text-xs ${riskColor}`}>
            {riskLevel} Risk
          </Badge>
        </div>

        <div className="h-2 w-full rounded-full bg-slate-800/70 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${meterClass} transition-all duration-500`}
            style={{ width: `${Math.max(8, boundedProbability * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>

        <p className="text-xs text-slate-300/90 leading-relaxed">{guidance}</p>
      </CardContent>
    </Card>
  )
}
