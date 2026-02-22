"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

type GlowVariant = "none" | "pass" | "fail"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  className?: string
  glow?: GlowVariant
}

const glowStyles: Record<GlowVariant, string> = {
  none: "",
  pass: "shadow-[0_0_24px_-4px_oklch(0.65_0.2_155_/_0.2)] border-[oklch(0.65_0.2_155_/_0.3)]",
  fail: "opacity-80 border-[oklch(0.55_0.22_25_/_0.25)]",
}

export function GlassCard({
  children,
  className,
  glow = "none",
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-xl border border-border bg-card backdrop-blur-xl shadow-lg transition-shadow duration-300",
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
