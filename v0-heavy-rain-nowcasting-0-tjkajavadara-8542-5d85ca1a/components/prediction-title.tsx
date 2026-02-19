'use client'

import { motion } from 'framer-motion'

interface PredictionTitleProps {
  prediction: boolean
  probability: number
}

export function PredictionTitle({ prediction, probability }: PredictionTitleProps) {
  const isHeavyRain = prediction
  const textColor = isHeavyRain ? 'text-red-400' : 'text-green-400'
  const glowClass = isHeavyRain ? 'glow-red' : 'glow-green'
  const title = isHeavyRain ? 'Heavy Rain Detected' : 'No Heavy Rain'

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`flex items-center justify-center gap-3 ${glowClass} rounded-lg p-6 w-fit mx-auto`}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className={`w-4 h-4 rounded-full ${isHeavyRain ? 'bg-red-500' : 'bg-green-500'}`} />
      </motion.div>
      <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${textColor}`}>{title}</h2>
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className={`w-4 h-4 rounded-full ${isHeavyRain ? 'bg-red-500' : 'bg-green-500'}`} />
      </motion.div>
    </motion.div>
  )
}
