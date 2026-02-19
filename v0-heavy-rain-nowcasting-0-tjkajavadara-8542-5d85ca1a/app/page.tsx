'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedGradientBg } from '@/components/animated-gradient-bg'
import { LandingSection } from '@/components/landing-section'
import { ResultsSection } from '@/components/results-section'

interface PredictionResult {
  probability: number
  prediction: boolean
  grad_cam: string
  input_patch: string
}

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setError(null)
  }

  const handlePredict = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setError(null)
    setIsExpanded(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Prediction failed: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during prediction'
      setError(errorMessage)
      console.error('Prediction error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <AnimatedGradientBg />

      <div className="relative z-10">
        {/* Landing Section */}
        <LandingSection
          isExpanded={isExpanded}
          onFileSelect={handleFileSelect}
          onPredict={handlePredict}
          isLoading={isLoading}
        />

        {/* Results Section */}
        {result && (
          <ResultsSection
            isVisible={true}
            prediction={result.prediction}
            probability={result.probability}
            inputPatchUrl={result.input_patch}
            gradCamUrl={result.grad_cam}
          />
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 20, x: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-4 right-4 glass rounded-lg p-4 max-w-sm text-red-400 border border-red-500/50 z-50"
            >
              <p className="font-semibold flex items-center gap-2">
                <span>Error</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-xs hover:text-red-300 transition-colors"
                >
                  ✕
                </button>
              </p>
              <p className="text-sm mt-1">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="glass rounded-lg p-8 max-w-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-3 border-cyan-400/30 rounded-full animate-pulse" />
                  <div className="absolute inset-0 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-gray-300 text-center">
                  <span className="font-semibold">Processing prediction...</span>
                  <span className="text-sm text-gray-400 block mt-1">This may take a moment</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
