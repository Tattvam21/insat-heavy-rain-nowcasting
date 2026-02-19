'use client'

import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface ProbabilityBarProps {
  probability: number
}

export function ProbabilityBar({ probability }: ProbabilityBarProps) {
  const [displayProbability, setDisplayProbability] = useState(0)
  const boundedProbability = Math.max(0, Math.min(probability, 1))
  const targetPercent = boundedProbability * 100

  useEffect(() => {
    const duration = 1000
    const steps = 60
    const increment = targetPercent / steps
    let current = 0

    const interval = setInterval(() => {
      current += increment
      if (current >= targetPercent) {
        setDisplayProbability(targetPercent)
        clearInterval(interval)
      } else {
        setDisplayProbability(current)
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [targetPercent])

  let barColor = 'from-green-500 to-green-400'
  let textColor = 'text-green-400'

  if (boundedProbability >= 0.4 && boundedProbability < 0.7) {
    barColor = 'from-yellow-500 to-orange-400'
    textColor = 'text-yellow-400'
  } else if (boundedProbability >= 0.7) {
    barColor = 'from-red-500 to-red-400'
    textColor = 'text-red-400'
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-300">Heavy Rain Probability</h3>
        <Badge
          variant={
            boundedProbability >= 0.7
              ? 'danger'
              : boundedProbability >= 0.4
                ? 'warning'
                : 'success'
          }
          className={`text-sm ${textColor}`}
        >
          {Math.round(displayProbability)}%
        </Badge>
      </div>

      <Progress value={displayProbability} indicatorClassName={`bg-gradient-to-r ${barColor} shadow-lg`} />

      <div className="flex justify-between text-xs text-gray-400 pt-2">
        <span>Low Risk</span>
        <span>Medium</span>
        <span>High Risk</span>
      </div>
    </div>
  )
}
