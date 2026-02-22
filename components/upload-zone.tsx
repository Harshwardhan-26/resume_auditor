"use client"

import { useCallback, useState } from "react"
import { motion } from "framer-motion"
import { Upload, FileText, X, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadZoneProps {
  file: File | null
  onFileChange: (file: File | null) => void
}

export function UploadZone({ file, onFileChange }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile && droppedFile.type === "application/pdf") {
        onFileChange(droppedFile)
      }
    },
    [onFileChange]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        onFileChange(selectedFile)
      }
    },
    [onFileChange]
  )

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10
        transition-all duration-300 min-h-[260px]
        ${
          isDragging
            ? "border-primary bg-primary/10 scale-[1.02]"
            : file
              ? "border-success/50 bg-success/5"
              : "border-border bg-secondary/20 hover:border-primary/50 hover:bg-secondary/40"
        }
      `}
      whileHover={{ scale: file ? 1 : 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {file ? (
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FileText className="h-8 w-8 text-success" />
          </motion.div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {(file.size / 1024).toFixed(1)} KB &middot; Ready for audit
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFileChange(null)}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-foreground">
              Drag & drop your resume here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              PDF format, up to 10MB
            </p>
          </div>
          <label htmlFor="file-upload">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
              asChild
            >
              <span>Browse Files</span>
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              className="sr-only"
              onChange={handleFileInput}
            />
          </label>
          <div className="flex items-center gap-1.5 text-muted-foreground/50">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-[11px]">
              Encrypted & private
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}
