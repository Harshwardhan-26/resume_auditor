export interface AuditCheck {
  label: string
  passed: boolean
  detail: string
}

export interface AuditCategory {
  name: string
  icon: string
  score: number
  checks: AuditCheck[]
}

export interface ImprovementTask {
  title: string
  before: string
  after: string
  impact: "high" | "medium" | "low"
  scoreGain: number
}

export interface SkillTag {
  name: string
}

export interface SkillProfile {
  technical: SkillTag[]
  soft: SkillTag[]
  industry: SkillTag[]
}

export interface ScoreBreakdown {
  category: string
  score: number
  weight: number
}

export interface AuditResult {
  healthScore: number
  inferredRole: string
  scoreExplanation: string
  scoreBreakdown: ScoreBreakdown[]
  categories: {
    contactInfo: AuditCategory
    formatting: AuditCategory
    impact: AuditCategory
    sections: AuditCategory
  }
  skillProfile: SkillProfile
  improvements: ImprovementTask[]
}

export function generateMockAudit(): AuditResult {
  return {
    healthScore: 68,
    inferredRole: "Full Stack Developer",
    scoreExplanation:
      "Your score is held back by formatting issues and weak impact statements, despite having strong contact information and complete sections. Fixing your layout and rewriting bullet points will yield the biggest score gains.",
    scoreBreakdown: [
      { category: "Contact Info", score: 83, weight: 15 },
      { category: "Formatting", score: 55, weight: 30 },
      { category: "Impact", score: 60, weight: 35 },
      { category: "Sections", score: 75, weight: 20 },
    ],
    categories: {
      contactInfo: {
        name: "Contact Info",
        icon: "contact",
        score: 83,
        checks: [
          {
            label: "Email Address",
            passed: true,
            detail: "Professional email format detected.",
          },
          {
            label: "LinkedIn Profile",
            passed: true,
            detail: "LinkedIn URL found in header section.",
          },
          {
            label: "Phone Number",
            passed: false,
            detail:
              "No phone number detected. Most recruiters expect a phone number for scheduling calls.",
          },
          {
            label: "Location / City",
            passed: true,
            detail: "City-level location found.",
          },
        ],
      },
      formatting: {
        name: "Formatting",
        icon: "formatting",
        score: 55,
        checks: [
          {
            label: "Single-Column Layout",
            passed: false,
            detail:
              "Multi-column or table-based layout detected. ATS parsers struggle with complex layouts.",
          },
          {
            label: "Font Readability",
            passed: true,
            detail: "Standard, readable font family detected.",
          },
          {
            label: "Consistent Date Format",
            passed: false,
            detail:
              "Mixed date formats found (e.g., 'Jan 2023' and '01/2023'). Standardize to one format.",
          },
          {
            label: "No Headers/Footers",
            passed: true,
            detail: "No content in headers or footers that ATS might skip.",
          },
          {
            label: "File is PDF",
            passed: true,
            detail: "PDF format is the safest for ATS compatibility.",
          },
        ],
      },
      impact: {
        name: "Impact",
        icon: "impact",
        score: 60,
        checks: [
          {
            label: "Quantified Metrics",
            passed: true,
            detail:
              "Numbers and percentages found in 3 out of 8 bullet points. Aim for at least 50%.",
          },
          {
            label: "Action Verbs",
            passed: true,
            detail:
              "Strong action verbs detected: 'Led', 'Implemented', 'Designed'. Good usage.",
          },
          {
            label: "Results-Oriented Bullets",
            passed: false,
            detail:
              "Several bullet points describe duties rather than achievements. Reframe to show outcomes.",
          },
          {
            label: "Specific Technologies Named",
            passed: true,
            detail:
              "Technical tools and frameworks are explicitly named in experience entries.",
          },
        ],
      },
      sections: {
        name: "Sections",
        icon: "sections",
        score: 75,
        checks: [
          {
            label: "Experience Section",
            passed: true,
            detail: "Work experience section found with multiple entries.",
          },
          {
            label: "Education Section",
            passed: true,
            detail: "Education section present with degree information.",
          },
          {
            label: "Skills Section",
            passed: true,
            detail:
              "Dedicated skills section found. Consider grouping by category.",
          },
          {
            label: "Summary / Objective",
            passed: false,
            detail:
              "No professional summary detected. A 2-3 line summary at the top can improve recruiter engagement significantly.",
          },
        ],
      },
    },
    skillProfile: {
      technical: [
        { name: "React" },
        { name: "TypeScript" },
        { name: "Node.js" },
        { name: "Python" },
        { name: "PostgreSQL" },
        { name: "AWS" },
        { name: "Docker" },
        { name: "GraphQL" },
        { name: "Next.js" },
        { name: "Tailwind CSS" },
      ],
      soft: [
        { name: "Leadership" },
        { name: "Communication" },
        { name: "Problem Solving" },
        { name: "Mentoring" },
        { name: "Collaboration" },
      ],
      industry: [
        { name: "Agile / Scrum" },
        { name: "CI/CD" },
        { name: "SaaS" },
        { name: "Fintech" },
        { name: "Cloud Architecture" },
        { name: "System Design" },
      ],
    },
    improvements: [
      {
        title: "Add a phone number to your header",
        before: "John Doe | john@email.com | linkedin.com/in/johndoe",
        after:
          "John Doe | john@email.com | (555) 123-4567 | linkedin.com/in/johndoe",
        impact: "high",
        scoreGain: 5,
      },
      {
        title: "Switch to a single-column layout",
        before:
          "[Two-column layout with skills sidebar and experience main column]",
        after:
          "[Clean single-column: Summary > Experience > Skills > Education]",
        impact: "high",
        scoreGain: 8,
      },
      {
        title: "Rewrite duty-focused bullets with measurable results",
        before:
          "Responsible for managing a team and overseeing project deliverables",
        after:
          "Led a team of 6 engineers, delivering 3 projects 15% ahead of schedule and under budget",
        impact: "high",
        scoreGain: 7,
      },
      {
        title: "Add a professional summary section",
        before: "[No summary -- resume starts directly with Experience]",
        after:
          "Full-stack engineer with 5+ years building scalable SaaS products. Specializing in React and Node.js, with a track record of reducing API latency by 40%.",
        impact: "high",
        scoreGain: 6,
      },
      {
        title: "Standardize all date formats consistently",
        before: "Jan 2023 - Present | 06/2021 - 12/2022",
        after: "January 2023 - Present | June 2021 - December 2022",
        impact: "medium",
        scoreGain: 3,
      },
      {
        title: "Quantify more bullet points with specific metrics",
        before: "Improved application performance and user experience",
        after:
          "Improved page load time by 62%, increasing user retention from 34% to 51%",
        impact: "medium",
        scoreGain: 4,
      },
    ],
  }
}
