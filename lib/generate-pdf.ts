import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { AuditResult } from "@/lib/mock-analysis"

export async function generateReportPdf(result: AuditResult): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  /* ---------- Color helpers ---------- */
  const COLORS = {
    primary: [88, 60, 200] as [number, number, number],
    dark: [20, 20, 35] as [number, number, number],
    muted: [120, 120, 140] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
    success: [50, 160, 100] as [number, number, number],
    destructive: [200, 60, 60] as [number, number, number],
    warning: [200, 160, 40] as [number, number, number],
    lightBg: [245, 245, 250] as [number, number, number],
    tableBorder: [220, 220, 230] as [number, number, number],
  }

  /* ---------- Header ---------- */
  doc.setFillColor(...COLORS.primary)
  doc.rect(0, 0, pageWidth, 42, "F")

  doc.setTextColor(...COLORS.white)
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.text("ResumeIQ Analysis Report", margin, 18)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(
    `Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    margin,
    27
  )

  if (result.inferredRole) {
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text(`Predicted Role: ${result.inferredRole}`, margin, 36)
  }

  y = 52

  /* ---------- Health Score ---------- */
  doc.setTextColor(...COLORS.dark)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Overall Health Score", margin, y)
  y += 3

  // Score box
  const scoreBoxWidth = 32
  const scoreBoxHeight = 18
  const scoreColor =
    result.healthScore >= 75
      ? COLORS.success
      : result.healthScore >= 50
        ? COLORS.warning
        : COLORS.destructive
  doc.setFillColor(...scoreColor)
  doc.roundedRect(margin, y, scoreBoxWidth, scoreBoxHeight, 3, 3, "F")
  doc.setTextColor(...COLORS.white)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text(`${result.healthScore}%`, margin + scoreBoxWidth / 2, y + 12, {
    align: "center",
  })

  // Label next to score
  const label =
    result.healthScore >= 85
      ? "Excellent"
      : result.healthScore >= 70
        ? "Good"
        : result.healthScore >= 50
          ? "Fair"
          : "Needs Work"
  doc.setTextColor(...COLORS.muted)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(label, margin + scoreBoxWidth + 5, y + 11)

  y += scoreBoxHeight + 6

  // Score explanation
  if (result.scoreExplanation) {
    doc.setFillColor(...COLORS.lightBg)
    const splitExplanation = doc.splitTextToSize(
      result.scoreExplanation,
      contentWidth - 10
    )
    const explHeight = splitExplanation.length * 5 + 8
    doc.roundedRect(margin, y, contentWidth, explHeight, 2, 2, "F")
    doc.setTextColor(...COLORS.muted)
    doc.setFontSize(9)
    doc.text(splitExplanation, margin + 5, y + 6)
    y += explHeight + 6
  }

  /* ---------- Score Breakdown table ---------- */
  if (result.scoreBreakdown && result.scoreBreakdown.length > 0) {
    doc.setTextColor(...COLORS.dark)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Score Breakdown", margin, y)
    y += 2

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Category", "Score", "Weight"]],
      body: result.scoreBreakdown.map((b) => [
        b.category,
        `${b.score}%`,
        `${b.weight}%`,
      ]),
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: COLORS.dark,
      },
      alternateRowStyles: {
        fillColor: COLORS.lightBg,
      },
      styles: {
        lineColor: COLORS.tableBorder,
        lineWidth: 0.3,
        cellPadding: 4,
      },
      theme: "grid",
    })

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10
  }

  /* ---------- Audit Categories ---------- */
  const categories = [
    result.categories.contactInfo,
    result.categories.formatting,
    result.categories.impact,
    result.categories.sections,
  ]

  doc.setTextColor(...COLORS.dark)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Audit Details", margin, y)
  y += 2

  for (const category of categories) {
    const rows = category.checks.map((c) => [
      c.passed ? "PASS" : "FAIL",
      c.label,
      c.detail,
    ])

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [[category.name, "", ""]],
      body: rows,
      headStyles: {
        fillColor: COLORS.dark,
        textColor: COLORS.white,
        fontStyle: "bold",
        fontSize: 10,
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 16, halign: "center", fontStyle: "bold" },
        1: { cellWidth: 40, fontStyle: "bold" },
        2: { cellWidth: contentWidth - 56 },
      },
      bodyStyles: { fontSize: 8.5, textColor: COLORS.dark, cellPadding: 3 },
      alternateRowStyles: { fillColor: COLORS.lightBg },
      styles: {
        lineColor: COLORS.tableBorder,
        lineWidth: 0.2,
      },
      didParseCell(data) {
        if (data.section === "body" && data.column.index === 0) {
          const val = data.cell.raw as string
          data.cell.styles.textColor =
            val === "PASS" ? COLORS.success : COLORS.destructive
        }
      },
      theme: "grid",
    })

    y =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 6
  }

  /* ---------- Skill Profile ---------- */
  // Check if we need a new page
  if (y > 240) {
    doc.addPage()
    y = margin
  }

  doc.setTextColor(...COLORS.dark)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Skill Profile", margin, y)
  y += 2

  const skillRows: string[][] = []
  const maxLen = Math.max(
    result.skillProfile.technical.length,
    result.skillProfile.soft.length,
    result.skillProfile.industry.length
  )
  for (let i = 0; i < maxLen; i++) {
    skillRows.push([
      result.skillProfile.technical[i]?.name ?? "",
      result.skillProfile.soft[i]?.name ?? "",
      result.skillProfile.industry[i]?.name ?? "",
    ])
  }

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Technical Skills", "Soft Skills", "Industry Knowledge"]],
    body: skillRows,
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: COLORS.dark },
    alternateRowStyles: { fillColor: COLORS.lightBg },
    styles: {
      lineColor: COLORS.tableBorder,
      lineWidth: 0.2,
      cellPadding: 3.5,
    },
    theme: "grid",
  })

  y =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10

  /* ---------- Key Improvements ---------- */
  if (y > 240) {
    doc.addPage()
    y = margin
  }

  doc.setTextColor(...COLORS.dark)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Key Improvements", margin, y)
  y += 2

  const improvementRows = result.improvements.map((imp) => [
    `+${imp.scoreGain}`,
    imp.impact.toUpperCase(),
    imp.title,
    imp.before,
    imp.after,
  ])

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Gain", "Impact", "Improvement", "Before", "After"]],
    body: improvementRows,
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 8.5,
    },
    columnStyles: {
      0: { cellWidth: 14, halign: "center", fontStyle: "bold" },
      1: { cellWidth: 16, halign: "center", fontStyle: "bold" },
      2: { cellWidth: 40 },
      3: { cellWidth: contentWidth / 2 - 35, fontStyle: "italic" },
      4: { cellWidth: contentWidth / 2 - 35 },
    },
    bodyStyles: { fontSize: 7.5, textColor: COLORS.dark, cellPadding: 3 },
    alternateRowStyles: { fillColor: COLORS.lightBg },
    styles: {
      lineColor: COLORS.tableBorder,
      lineWidth: 0.2,
      overflow: "linebreak",
    },
    didParseCell(data) {
      if (data.section === "body" && data.column.index === 0) {
        data.cell.styles.textColor = COLORS.success
      }
      if (data.section === "body" && data.column.index === 1) {
        const val = (data.cell.raw as string)
        data.cell.styles.textColor =
          val === "HIGH"
            ? COLORS.destructive
            : val === "MEDIUM"
              ? COLORS.warning
              : COLORS.muted
      }
    },
    theme: "grid",
  })

  /* ---------- Footer ---------- */
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const pageHeight = doc.internal.pageSize.getHeight()
    doc.setFontSize(8)
    doc.setTextColor(...COLORS.muted)
    doc.text(
      `ResumeIQ Analysis Report  |  Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    )
  }

  doc.save("ResumeIQ-Report.pdf")
}
