"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/common/Navbar";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { toast } from "sonner";
import {
  Menu,
  X,
  Plus,
  Brain,
  ChevronRight,
  TrendingDown,
  Bell,
  Trash2,
  Calendar,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import BudgetSummary from "@/components/budget/BudgetSummary";
import BudgetProgressCircle from "@/components/budget/BudgetProgressCircle";
import CategoryBudgets from "@/components/budget/CategoryBudgets";
import BudgetAllocationBar from "@/components/budget/BudgetAllocationBar";
import BudgetTimelineChart from "@/components/budget/BudgetTimelineChart";
import RecurringExpenses from "@/components/budget/RecurringExpenses";
import BudgetTemplates from "@/components/budget/BudgetTemplates";
import CreateBudgetModal from "@/components/budget/CreateBudgetModal";
import type { BudgetDashboardDTO, SmartBudgetDetailsDTO } from "@/features/budget/dto/budget-dashboard.dto";

interface BudgetClientProps {
  initialData: BudgetDashboardDTO;
  userName: string;
  userEmail?: string;
  userImage?: string | null;
}

export default function BudgetClient({ initialData, userName, userEmail, userImage }: BudgetClientProps) {
  const [data, setData] = useState<BudgetDashboardDTO>(initialData);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteBudgetId, setDeleteBudgetId] = useState<string | null>(null);

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

  // Refetch data after mutations
  const handleRefetch = async () => {
    try {
      const res = await fetch("/api/budgets/dashboard");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to refetch budgets", err);
    }
  };

  // Create Budget Mutation
  const handleCreateBudget = async (name: string, total: number, category: string, alertThreshold: number) => {
    try {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of month
      
      const payload = {
        name,
        category,
        budgetAmount: total,
        period: "Monthly",
        startDate: now.toISOString(),
        endDate: end.toISOString(),
        alertThreshold,
      };

      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setCreateModalOpen(false);
        handleRefetch();
        toast.success("💰 Budget created successfully");
      } else {
        toast.error("Failed to create budget.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create budget.");
    }
  };

  // Delete Budget Mutation
  const handleDeleteBudget = async (id: string) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
      if (res.ok) {
        handleRefetch();
        toast.success("🗑️ Budget deleted successfully");
      } else {
        toast.error("Failed to delete budget.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete budget.");
    }
  };

  const openDeleteConfirm = (id: string) => {
    setDeleteBudgetId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteBudgetId) {
      handleDeleteBudget(deleteBudgetId);
    }
  };

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

  const { summary, budgets, alerts, forecast, insights } = data;

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

      {/* Main Grid Layout Container with top padding for fixed navbar */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-12 pt-28 relative z-10">
        {/* Desktop Sidebar (Left) - Fixed */}
        <div className="hidden lg:block z-20 fixed left-6 md:left-8 xl:left-12 top-[88px] w-[280px] h-[calc(100vh-120px)]">
          <Sidebar />
        </div>

        {/* Mobile Navigation */}
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

        {/* Main Content with left margin to account for fixed sidebar */}
        <div className="lg:ml-[304px] flex flex-col lg:flex-row gap-6 md:gap-8 z-10">
          {/* Left column - main content */}
          <div className="flex-1 flex flex-col gap-6 md:gap-8">
            {/* Header Panel */}
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden w-10 h-10 bg-white border border-[#F6B7CF]/15 rounded-xl flex items-center justify-center text-[#18181B] shadow-sm"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[15px] font-medium text-[#6B7280]">Interactive Budget Engine</span>
                  <h1 className="text-4xl md:text-5xl font-normal text-[#18181B] m-0 tracking-tight leading-none">
                    Budgets
                  </h1>
                </div>
              </div>

              <button
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center gap-2 text-sm font-semibold text-white bg-[#18181B] px-5 py-2.5 rounded-full shadow hover:bg-[#27272a] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Tracker</span>
              </button>
            </header>

            {/* Action Grid Layout */}
            <motion.main
              variants={containerVariants}
              initial="hidden"
            animate="show"
            className="flex flex-col gap-6 md:gap-8"
          >
            {/* Summary Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
              <div className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm flex flex-col">
                <span className="text-xs text-zinc-500 font-medium">Total Active Budget Limit</span>
                <span className="text-2xl font-bold text-zinc-800 mt-2">₹{summary.totalBudgetLimit.toLocaleString("en-IN")}</span>
              </div>
              <div className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm flex flex-col">
                <span className="text-xs text-zinc-500 font-medium">Current Spent Utilization</span>
                <span className="text-2xl font-bold text-zinc-800 mt-2">₹{summary.totalSpent.toLocaleString("en-IN")}</span>
              </div>
              <div className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm flex flex-col">
                <span className="text-xs text-zinc-500 font-medium">Total Remaining Budget</span>
                <span className="text-2xl font-bold text-[#D46A96] mt-2">₹{summary.totalRemaining.toLocaleString("en-IN")}</span>
              </div>
            </motion.div>

            {/* Custom Interactive Progress Bar Display */}
            <motion.div variants={itemVariants} className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm">
              <h3 className="text-base font-semibold text-zinc-800 mb-3">Overall Allocation Utilization</h3>
              <div className="w-full bg-zinc-100 h-3.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#D46A96] h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, summary.overallHealthProgress)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs text-zinc-500 mt-2">
                <span>{summary.overallHealthProgress.toFixed(0)}% utilized</span>
                <span>{summary.activeBudgetsCount} Active Trackers</span>
              </div>
            </motion.div>

            {/* Budget Trackers list */}
            {budgets.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center justify-center py-16 px-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm text-center"
              >
                <div className="w-16 h-16 bg-[#FFF4F8] rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-[#D46A96]" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-800 mb-2">No Budget Trackers Yet</h3>
                <p className="text-sm text-zinc-500 mb-6 max-w-md">
                  Create category budgets to monitor spending habits and receive proactive financial alerts.
                </p>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="flex items-center gap-2 text-sm font-semibold text-white bg-[#18181B] px-6 py-3 rounded-full shadow hover:bg-[#27272a] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Tracker</span>
                </button>
              </motion.div>
            ) : (
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgets.map((eb) => (
                  <div
                    key={eb.budget._id}
                    className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm flex flex-col relative"
                  >
                    <button
                      onClick={() => openDeleteConfirm(eb.budget._id)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{
                        eb.budget.category === "Food & Dining" ? "🍔" :
                        eb.budget.category === "Bills & Utilities" ? "⚡" :
                        eb.budget.category === "Shopping" ? "🛍️" :
                        eb.budget.category === "Transportation" ? "🚗" :
                        eb.budget.category === "Travel" ? "✈️" :
                        eb.budget.category === "Entertainment" ? "🎬" :
                        eb.budget.category === "Health & Fitness" ? "❤️" :
                        eb.budget.category === "Education" ? "📚" :
                        eb.budget.category === "Housing" ? "🏠" :
                        eb.budget.category === "Personal Care" ? "💅" :
                        eb.budget.category === "Gifts & Donations" ? "🎁" :
                        eb.budget.category === "Insurance" ? "🛡️" :
                        eb.budget.category === "Taxes" ? "📝" :
                        eb.budget.category === "Fees & Charges" ? "💸" :
                        "🪙"
                      }</span>
                      <div>
                        <h4 className="text-base font-bold text-zinc-800 m-0">{eb.budget.name}</h4>
                        <span className="text-xs text-zinc-400 font-medium uppercase tracking-tight">{eb.budget.category}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs text-zinc-500">Spent: ₹{eb.spent.toLocaleString("en-IN")}</span>
                      <span className="text-sm font-bold text-zinc-800">Limit: ₹{eb.budget.budgetAmount.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          eb.status === "Exceeded"
                            ? "bg-rose-500"
                            : eb.status === "Warning"
                            ? "bg-orange-500"
                            : eb.status === "Watch"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(100, eb.progressPercentage)}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs text-zinc-500">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold ${
                          eb.status === "Exceeded"
                            ? "bg-rose-50 text-rose-600"
                            : eb.status === "Warning"
                            ? "bg-orange-50 text-orange-600"
                            : eb.status === "Watch"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {eb.status}
                      </span>
                      <span>{eb.daysRemaining} days remaining</span>
                    </div>

                    {/* Smart Projections Panel */}
                    <div className="mt-4 p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-medium">Month-End Projection:</span>
                      <span className="font-bold text-zinc-800">₹{eb.projectedSpend.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.main>
          </div>

          {/* Right sidebar panel */}
          <div className="w-full lg:w-[360px] shrink-0 z-10 flex flex-col gap-6 md:gap-8">
          
          {budgets.length > 0 ? (
            <>
              {/* Smart Budget Projections Widget */}
              <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#D46A96]" />
                  <h3 className="text-base font-semibold text-zinc-800 m-0">End-of-Period Projections</h3>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center text-xs border-b border-zinc-100 pb-2.5">
                    <span className="text-zinc-500 font-medium">Expected Spend:</span>
                    <span className="font-bold text-zinc-800">₹{forecast.projectedEndSpend.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-zinc-100 pb-2.5">
                    <span className="text-zinc-500 font-medium">Projected Overspending:</span>
                    <span className="font-bold text-rose-600">₹{forecast.expectedOverspending.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium">Expected Savings:</span>
                    <span className="font-bold text-emerald-600">₹{forecast.expectedSavings.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Budget Health and Alerts Panel */}
              <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm">
                <h3 className="text-base font-semibold text-zinc-800 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#D46A96]" />
                  <span>Budget Alerts</span>
                </h3>
                <div className="flex flex-col gap-3">
                  {alerts.map((alertMessage, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl text-xs flex gap-2 items-start"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{alertMessage}</span>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <div className="py-4 text-center text-xs text-zinc-400">
                      No utilization alerts triggered. All trackers running smoothly.
                    </div>
                  )}
                </div>
              </div>

              {/* Rule insights */}
              <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm">
                <h3 className="text-base font-semibold text-zinc-800 mb-4">Rule-Based Insights</h3>
                <div className="flex flex-col gap-3">
                  {insights.map((ins, idx) => (
                    <div key={idx} className="p-3 bg-[#FFF4F8] border border-[#F6B7CF]/10 text-zinc-700 text-xs rounded-xl">
                      {ins}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm text-center">
              <div className="w-14 h-14 bg-[#FFF4F8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-[#D46A96]" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-800 mb-2">No Budget Data</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Create your first budget tracker to unlock projections and budget alerts.
              </p>
            </div>
          )}

        </div>

        </div>

      </div>

      <AnimatePresence>
        {createModalOpen && (
          <CreateBudgetModal
            onClose={() => setCreateModalOpen(false)}
            onCreate={handleCreateBudget}
          />
        )}
      </AnimatePresence>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Budget?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
