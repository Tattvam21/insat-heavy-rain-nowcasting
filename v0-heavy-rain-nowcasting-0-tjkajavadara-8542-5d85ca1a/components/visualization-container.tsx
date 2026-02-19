'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface VisualizationContainerProps {
  inputPatchUrl: string
  gradCamUrl: string
}

export function VisualizationContainer({
  inputPatchUrl,
  gradCamUrl,
}: VisualizationContainerProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.6,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  const rightItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full"
    >
      {/* Input Patch */}
      <motion.div
        variants={itemVariants}
        className="glass rounded-lg p-6 overflow-hidden group"
      >
        <h3 className="text-lg font-semibold text-gray-300 mb-4">Input Patch</h3>
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-900">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <img
              src={inputPatchUrl}
              alt="Input Satellite Patch"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
        <p className="text-sm text-gray-400 mt-3">Original satellite image patch</p>
      </motion.div>

      {/* Grad-CAM Visualization */}
      <motion.div
        variants={rightItemVariants}
        className="glass rounded-lg p-6 overflow-hidden group"
      >
        <h3 className="text-lg font-semibold text-gray-300 mb-4">Grad-CAM</h3>
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-900">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <img
              src={gradCamUrl}
              alt="Grad-CAM Explanation"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
        <p className="text-sm text-gray-400 mt-3">Model attention visualization</p>
      </motion.div>
    </motion.div>
  )
}
