"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { toast } from "sonner";
import {
  Menu,
  X,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Sparkles,
  Target,
  PieChart,
  Brain,
  Trash2,
  Loader,
} from "lucide-react";
import type { FullReportDTO } from "@/features/reports/dto/report-dashboard.dto";
import type { ReportDTO } from "@/features/reports/types/report.types";
import { generateFinancialReportPDF } from "@/features/reports/generators/pdf.generator";
import { generateFinancialReportCSV } from "@/features/reports/generators/csv.generator";

interface ReportsClientProps {
  userName: string;
  userEmail?: string;
  userImage?: string | null;
}

export default function ReportsClient({ userName, userEmail, userImage }: ReportsClientProps) {
  const [generatedReport, setGeneratedReport] = useState<FullReportDTO | null>(null);
  const [reportHistory, setReportHistory] = useState<ReportDTO[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadingCSV, setIsDownloadingCSV] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteReportId, setDeleteReportId] = useState<string | null>(null);
  const [summary, setSummary] = useState({
    totalReportsGenerated: 0,
    latestReportDate: null as string | null,
    currentFinancialScore: null as number | null,
    currentNetWorth: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: -9999, y: -9999, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setMouse({ x: -9999, y: -9999, active: false });
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch("/api/reports/summary");
      const json = await res.json();
      if (json.success && json.data) {
        setSummary(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch reports summary", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/reports/history");
      const json = await res.json();
      if (json.success && json.data) {
        setReportHistory(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch report history", err);
    }
  };

  const handleGenerateReport = async (reportType: "Monthly" | "Annual" | "Custom") => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setGeneratedReport(json.data);
        fetchSummary();
        fetchHistory();
        toast.success("📊 Financial Report Generated Successfully");
      } else {
        toast.error("Failed to generate report: " + (json.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Failed to generate report", err);
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteReport = async (id: string) => {
    try {
      const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchHistory();
        fetchSummary();
        toast.success("🗑️ Report deleted successfully");
      } else {
        toast.error("Failed to delete report");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete report");
    }
  };

  const openDeleteConfirm = (id: string) => {
    setDeleteReportId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteReportId) {
      handleDeleteReport(deleteReportId);
    }
  };

  const handleDownloadPDF = (report: FullReportDTO) => {
    setIsDownloadingPDF(true);
    try {
      const blob = generateFinancialReportPDF(report);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FLOPs_Report_${new Date(report.generatedAt).toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("✅ PDF downloaded successfully");
    } catch (err) {
      console.error("PDF generation failed", err);
      toast.error("❌ Unable to generate PDF. Please try again.");
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleDownloadCSV = (report: FullReportDTO) => {
    setIsDownloadingCSV(true);
    try {
      const csv = generateFinancialReportCSV(report);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FLOPs_Report_${new Date(report.generatedAt).toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("✅ CSV downloaded successfully");
    } catch (err) {
      console.error("CSV generation failed", err);
      toast.error("❌ Unable to generate CSV. Please try again.");
    } finally {
      setIsDownloadingCSV(false);
    }
  };

  const handleDownloadHistoryReport = async (reportId: string, format: "pdf" | "csv") => {
    try {
      // Fetch the stored report from backend
      const res = await fetch(`/api/reports/${reportId}`);

      const json = await res.json();
      if (!json.success || !json.data) {
        toast.error("Failed to fetch report");
        return;
      }

      if (format === "pdf") {
        handleDownloadPDF(json.data);
      } else {
        handleDownloadCSV(json.data);
      }
    } catch (err) {
      console.error("Failed to download report", err);
      toast.error("Failed to download report");
    }
  };

  // Fetch data on mount
  useState(() => {
    fetchSummary();
    fetchHistory();
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
  } as const;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{
        backgroundColor: "#FCFCFD",
        backgroundImage: `
          linear-gradient(to right, rgba(246, 183, 207, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(246, 183, 207, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
        // @ts-ignore
        "--cx": `${mouse.x}px`,
        // @ts-ignore
        "--cy": `${mouse.y}px`,
      }}
    >
      {/* Glows */}
      {mouse.active && (
        <div
          className="absolute inset-0 pointer-events-none z-[1] transition-opacity duration-300"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(246, 183, 207, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(246, 183, 207, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
            WebkitMaskImage: "radial-gradient(circle 240px at var(--cx) var(--cy), #000 0%, #000 40%, transparent 100%)",
            maskImage: "radial-gradient(circle 240px at var(--cx) var(--cy), #000 0%, #000 40%, transparent 100%)",
          }}
        />
      )}

      {/* Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none z-0 bg-radial from-[#F6B7CF]/10 to-transparent filter blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full pointer-events-none z-0 bg-radial from-[#F9DCE7]/15 to-transparent filter blur-[140px]" />

      <Navbar
        userInfo={{
          name: userName,
          email: userEmail,
          image: userImage,
        }}
      />

      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-12 pt-28 relative z-10">
        <div className="hidden lg:block z-20 fixed left-6 md:left-8 xl:left-12 top-[88px] w-[280px] h-[calc(100vh-120px)]">
          <Sidebar />
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/10 backdrop-blur-sm">
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="h-full w-[280px]"
            >
              <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </motion.div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        <div className="lg:ml-[304px] flex flex-col gap-6 md:gap-8 z-10">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 bg-white border border-[#F6B7CF]/15 rounded-xl flex items-center justify-center text-[#18181B]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div>
                <h1 className="text-4xl md:text-5xl font-normal text-[#18181B] m-0 tracking-tight leading-none">
                  Financial Reports
                </h1>
                <p className="text-sm text-zinc-500 mt-1.5">Generate professional AI-powered financial reports</p>
              </div>
            </div>
          </header>

          <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 md:gap-8"
          >
            {/* Quick Action Buttons */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => handleGenerateReport("Monthly")}
                disabled={isGenerating}
                className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                <FileText className="w-6 h-6 text-[#D46A96] mb-3" />
                <h3 className="text-base font-semibold text-zinc-800 m-0">Monthly Report</h3>
                <p className="text-xs text-zinc-500 mt-1">Current month analysis</p>
              </button>

              <button
                onClick={() => handleGenerateReport("Annual")}
                disabled={isGenerating}
                className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                <Calendar className="w-6 h-6 text-[#D46A96] mb-3" />
                <h3 className="text-base font-semibold text-zinc-800 m-0">Annual Report</h3>
                <p className="text-xs text-zinc-500 mt-1">Full year summary</p>
              </button>

              <button
                onClick={() => handleGenerateReport("Custom")}
                disabled={isGenerating}
                className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                <TrendingUp className="w-6 h-6 text-[#D46A96] mb-3" />
                <h3 className="text-base font-semibold text-zinc-800 m-0">Custom Report</h3>
                <p className="text-xs text-zinc-500 mt-1">Select date range</p>
              </button>
            </motion.div>

            {/* Loading State */}
            {isGenerating && (
              <motion.div variants={itemVariants} className="p-8 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm text-center">
                <Loader className="w-8 h-8 text-[#D46A96] animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-zinc-800 mb-2">Generating AI Report...</h3>
                <div className="flex flex-col gap-2 text-sm text-zinc-500">
                  <p>✓ Analyzing Accounts...</p>
                  <p>✓ Analyzing Budgets...</p>
                  <p>✓ Analyzing Goals...</p>
                  <p>⟳ Building Executive Summary...</p>
                </div>
              </motion.div>
            )}

            {/* Summary Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm">
                <span className="text-xs text-zinc-500 font-medium">Total Reports</span>
                <span className="block text-2xl font-bold text-zinc-800 mt-2">{summary.totalReportsGenerated}</span>
              </div>
              <div className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm">
                <span className="text-xs text-zinc-500 font-medium">Latest Report</span>
                <span className="block text-sm font-bold text-zinc-800 mt-2">
                  {summary.latestReportDate ? new Date(summary.latestReportDate).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm">
                <span className="text-xs text-zinc-500 font-medium">Financial Score</span>
                <span className="block text-2xl font-bold text-[#D46A96] mt-2">
                  {summary.currentFinancialScore || "N/A"}
                </span>
              </div>
              <div className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm">
                <span className="text-xs text-zinc-500 font-medium">Net Worth</span>
                <span className="block text-xl font-bold text-emerald-600 mt-2">
                  ₹{summary.currentNetWorth.toLocaleString("en-IN")}
                </span>
              </div>
            </motion.div>

            {/* Generated Report Display */}
            {generatedReport && !isGenerating && (
              <>
                {/* AI Executive Summary */}
                <motion.div variants={itemVariants} className="p-8 bg-gradient-to-br from-[#FFF4F8] to-white border border-[#F6B7CF]/20 rounded-[24px] shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-6 h-6 text-[#D46A96]" />
                    <h3 className="text-lg font-semibold text-zinc-800 m-0">AI Executive Summary</h3>
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">{generatedReport.aiSummary}</p>
                </motion.div>

                {/* Financial Summary */}
                <motion.div variants={itemVariants} className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm">
                  <h3 className="text-base font-semibold text-zinc-800 mb-4">Financial Snapshot</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-xs text-zinc-500">Net Worth</span>
                      <p className="text-lg font-bold text-zinc-800 mt-1">₹{generatedReport.summary.netWorth.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500">Income</span>
                      <p className="text-lg font-bold text-emerald-600 mt-1">₹{generatedReport.summary.totalIncome.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500">Expenses</span>
                      <p className="text-lg font-bold text-rose-600 mt-1">₹{generatedReport.summary.totalExpenses.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500">Savings Rate</span>
                      <p className="text-lg font-bold text-[#D46A96] mt-1">{generatedReport.summary.savingsRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </motion.div>

                {/* Budget Summary */}
                {generatedReport.budgets.budgets.length > 0 && (
                  <motion.div variants={itemVariants} className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <PieChart className="w-5 h-5 text-[#D46A96]" />
                      <h3 className="text-base font-semibold text-zinc-800 m-0">Budget Summary</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedReport.budgets.budgets.map((b, idx) => (
                        <div key={idx} className="p-4 bg-zinc-50 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-semibold text-zinc-800">{b.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              b.status === "Exceeded" ? "bg-rose-100 text-rose-600" :
                              b.status === "Warning" ? "bg-orange-100 text-orange-600" :
                              "bg-emerald-100 text-emerald-600"
                            }`}>{b.status}</span>
                          </div>
                          <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden mb-2">
                            <div
                              className={`h-full ${
                                b.status === "Exceeded" ? "bg-rose-500" :
                                b.status === "Warning" ? "bg-orange-500" :
                                "bg-emerald-500"
                              }`}
                              style={{ width: `${Math.min(100, b.utilization)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-zinc-600">
                            <span>₹{b.spent.toLocaleString("en-IN")}</span>
                            <span>₹{b.limit.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Goal Summary */}
                {generatedReport.goals.goals.length > 0 && (
                  <motion.div variants={itemVariants} className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-[#D46A96]" />
                      <h3 className="text-base font-semibold text-zinc-800 m-0">Goal Summary</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedReport.goals.goals.map((g, idx) => (
                        <div key={idx} className="p-4 bg-zinc-50 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-semibold text-zinc-800">{g.name}</span>
                            <span className="text-xs text-zinc-500">{g.etaMonths}mo</span>
                          </div>
                          <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-[#D46A96]" style={{ width: `${g.progress}%` }} />
                          </div>
                          <div className="flex justify-between text-xs text-zinc-600">
                            <span>₹{g.saved.toLocaleString("en-IN")}</span>
                            <span>₹{g.target.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Export Buttons */}
                <motion.div variants={itemVariants} className="flex gap-4">
                  <button
                    onClick={() => handleDownloadPDF(generatedReport)}
                    disabled={isDownloadingPDF}
                    className="flex-1 p-4 bg-[#18181B] text-white rounded-[16px] font-semibold text-sm hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloadingPDF ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download PDF
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDownloadCSV(generatedReport)}
                    disabled={isDownloadingCSV}
                    className="flex-1 p-4 bg-white border border-[#F6B7CF]/30 text-[#D46A96] rounded-[16px] font-semibold text-sm hover:bg-[#FFF4F8] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloadingCSV ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Generating CSV...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download CSV
                      </>
                    )}
                  </button>
                </motion.div>
              </>
            )}

            {/* Report History */}
            {reportHistory.length > 0 && (
              <motion.div variants={itemVariants} className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm">
                <h3 className="text-base font-semibold text-zinc-800 mb-4">Report History</h3>
                <div className="flex flex-col gap-3">
                  {reportHistory.map((report) => (
                    <div key={report._id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-zinc-800">{report.reportType} Report</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {new Date(report.generatedAt).toLocaleDateString("en-IN", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownloadHistoryReport(report._id, "pdf")}
                          className="px-3 py-1.5 text-xs font-semibold text-[#D46A96] hover:bg-[#FFF4F8] rounded-lg transition-all"
                        >
                          PDF
                        </button>
                        <button
                          onClick={() => handleDownloadHistoryReport(report._id, "csv")}
                          className="px-3 py-1.5 text-xs font-semibold text-[#D46A96] hover:bg-[#FFF4F8] rounded-lg transition-all"
                        >
                          CSV
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(report._id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!generatedReport && !isGenerating && reportHistory.length === 0 && (
              <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-20 px-6 bg-white border border-[#F6B7CF]/15 rounded-[32px] shadow-sm text-center">
                <div className="w-16 h-16 bg-[#FFF4F8] rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-[#D46A96]" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-800 mb-2">No Reports Yet</h3>
                <p className="text-sm text-zinc-500 mb-6">Generate your first financial report to get started</p>
                <button
                  onClick={() => handleGenerateReport("Monthly")}
                  className="px-6 py-3 bg-[#18181B] text-white rounded-full font-semibold text-sm hover:bg-zinc-800 transition-all"
                >
                  Generate Monthly Report
                </button>
              </motion.div>
            )}
          </motion.main>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Report?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
