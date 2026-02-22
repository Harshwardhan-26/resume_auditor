"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ScoreBreakdown } from "@/lib/mock-analysis"

interface RadialProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  breakdown?: ScoreBreakdown[]
}

export function RadialProgress({
  value,
  size = 200,
  strokeWidth = 12,
  breakdown,
}: RadialProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [hovered, setHovered] = useState(false)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedValue / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 300)
    return () => clearTimeout(timer)
  }, [value])

  const getColor = (val: number) => {
    if (val >= 75) return "oklch(0.65 0.2 155)"
    if (val >= 50) return "oklch(0.75 0.15 75)"
    return "oklch(0.55 0.22 25)"
  }

  const getLabel = (val: number) => {
    if (val >= 85) return "Excellent"
    if (val >= 70) return "Good"
    if (val >= 50) return "Fair"
    return "Needs Work"
  }

  const scoreColor = getColor(value)

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow behind the ring on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${scoreColor}22 0%, transparent 70%)` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-secondary"
          stroke="none"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />
      </svg>

      {/* Center content: score OR breakdown */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {hovered && breakdown ? (
            <motion.div
              key="breakdown"
              className="flex flex-col items-center gap-1.5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {breakdown.map((item) => (
                <div key={item.category} className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground w-20 text-right truncate">
                    {item.category}
                  </span>
                  <div className="w-14 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: getColor(item.score) }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                  <span
                    className="font-mono text-[10px] font-semibold w-7"
                    style={{ color: getColor(item.score) }}
                  >
                    {item.score}
                  </span>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="score"
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <span className="text-5xl font-bold tracking-tight text-foreground">
                {animatedValue}
                <span className="text-2xl text-muted-foreground">%</span>
              </span>
              <span className="text-sm font-medium text-muted-foreground mt-1">
                {getLabel(value)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
