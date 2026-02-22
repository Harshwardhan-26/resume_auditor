"use client"

import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { InputSection } from "@/components/input-section"
import { AuditAnimation } from "@/components/audit-animation"
import { AnalysisDashboard } from "@/components/analysis-dashboard"
import { GlassCard } from "@/components/glass-card"
import { type AuditResult } from "@/lib/mock-analysis"

type AppState = "upload" | "scanning" | "results"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [appState, setAppState] = useState<AppState>("upload")
  const [result, setResult] = useState<AuditResult | null>(null)

  const handleAudit = useCallback(async () => {
    if (!file) return;
    setAppState("scanning");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://resume-auditor.onrender.com", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Backend connection failed");

      const data = await response.json();
      
      // SAFETY CHECK: Ensure the backend sent the new required fields
      if (!data.skillProfile) {
        data.skillProfile = { technical: [], soft: [], industry: [] };
      }
      if (!data.predictedRole) {
        data.predictedRole = "Analyzing...";
      }

      setResult(data);
    } catch (error) {
      console.error("Audit failed:", error);
      alert("Could not connect to Python backend. Is it running on port 8000?");
      setAppState("upload");
    }
  }, [file]);

  const handleScanComplete = useCallback(() => {
    if (result) {
      setAppState("results")
    }
  }, [result])

  const handleReset = useCallback(() => {
    setResult(null)
    setFile(null)
    setAppState("upload")
  }, [])

  return (
    <div className="min-h-screen bg-background relative">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute top-1/3 -right-20 h-60 w-60 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <SiteHeader />

      <main className="relative mx-auto max-w-5xl px-6 py-10">
        <AnimatePresence mode="wait">
          {appState === "results" && result ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              {/* Added key={JSON.stringify(result)} to force re-render with new data */}
              <AnalysisDashboard key={result.healthScore} result={result} onReset={handleReset} />
            </motion.div>
          ) : appState === "scanning" ? (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center pt-12"
            >
              <GlassCard className="px-10 py-12 w-full max-w-md">
                <h2 className="text-lg font-semibold text-foreground text-center mb-8">
                  Auditing Your Resume
                </h2>
                <AuditAnimation onComplete={handleScanComplete} />
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-10">
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Get Your{" "}
                  <span className="text-primary">Resume Report Card</span>
                </motion.h2>
                <motion.p
                  className="mt-3 text-muted-foreground max-w-lg mx-auto leading-relaxed text-pretty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Upload your resume and our AI will audit it for ATS
                  compliance, formatting issues, impact strength, and missing
                  sections -- no job description needed.
                </motion.p>
              </div>

              <InputSection
                file={file}
                onFileChange={setFile}
                onAudit={handleAudit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative border-t border-border mt-20">
        <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            ResumeIQ &mdash; AI Resume Auditor
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by advanced NLP
          </p>
        </div>
      </footer>
    </div>
  )
}