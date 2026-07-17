import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { FullReportDTO } from "../dto/report-dashboard.dto";

const BRAND_COLOR = "#D46A96";

export function generateFinancialReportPDF(report: FullReportDTO): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // ────────────────────────────────────────────
  // Cover Page
  // ────────────────────────────────────────────
  doc.setFontSize(32);
  doc.setTextColor(BRAND_COLOR);
  doc.text("FLOPs", pageWidth / 2, yPos, { align: "center" });
  yPos += 12;

  doc.setFontSize(18);
  doc.setTextColor("#18181B");
  doc.text("AI Financial Report", pageWidth / 2, yPos, { align: "center" });
  yPos += 10;

  doc.setFontSize(11);
  doc.setTextColor("#71717A");
  const reportDate = new Date(report.generatedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(`Generated ${reportDate}`, pageWidth / 2, yPos, { align: "center" });
  yPos += 20;

  // ────────────────────────────────────────────
  // AI Executive Summary
  // ────────────────────────────────────────────
  doc.setFontSize(14);
  doc.setTextColor(BRAND_COLOR);
  doc.text("Executive Summary", 20, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setTextColor("#3F3F46");
  const summaryLines = doc.splitTextToSize(report.aiSummary, pageWidth - 40);
  doc.text(summaryLines, 20, yPos);
  yPos += summaryLines.length * 5 + 10;

  // ────────────────────────────────────────────
  // Financial Snapshot
  // ────────────────────────────────────────────
  doc.setFontSize(14);
  doc.setTextColor(BRAND_COLOR);
  doc.text("Financial Snapshot", 20, yPos);
  yPos += 8;

  autoTable(doc, {
    startY: yPos,
    head: [["Metric", "Value"]],
    body: [
      ["Net Worth", `₹${report.summary.netWorth.toLocaleString("en-IN")}`],
      ["Income", `₹${report.summary.totalIncome.toLocaleString("en-IN")}`],
      ["Expenses", `₹${report.summary.totalExpenses.toLocaleString("en-IN")}`],
      ["Savings Rate", `${report.summary.savingsRate.toFixed(1)}%`],
      ["Daily Avg Spending", `₹${report.summary.dailyAverageSpending.toLocaleString("en-IN")}`],
      ["Health Score", report.summary.financialHealthScore?.toString() || "N/A"],
      ["Budget Utilization", `${report.summary.budgetUtilization.toFixed(1)}%`],
      ["Goal Progress", `${report.summary.goalProgress.toFixed(1)}%`],
    ],
    theme: "grid",
    headStyles: { fillColor: BRAND_COLOR, textColor: "#FFFFFF" },
    styles: { fontSize: 10 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // ────────────────────────────────────────────
  // Accounts
  // ────────────────────────────────────────────
  if (report.accounts.accountsList.length > 0) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(BRAND_COLOR);
    doc.text("Accounts", 20, yPos);
    yPos += 8;

    autoTable(doc, {
      startY: yPos,
      head: [["Account", "Type", "Balance"]],
      body: report.accounts.accountsList.map((acc) => [
        acc.name,
        acc.type,
        `₹${acc.balance.toLocaleString("en-IN")}`,
      ]),
      theme: "grid",
      headStyles: { fillColor: BRAND_COLOR, textColor: "#FFFFFF" },
      styles: { fontSize: 9 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // ────────────────────────────────────────────
  // Budgets
  // ────────────────────────────────────────────
  if (report.budgets.budgets.length > 0) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(BRAND_COLOR);
    doc.text("Budgets", 20, yPos);
    yPos += 8;

    autoTable(doc, {
      startY: yPos,
      head: [["Category", "Limit", "Spent", "Remaining", "Status"]],
      body: report.budgets.budgets.map((b) => [
        b.category,
        `₹${b.limit.toLocaleString("en-IN")}`,
        `₹${b.spent.toLocaleString("en-IN")}`,
        `₹${b.remaining.toLocaleString("en-IN")}`,
        b.status,
      ]),
      theme: "grid",
      headStyles: { fillColor: BRAND_COLOR, textColor: "#FFFFFF" },
      styles: { fontSize: 9 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // ────────────────────────────────────────────
  // Goals
  // ────────────────────────────────────────────
  if (report.goals.goals.length > 0) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(BRAND_COLOR);
    doc.text("Goals", 20, yPos);
    yPos += 8;

    autoTable(doc, {
      startY: yPos,
      head: [["Goal", "Target", "Saved", "Progress", "ETA"]],
      body: report.goals.goals.map((g) => [
        g.name,
        `₹${g.target.toLocaleString("en-IN")}`,
        `₹${g.saved.toLocaleString("en-IN")}`,
        `${g.progress.toFixed(1)}%`,
        `${g.etaMonths} months`,
      ]),
      theme: "grid",
      headStyles: { fillColor: BRAND_COLOR, textColor: "#FFFFFF" },
      styles: { fontSize: 9 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // ────────────────────────────────────────────
  // Footer
  // ────────────────────────────────────────────
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const footerY = doc.internal.pageSize.getHeight() - 15;
    
    doc.setFontSize(8);
    doc.setTextColor("#A1A1AA");
    doc.text("Generated by FLOPs - AI Powered Personal Finance Platform", pageWidth / 2, footerY, {
      align: "center",
    });
    
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 20, footerY, { align: "right" });
  }

  return doc.output("blob");
}
