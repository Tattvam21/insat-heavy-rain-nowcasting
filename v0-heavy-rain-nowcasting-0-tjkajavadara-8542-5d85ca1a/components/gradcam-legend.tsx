'use client'

import { motion } from 'framer-motion'

export function GradCAMLegend() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="w-full space-y-3"
    >
      <h3 className="text-lg font-semibold text-gray-300">Importance Gradient</h3>
      
      {/* Gradient Bar */}
      <div className="glass rounded-lg p-4">
        <div className="h-8 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 via-green-500 via-yellow-500 to-red-500 shadow-lg" />
        
        {/* Labels */}
        <div className="flex justify-between mt-3 text-sm text-gray-400">
          <span>Low Importance</span>
          <span>High Importance</span>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Shows which regions of the image contributed most to the prediction. Red areas had the strongest influence.
      </p>
    </motion.div>
  )
}
