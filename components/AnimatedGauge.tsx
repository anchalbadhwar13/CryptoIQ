'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface AnimatedGaugeProps {
  value: number // 0-10
  maxValue?: number
  label?: string
  className?: string
}

export default function AnimatedGauge({ value, maxValue = 10, label = 'Risk Factor', className }: AnimatedGaugeProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value)
    }, 300)
    return () => clearTimeout(timer)
  }, [value])

  const percentage = (displayValue / maxValue) * 100
  const angle = (percentage / 100) * 180 - 90 // -90 to 90 degrees for semicircle

  // Determine color based on value
  const getColor = () => {
    if (displayValue >= 7) return '#FF6B35' // Orange/Red for high risk
    if (displayValue >= 4) return '#FFD700' // Yellow for medium risk
    return '#00FF88' // Green for low risk
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-48 h-32">
        {/* Semicircle background */}
        <svg className="w-full h-full transform -scale-x-100" viewBox="0 0 200 100">
          {/* Background arc */}
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Colored arc based on value */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${getColor()})` }}
          />
        </svg>

        {/* Needle */}
        <motion.div
          initial={{ rotate: -90 }}
          animate={{ rotate: angle }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute bottom-0 left-1/2 origin-bottom"
          style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
        >
          <div className="w-1 h-20 bg-white rounded-full" style={{ boxShadow: `0 0 10px ${getColor()}` }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-cyber-dark" style={{ borderColor: getColor() }} />
        </motion.div>

        {/* Value display */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
          <div className="text-3xl font-bold" style={{ color: getColor() }}>
            {displayValue.toFixed(1)}/{maxValue}
          </div>
          <div className="text-xs text-gray-400 mt-1">{label}</div>
        </div>
      </div>
    </div>
  )
}
