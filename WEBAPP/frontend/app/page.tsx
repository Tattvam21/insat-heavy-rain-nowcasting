'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatedGradientBg } from '@/components/animated-gradient-bg'
import { LandingSection } from '@/components/landing-section'
import { ResultsSection } from '@/components/results-section'

interface PredictionResult {
  probability: number
  prediction: string
  gradcam: string
  inputImages: string[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000'

function normalizeResult(payload: unknown): PredictionResult {
  const data = payload as Record<string, unknown>
  const rawProbability = Number(data.probability ?? 0)
  const boundedProbability =
    Number.isFinite(rawProbability) && rawProbability > 1 ? rawProbability / 100 : rawProbability
  const probability = Math.max(0, Math.min(1, boundedProbability))

  const rawPrediction = data.prediction
  const prediction = (() => {
    if (typeof rawPrediction === 'string') {
      const normalized = rawPrediction.trim().toLowerCase()
      if (normalized.includes('no heavy')) {
        return 'No Heavy Rain'
      }
      if (normalized.includes('heavy')) {
        return 'Heavy Rain'
      }
      return rawPrediction
    }
    return rawPrediction ? 'Heavy Rain' : 'No Heavy Rain'
  })()

  const rawGradcam = data.gradcam ?? data.grad_cam
  const gradcam = typeof rawGradcam === 'string' ? rawGradcam : ''

  const rawInputImages = data.input_images
  const inputImages = Array.isArray(rawInputImages)
    ? rawInputImages.filter((img): img is string => typeof img === 'string')
    : []

  if (inputImages.length === 0) {
    const rawInputImage = data.input_image ?? data.input_patch
    if (typeof rawInputImage === 'string' && rawInputImage.length > 0) {
      inputImages.push(rawInputImage)
    }
  }

  return { probability, prediction, gradcam, inputImages }
}

function getDownloadFilename(contentDisposition: string | null): string {
  if (!contentDisposition) {
    return 'prediction_report.pdf'
  }

  const utfMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1])
  }

  const basicMatch = contentDisposition.match(/filename="?([^";]+)"?/i)
  if (basicMatch?.[1]) {
    return basicMatch[1]
  }

  return 'prediction_report.pdf'
}

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloadingReport, setIsDownloadingReport] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [result])

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setError(null)
  }

  const handlePredict = async () => {
    if (!selectedFile) {
      return
    }

    setIsLoading(true)
    setError(null)
    setIsExpanded(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Prediction failed (${response.status})`)
      }

      const payload = await response.json()
      setResult(normalizeResult(payload))
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An error occurred while calling the prediction API.'
      setError(message)
      setIsExpanded(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadReport = async () => {
    if (!selectedFile) {
      setError('Select a valid .npy file before downloading the report.')
      return
    }

    setIsDownloadingReport(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch(`${API_BASE_URL}/report`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Report generation failed (${response.status})`)
      }

      const blob = await response.blob()
      const filename = getDownloadFilename(response.headers.get('content-disposition'))

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate the prediction report.'
      setError(message)
    } finally {
      setIsDownloadingReport(false)
    }
  }

  return (
    <main className={`min-h-screen w-full overflow-x-hidden ${result ? 'h-screen overflow-hidden' : ''}`}>
      <AnimatedGradientBg />

      <div className="relative z-10">
        <LandingSection
          isExpanded={isExpanded}
          onFileSelect={handleFileSelect}
          onPredict={handlePredict}
          isLoading={isLoading}
        />

        {result && (
          <div ref={resultsRef}>
            <ResultsSection
              isVisible={true}
              prediction={result.prediction}
              probability={result.probability}
              inputPatchUrls={result.inputImages.map((img) => `data:image/png;base64,${img}`)}
              gradCamUrl={`data:image/png;base64,${result.gradcam}`}
              onDownloadReport={handleDownloadReport}
              isDownloadingReport={isDownloadingReport}
            />
          </div>
        )}

        {error && (
          <div className="fixed bottom-4 right-4 glass rounded-lg p-4 max-w-sm text-red-400 border border-red-500/50 z-50">
            <p className="font-semibold flex items-center gap-2">
              <span>Error</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-xs hover:text-red-300 transition-colors"
              >
                x
              </button>
            </p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="glass rounded-lg p-8 max-w-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-[3px] border-cyan-400/30 rounded-full animate-pulse" />
                  <div className="absolute inset-0 border-[3px] border-cyan-400 border-t-transparent rounded-full animate-spin" />
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
