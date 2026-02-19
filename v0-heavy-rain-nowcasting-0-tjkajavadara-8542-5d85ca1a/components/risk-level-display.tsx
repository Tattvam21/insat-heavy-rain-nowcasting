'use client'

import { motion } from 'framer-motion'

interface RiskLevelDisplayProps {
  probability: number
}

export function RiskLevelDisplay({ probability }: RiskLevelDisplayProps) {
  let riskLevel = 'Low'
  let riskEmoji = '🟢'
  let riskColor = 'text-green-400'
  let backgroundColor = 'bg-green-400/10'

  if (probability >= 40 && probability < 70) {
    riskLevel = 'Medium'
    riskEmoji = '🟡'
    riskColor = 'text-yellow-400'
    backgroundColor = 'bg-yellow-400/10'
  } else if (probability >= 70) {
    riskLevel = 'High'
    riskEmoji = '🔴'
    riskColor = 'text-red-400'
    backgroundColor = 'bg-red-400/10'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={`glass rounded-lg p-6 w-fit mx-auto ${backgroundColor}`}
    >
      <div className="flex items-center gap-4">
        <span className="text-3xl">{riskEmoji}</span>
        <div>
          <p className="text-sm text-gray-400">Risk Level</p>
          <p className={`text-2xl font-bold ${riskColor}`}>{riskLevel}</p>
        </div>
      </div>
    </motion.div>
  )
}
