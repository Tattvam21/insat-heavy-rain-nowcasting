'use client'

import { PredictionTitle } from './prediction-title'
import { ProbabilityBar } from './probability-bar'
import { VisualizationContainer } from './visualization-container'
import { NowcastExplanation } from './nowcast-explanation'
import { Button } from './ui/button'

interface ResultsSectionProps {
  isVisible: boolean
  prediction: string
  probability: number
  inputPatchUrls: string[]
  gradCamUrl: string
  onDownloadReport: () => void
  isDownloadingReport: boolean
}

export function ResultsSection({
  isVisible,
  prediction,
  probability,
  inputPatchUrls,
  gradCamUrl,
  onDownloadReport,
  isDownloadingReport,
}: ResultsSectionProps) {
  if (!isVisible) {
    return null
  }

  return (
    <div className="h-[100svh] w-full px-3 py-3 md:px-6 md:py-5 results-enter">
      <div className="mx-auto h-full max-w-7xl">
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-12 results-stagger">
          <section className="result-item lg:col-span-5 h-full min-h-0">
            <div className="h-full min-h-0 flex flex-col justify-center gap-3">
              <PredictionTitle prediction={prediction} probability={probability} />
              <ProbabilityBar probability={probability} />
              <Button
                onClick={onDownloadReport}
                disabled={isDownloadingReport}
                className="w-full"
              >
                {isDownloadingReport ? 'Generating PDF report...' : 'Download Prediction Report (PDF)'}
              </Button>
              <NowcastExplanation />
            </div>
          </section>

          <section className="result-item lg:col-span-7 h-full min-h-0 flex items-center justify-center">
            <VisualizationContainer inputPatchUrls={inputPatchUrls} gradCamUrl={gradCamUrl} />
          </section>
        </div>
      </div>
    </div>
  )
}
