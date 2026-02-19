'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { GradCAMLegend } from './gradcam-legend'

interface VisualizationContainerProps {
  inputPatchUrls: string[]
  gradCamUrl: string
}

function PatchCard({
  title,
  subtitle,
  src,
}: {
  title: string
  subtitle: string
  src: string
}) {
  return (
    <Card className="overflow-hidden group h-full min-h-0">
      <CardContent className="p-3 h-full min-h-0 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">{title}</h3>
        <div className="relative flex-1 min-h-0 rounded-lg overflow-hidden bg-slate-900">
          {src ? (
            <Image
              src={src}
              alt={title}
              fill
              unoptimized
              className="object-contain p-1 transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-slate-500">
              Not available
            </div>
          )}
        </div>
        <p className="text-[11px] text-gray-400 mt-2">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

export function VisualizationContainer({
  inputPatchUrls,
  gradCamUrl,
}: VisualizationContainerProps) {
  return (
    <div className="w-full max-w-[860px] h-[88%] min-h-0 grid grid-cols-1 lg:grid-cols-[0.9fr_1.25fr] gap-3">
      <div className="min-h-0 grid grid-rows-3 gap-3">
        <PatchCard title="Patch 1" subtitle="Temporal patch 1" src={inputPatchUrls[0] ?? ''} />
        <PatchCard title="Patch 2" subtitle="Temporal patch 2" src={inputPatchUrls[1] ?? ''} />
        <PatchCard title="Patch 3" subtitle="Temporal patch 3" src={inputPatchUrls[2] ?? ''} />
      </div>

      <div className="min-h-0 flex flex-col gap-2.5">
        <Card className="overflow-hidden group flex-1 min-h-0 border-cyan-300/30">
          <CardContent className="p-3 h-full min-h-0 flex flex-col">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-cyan-200">Grad-CAM</h3>
              <span className="rounded-full border border-cyan-300/35 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-cyan-200 bg-cyan-500/15">
                MODEL FOCUS
              </span>
            </div>
            <div className="relative flex-1 min-h-0 rounded-lg overflow-hidden bg-slate-900">
              {gradCamUrl ? (
                <Image
                  src={gradCamUrl}
                  alt="Grad-CAM"
                  fill
                  unoptimized
                  className="object-contain p-1 transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-slate-500">
                  Not available
                </div>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">Model attention visualization</p>
          </CardContent>
        </Card>

        <div className="shrink-0">
          <GradCAMLegend compact />
        </div>
      </div>
    </div>
  )
}
