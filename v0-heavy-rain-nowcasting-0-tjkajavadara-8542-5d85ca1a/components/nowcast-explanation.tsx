'use client'

import { motion } from 'framer-motion'

export function NowcastExplanation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="glass rounded-lg p-8 w-full max-w-3xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-gray-100 mb-4">About This Prediction</h3>
      
      <div className="space-y-4 text-gray-300 leading-relaxed">
        <p>
          This heavy rain nowcasting system uses a deep learning model trained on satellite imagery to predict heavy rainfall occurrence at a lead time of 3 hours (t+3). The model analyzes multi-spectral satellite data from the INSAT satellite constellation.
        </p>
        
        <p>
          <strong className="text-cyan-400">Grad-CAM Visualization:</strong> The Grad-CAM (Gradient-weighted Class Activation Map) heatmap shows which regions of the input satellite image were most important for the model's prediction. Warmer colors (red/orange) indicate high importance regions that strongly influenced the classification.
        </p>
        
        <p>
          <strong className="text-cyan-400">Lead Time:</strong> This model provides predictions 3 hours in advance, allowing for better preparation and response to heavy rainfall events.
        </p>
        
        <p className="text-sm text-gray-400">
          Probability values above 70% indicate high confidence in heavy rain occurrence, while values below 40% suggest low probability.
        </p>
      </div>
    </motion.div>
  )
}
