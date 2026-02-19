'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { PredictionTitle } from './prediction-title'
import { ProbabilityBar } from './probability-bar'
import { RiskLevelDisplay } from './risk-level-display'
import { VisualizationContainer } from './visualization-container'
import { GradCAMLegend } from './gradcam-legend'
import { NowcastExplanation } from './nowcast-explanation'

interface ResultsSectionProps {
  isVisible: boolean
  prediction: boolean
  probability: number
  inputPatchUrl: string
  gradCamUrl: string
}

export function ResultsSection({
  isVisible,
  prediction,
  probability,
  inputPatchUrl,
  gradCamUrl,
}: ResultsSectionProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full py-12 md:py-20 px-4 md:px-6"
        >
          <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
            {/* Prediction Title */}
            <PredictionTitle prediction={prediction} probability={probability} />

            {/* Probability Bar */}
            <div className="max-w-2xl mx-auto">
              <ProbabilityBar probability={probability} />
            </div>

            {/* Risk Level */}
            <RiskLevelDisplay probability={probability} />

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

            {/* Visualizations */}
            <VisualizationContainer
              inputPatchUrl={inputPatchUrl}
              gradCamUrl={gradCamUrl}
            />

            {/* Legend */}
            <div className="max-w-2xl mx-auto">
              <GradCAMLegend />
            </div>

            {/* Explanation */}
            <NowcastExplanation />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
