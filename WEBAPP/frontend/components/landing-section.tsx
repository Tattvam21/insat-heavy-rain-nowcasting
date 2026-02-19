'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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

  if (isExpanded) {
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setFileName(file.name)
      onFileSelect(file)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center transition-all duration-600 px-4 md:px-6">
      <div className="w-full max-w-2xl opacity-100 transition-opacity duration-500">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-balance mb-6 animate-float">
          Heavy Rain{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Nowcasting
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-300 text-center mb-12 text-balance">
          AI-powered satellite prediction system
        </p>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-8">
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
            </CardContent>
          </Card>

          <Button
            onClick={onPredict}
            disabled={!fileName || isLoading}
            size="lg"
            className="w-full"
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
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Upload a satellite image in NPY format to get a heavy rain prediction with Grad-CAM visualization.
        </p>
      </div>
    </div>
  )
}
