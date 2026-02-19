'use client'

export function NowcastExplanation() {
  return (
    <div className="glass rounded-lg p-4 w-full">
      <h3 className="text-base font-bold text-gray-100 mb-2">About This Prediction</h3>
      <div className="space-y-1 text-sm text-gray-300 leading-relaxed">
        <p>INSAT satellite patches are analyzed for heavy rainfall over the next 90 minutes.</p>
        <p>Grad-CAM highlights cloud regions that drove the model decision.</p>
        <p className="text-gray-400">High confidence generally starts above 70% probability.</p>
        <p className="text-gray-400">⚠️ Model may struggle in cases of thin cloud layers or sudden convection not visible in prior frames.</p>
      </div>
    </div>
  )
}
