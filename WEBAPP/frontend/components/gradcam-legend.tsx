'use client'

interface GradCAMLegendProps {
  compact?: boolean
}

export function GradCAMLegend({ compact = false }: GradCAMLegendProps) {
  return (
    <div className={`w-full ${compact ? 'space-y-1.5' : 'space-y-2'}`}>
      <h3 className={`${compact ? 'text-sm' : 'text-base'} font-semibold text-gray-300`}>Importance Gradient</h3>

      <div className={`glass rounded-lg ${compact ? 'p-2' : 'p-3'}`}>
        <div className={`${compact ? 'h-4' : 'h-6'} rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 via-green-500 via-yellow-500 to-red-500 shadow-lg`} />

        <div className={`flex justify-between ${compact ? 'mt-1.5' : 'mt-2'} text-xs text-gray-400`}>
          <span>Low Importance</span>
          <span>High Importance</span>
        </div>
      </div>

      <p className={`text-gray-500 ${compact ? 'text-[11px]' : 'text-xs'}`}>
        Shows which regions of the image contributed most to the prediction. Red areas had the strongest influence.
      </p>
    </div>
  )
}
