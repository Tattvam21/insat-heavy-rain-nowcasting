'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ProbabilityBarProps {
  probability: number
}

export function ProbabilityBar({ probability }: ProbabilityBarProps) {
  const [displayProbability, setDisplayProbability] = useState(0)

  useEffect(() => {
    // Animate from 0 to actual probability
    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = probability / steps
    let current = 0
    
    const interval = setInterval(() => {
      current += increment
      if (current >= probability) {
        setDisplayProbability(probability)
        clearInterval(interval)
      } else {
        setDisplayProbability(Math.min(current, 100))
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [probability])

  // Determine color based on probability
  let barColor = 'from-green-500 to-green-400'
  let textColor = 'text-green-400'
  
  if (probability >= 40 && probability < 70) {
    barColor = 'from-yellow-500 to-orange-400'
    textColor = 'text-yellow-400'
  } else if (probability >= 70) {
    barColor = 'from-red-500 to-red-400'
    textColor = 'text-red-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-4 w-full"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-300">Heavy Rain Probability</h3>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className={`text-2xl font-bold ${textColor}`}
        >
          {Math.round(displayProbability)}%
        </motion.div>
      </div>

      {/* Progress Bar Container */}
      <div className="glass rounded-full h-4 overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${displayProbability}%` }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${barColor} shadow-lg`}
        />
      </div>

      {/* Risk Level */}
      <div className="flex justify-between text-xs text-gray-400 pt-2">
        <span>Low Risk</span>
        <span>Medium</span>
        <span>High Risk</span>
      </div>
    </motion.div>
  )
}
