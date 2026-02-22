"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UploadZone } from "@/components/upload-zone"
import { GlassCard } from "@/components/glass-card"

interface InputSectionProps {
  file: File | null
  onFileChange: (file: File | null) => void
  onAudit: () => void
}

export function InputSection({
  file,
  onFileChange,
  onAudit,
}: InputSectionProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-8 w-full max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <GlassCard
        className="p-8 w-full"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          Upload Your Resume
        </h2>
        <UploadZone file={file} onFileChange={onFileChange} />
      </GlassCard>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Button
          size="lg"
          disabled={!file}
          onClick={onAudit}
          className="relative px-12 py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Audit My Resume
        </Button>
      </motion.div>

      <motion.p
        className="text-xs text-muted-foreground/60 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Your file is analyzed locally and never stored on our servers.
      </motion.p>
    </motion.div>
  )
}
