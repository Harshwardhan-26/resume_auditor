"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Mail,
  Linkedin,
  Phone,
  MapPin,
  Columns2,
  Type,
  CalendarDays,
  FileText,
  FileCheck,
  BarChart3,
  Zap,
  Target,
  Cpu,
  Briefcase,
  GraduationCap,
  Wrench,
  AlignLeft,
  ArrowUpRight,
  ChevronDown,
  Lightbulb,
  Info,
  Search,
  Sparkles,
  Download,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/glass-card"
import { RadialProgress } from "@/components/radial-progress"
import type {
  AuditResult,
  AuditCategory,
  AuditCheck,
  ImprovementTask,
} from "@/lib/mock-analysis"

interface AnalysisDashboardProps {
  result: AuditResult
  onReset: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

const CHECK_ICONS: Record<string, typeof Mail> = {
  "Email Address": Mail,
  "LinkedIn Profile": Linkedin,
  "Phone Number": Phone,
  "Location / City": MapPin,
  "Single-Column Layout": Columns2,
  "Font Readability": Type,
  "Consistent Date Format": CalendarDays,
  "No Headers/Footers": FileText,
  "File is PDF": FileCheck,
  "Quantified Metrics": BarChart3,
  "Action Verbs": Zap,
  "Results-Oriented Bullets": Target,
  "Specific Technologies Named": Cpu,
  "Experience Section": Briefcase,
  "Education Section": GraduationCap,
  "Skills Section": Wrench,
  "Summary / Objective": AlignLeft,
}

/* ---------- Inferred Role Badge ---------- */
function InferredRoleBadge({ role }: { role: string }) {
  return (
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="relative group">
        <div className="absolute -inset-1 rounded-full bg-primary/20 blur-md group-hover:bg-primary/30 transition-all duration-500" />
        <div className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary/15 border border-primary/30 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Predicted Role
          </span>
          <span className="text-sm font-bold text-foreground">{role || "General"}</span>
        </div>
      </div>
    </motion.div>
  )
}

/* ---------- Score Explanation ---------- */
function ScoreExplanation({ text }: { text: string }) {
  if (!text) return null;
  return (
    <motion.div
      className="flex items-start gap-3 mt-4 px-4 sm:px-5 py-3.5 rounded-lg bg-secondary/60 border border-border/50 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.4 }}
    >
      <Lightbulb className="h-4 w-4 text-warning shrink-0 mt-0.5" />
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </motion.div>
  )
}

/* ---------- Category Card ---------- */
function CategoryCard({
  category,
  delay,
}: {
  category: AuditCategory
  delay: number
}) {
  if (!category) return null;
  const passed = category.checks?.filter((c) => c.passed).length || 0
  const total = category.checks?.length || 0
  const allPassed = passed === total
  const mostFailed = total > 0 && passed / total < 0.5

  return (
    <GlassCard
      className="p-4 sm:p-6 h-full"
      glow={allPassed ? "pass" : mostFailed ? "fail" : "none"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
    >
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h3 className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wider">
          {category.name}
        </h3>
        <span
          className={`text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 rounded-full ${
            category.score >= 75
              ? "bg-success/15 text-success"
              : category.score >= 50
                ? "bg-warning/15 text-warning"
                : "bg-destructive/15 text-destructive"
          }`}
        >
          {passed}/{total} Passed
        </span>
      </div>
      <ul className="space-y-2.5 sm:space-y-3">
        {category.checks?.map((check) => (
          <CheckItem key={check.label} check={check} />
        ))}
      </ul>
    </GlassCard>
  )
}

function CheckItem({ check }: { check: AuditCheck }) {
  const Icon = CHECK_ICONS[check.label] ?? FileCheck

  return (
    <li className="group">
      <div className="flex items-start gap-2.5 sm:gap-3">
        {check.passed ? (
          <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
        ) : (
          <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span
              className={`text-xs sm:text-sm font-medium ${
                check.passed ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {check.label}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-muted-foreground/70 mt-0.5 sm:mt-1 leading-relaxed">
            {check.detail}
          </p>
        </div>
      </div>
    </li>
  )
}

/* ---------- Skill Profile Tags (FIXED FOR STRINGS) ---------- */
function SkillProfileSection({
  skillProfile,
}: {
  skillProfile: any
}) {
  const [query, setQuery] = useState("")
  const lowerQuery = query.toLowerCase()

  // SAFEGUARD: Ensure skills are treated as strings or objects correctly
  const renderSkillName = (skill: any) => typeof skill === 'string' ? skill : skill?.name || "";

  const buckets = [
    {
      title: "Technical Skills",
      skills: skillProfile?.technical || [],
      tagClass: "bg-primary/10 text-primary border-primary/20",
      dotClass: "bg-primary",
    },
    {
      title: "Soft Skills",
      skills: skillProfile?.soft || [],
      tagClass: "bg-warning/10 text-warning border-warning/20",
      dotClass: "bg-warning",
    },
    {
      title: "Industry Knowledge",
      skills: skillProfile?.industry || [],
      tagClass: "bg-success/10 text-success border-success/20",
      dotClass: "bg-success",
    },
  ]

  return (
    <GlassCard className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary/15">
            <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              Skill Profile
            </h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground">
              Skills detected and categorized from your resume
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter skills..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-secondary/60 border border-border text-sm text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {buckets.map((bucket, bucketIdx) => {
          const filtered = bucket.skills.filter((s: any) =>
            renderSkillName(s).toLowerCase().includes(lowerQuery)
          )

          return (
            <div key={bucket.title}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`h-2 w-2 rounded-full ${bucket.dotClass}`} />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {bucket.title}
                </h4>
                <span className="text-[10px] text-muted-foreground/50 font-mono">
                  {filtered.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <AnimatePresence mode="popLayout">
                  {filtered.map((skill: any, skillIdx: number) => {
                    const name = renderSkillName(skill);
                    return (
                      <motion.span
                        key={name + skillIdx}
                        layout
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${bucket.tagClass}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        {name}
                      </motion.span>
                    )
                  })}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <span className="text-xs text-muted-foreground/50 italic py-1">
                    No matches
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}

/* ---------- Task Card ---------- */
function TaskCard({ task, index }: { task: any; index: number }) {
  const [expanded, setExpanded] = useState(false)

  const impactStyles: any = {
    high: "bg-destructive/15 text-destructive border-destructive/25",
    medium: "bg-warning/15 text-warning border-warning/25",
    low: "bg-muted text-muted-foreground border-border",
  }

  // Handle differences in naming between backend and frontend
  const title = task.title || task.text || "Improvement suggestion";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + index * 0.07, duration: 0.4 }}
    >
      <GlassCard className="overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 text-left group cursor-pointer"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
            +{task.scoreGain || 10}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-foreground leading-snug">
              {title}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`shrink-0 text-[10px] font-bold uppercase border ${impactStyles[task.impact] || impactStyles.low} hidden sm:inline-flex`}
          >
            {task.impact || "medium"}
          </Badge>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                  <span className="text-[10px] font-semibold text-destructive uppercase block mb-1">Before</span>
                  <p className="text-xs text-muted-foreground font-mono">{task.before || "No metrics used."}</p>
                </div>
                <div className="rounded-lg border border-success/20 bg-success/5 p-3">
                  <span className="text-[10px] font-semibold text-success uppercase block mb-1">After</span>
                  <p className="text-xs text-foreground font-mono">{task.after || task.example || "Add metrics to show impact."}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  )
}

/* ---------- Main Dashboard ---------- */
export function AnalysisDashboard({
  result,
  onReset,
}: AnalysisDashboardProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  
  // SAFEGUARD: Default values if result fields are missing
  const healthScore = result?.healthScore || 0;
  const improvements = result?.improvements || [];
  const predictedRole = (result as any)?.predictedRole || (result as any)?.inferredRole || "Analyzing...";

  const potentialGain = improvements.reduce(
    (sum: number, i: any) => sum + (i.scoreGain || 10),
    0
  )
  const potentialScore = Math.min(100, healthScore + potentialGain)

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true)
    try {
      const { generateReportPdf } = await import("@/lib/generate-pdf")
      await generateReportPdf(result)
    } catch (err) {
      console.error("PDF generation failed:", err)
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5 sm:space-y-6"
    >
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" onClick={onReset} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Audit Another Resume
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="ml-auto border-border/60 bg-card/50 backdrop-blur-sm text-foreground"
        >
          {isGeneratingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          {isGeneratingPdf ? "Generating..." : "Download PDF Report"}
        </Button>
      </div>

      <motion.div variants={itemVariants}>
        <InferredRoleBadge role={predictedRole} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassCard className="px-5 sm:px-8 py-8 sm:py-10 text-center">
            <RadialProgress
              value={healthScore}
              size={200}
              strokeWidth={14}
            />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-4">Resume Health Score</h2>
            <ScoreExplanation text={(result as any)?.scoreExplanation || "Good content, but needs better metric quantification."} />
            <motion.div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">
                Potential score: <span className="font-bold">{potentialScore}%</span>
              </span>
            </motion.div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <CategoryCard category={result?.categories?.contactInfo} delay={0.15} />
        <CategoryCard category={result?.categories?.formatting} delay={0.2} />
        <CategoryCard category={result?.categories?.impact} delay={0.25} />
        <CategoryCard category={result?.categories?.sections} delay={0.3} />
      </div>

      <motion.div variants={itemVariants}>
        <SkillProfileSection skillProfile={result?.skillProfile} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Actionable Improvements</h3>
        <div className="space-y-3">
          {improvements.map((task: any, index: number) => (
            <TaskCard key={index} task={task} index={index} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}