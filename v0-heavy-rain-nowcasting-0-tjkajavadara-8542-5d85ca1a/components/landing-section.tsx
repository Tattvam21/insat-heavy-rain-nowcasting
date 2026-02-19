'use client'

import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface LandingSectionProps {
  isExpanded: boolean
  onFileSelect: (file: File) => void
  onPredict: () => void
  isLoading: boolean
}

export function LandingSection({
  isExpanded,
  onFileSelect,
  onPredict,
  isLoading,
}: LandingSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setFileName(file.name)
      onFileSelect(file)
    }
  }

  const containerVariants = {
    initial: { opacity: 1 },
    expanded: {
      opacity: isExpanded ? 0.5 : 1,
      transition: { duration: 0.6 },
    },
  }

  const titleVariants = {
    initial: {
      fontSize: isExpanded ? '2rem' : '4rem',
      position: isExpanded ? 'fixed' as const : 'relative' as const,
      top: isExpanded ? '1.5rem' : 'auto',
      left: isExpanded ? '2rem' : 'auto',
      zIndex: isExpanded ? 50 : 'auto',
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      animate={isExpanded ? 'expanded' : 'initial'}
      className={`min-h-screen flex items-center justify-center transition-all duration-600 px-4 md:px-6 ${
        isExpanded ? 'pointer-events-none' : ''
      }`}
    >
      <div className={`w-full max-w-2xl ${isExpanded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-balance mb-6 animate-float"
        >
          Heavy Rain{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Nowcasting
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-gray-300 text-center mb-12 text-balance"
        >
          AI-powered satellite prediction system
        </motion.p>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6"
        >
          {/* File Input */}
          <div className="glass rounded-lg p-8">
            <input
              ref={fileInputRef}
              type="file"
              accept=".npy"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload NPY file"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 px-6 border-2 border-dashed border-cyan-400/50 rounded-lg hover:border-cyan-400 hover:bg-cyan-400/5 transition-colors duration-300 group"
            >
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-cyan-400/70 group-hover:text-cyan-400 transition-colors"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                <p className="mt-3 text-gray-300 group-hover:text-gray-200 transition-colors">
                  {fileName ? (
                    <>
                      <span className="font-semibold text-cyan-400">{fileName}</span>
                      <span className="text-gray-400"> selected</span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">Click to upload</span>
                      <span className="text-gray-400"> or drag and drop</span>
                    </>
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-1">.npy files only</p>
              </div>
            </button>
          </div>

          {/* Predict Button */}
          <Button
            onClick={onPredict}
            disabled={!fileName || isLoading}
            size="lg"
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Predicting...
              </div>
            ) : (
              'Predict Heavy Rain'
            )}
          </Button>
        </motion.div>

        {/* Info Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          Upload a satellite image in NPY format to get a heavy rain prediction with Grad-CAM visualization.
        </motion.p>
      </div>
    </motion.div>
  )
}
