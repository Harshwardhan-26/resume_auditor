"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileSearch,
  UserCheck,
  LayoutList,
  Sparkles,
  Check,
} from "lucide-react"

const AUDIT_STEPS = [
  {
    label: "Reading PDF structure...",
    icon: FileSearch,
    duration: 1200,
  },
  {
    label: "Analyzing contact details...",
    icon: UserCheck,
    duration: 1000,
  },
  {
    label: "Evaluating section headers...",
    icon: LayoutList,
    duration: 1100,
  },
  {
    label: "Generating AI suggestions...",
    icon: Sparkles,
    duration: 1200,
  },
]

interface AuditAnimationProps {
  onComplete: () => void
}

export function AuditAnimation({ onComplete }: AuditAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    if (currentStep >= AUDIT_STEPS.length) {
      const timer = setTimeout(onComplete, 400)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStep])
      setCurrentStep((prev) => prev + 1)
    }, AUDIT_STEPS[currentStep].duration)

    return () => clearTimeout(timer)
  }, [currentStep, onComplete])

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Animated scanning icon */}
      <motion.div
        className="relative flex h-24 w-24 items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full bg-primary/15"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 border border-primary/30">
          <AnimatePresence mode="wait">
            {currentStep < AUDIT_STEPS.length ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.5 }}
                transition={{ duration: 0.25 }}
              >
                {(() => {
                  const Icon = AUDIT_STEPS[currentStep].icon
                  return <Icon className="h-7 w-7 text-primary" />
                })()}
              </motion.div>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Check className="h-7 w-7 text-success" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Step list */}
      <div className="w-full max-w-xs space-y-3">
        {AUDIT_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(index)
          const isActive = currentStep === index

          return (
            <motion.div
              key={index}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              {/* Status indicator */}
              <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20"
                  >
                    <Check className="h-3.5 w-3.5 text-success" />
                  </motion.div>
                ) : isActive ? (
                  <div className="relative flex h-6 w-6 items-center justify-center">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/30"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                ) : (
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-sm font-medium transition-colors duration-300 ${
                  isCompleted
                    ? "text-success"
                    : isActive
                      ? "text-foreground"
                      : "text-muted-foreground/50"
                }`}
              >
                {step.label}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
