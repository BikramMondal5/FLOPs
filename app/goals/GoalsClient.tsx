"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Plus,
  Target,
  Bell,
  Trash2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Award,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import GoalSummary from "@/components/goals/GoalSummary";
import GoalsGrid from "@/components/goals/GoalsGrid";
import SavingsTimeline from "@/components/goals/SavingsTimeline";
import GoalCategories from "@/components/goals/GoalCategories";
import Milestones from "@/components/goals/Milestones";
import ContributionHistory from "@/components/goals/ContributionHistory";
import CreateGoalModal from "@/components/goals/CreateGoalModal";
import GoalDetailsDrawer from "@/components/goals/GoalDetailsDrawer";
import type { GoalDashboardDTO, SmartGoalDetailsDTO } from "@/features/goals/dto/goal-dashboard.dto";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/ai-insights", label: "AI Insights" },
  { href: "/security", label: "Security" },
  { href: "/dashboard", label: "Dashboard" },
];

interface GoalsClientProps {
  initialData: GoalDashboardDTO;
  userName: string;
}

export default function GoalsClient({ initialData, userName }: GoalsClientProps) {
  const [data, setData] = useState<GoalDashboardDTO>(initialData);
  const [selectedGoal, setSelectedGoal] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleRefetch = async () => {
    try {
      const res = await fetch("/api/goals/dashboard");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGoal = async (name: string, target: number) => {
    try {
      const targetDate = new Date();
      targetDate.setFullYear(targetDate.getFullYear() + 2); // 2 years out default

      const payload = {
        name,
        targetAmount: target,
        currentContribution: 0,
        targetDate: targetDate.toISOString(),
        category: "Emergency Fund",
        priority: "Medium",
        status: "Active",
      };

      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setCreateModalOpen(false);
        handleRefetch();
      } else {
        alert("Failed to create goal.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMoney = async (id: string, amount = 5000) => {
    // Locate active target goal
    const targetGoal = data.goals.find((g) => g.goal._id === id);
    if (!targetGoal) return;

    try {
      const newContribution = targetGoal.saved + amount;
      const res = await fetch(`/api/goals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentContribution: newContribution }),
      });

      if (res.ok) {
        handleRefetch();
        alert(`Successfully contributed ₹${amount.toLocaleString()}!`);
      } else {
        alert("Failed to contribute money.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDetailsOpen(false);
        setSelectedGoal(null);
        handleRefetch();
      } else {
        alert("Failed to delete goal.");
      }
    } catch (err) {
      console.error(err);
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

  const { summary, goals, recommendations } = data;

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

      {/* Navbar */}
      <nav
        className="sticky top-0 z-30 mx-auto flex w-full items-center justify-between px-6 md:px-8 border-b border-[#F6B7CF]/10 bg-[#FCFCFD]/80 backdrop-blur-md shrink-0"
        style={{ height: "72px" }}
      >
        <Link href="/" className="flex items-center gap-2 no-underline z-10 relative">
          <Image
            src="/logo.png"
            alt="FLOPs logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-contain"
            priority
          />
          <span className="font-medium text-[#18181B] text-lg">FLOPs</span>
        </Link>

        <div className="flex items-center z-10 relative">
          <Link
            href="/overview"
            className="no-underline text-[15px] font-medium text-white shadow-sm"
            style={{
              fontFamily: "var(--font-body)",
              background: "#18181B",
              borderRadius: "999px",
              padding: "10px 24px",
            }}
          >
            My Overview
          </Link>
        </div>
      </nav>

      {/* Main Grid Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row p-6 md:p-8 gap-6 md:gap-8 relative z-10">
        
        {/* Sidebar */}
        <div className="hidden lg:block z-20 fixed left-6 md:left-8 top-[96px] w-[280px] h-[calc(100vh-128px)]">
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

        {/* Workspace Column */}
        <div className="flex-grow flex flex-col gap-6 md:gap-8 z-10 lg:pl-[304px]">
          {/* Header Panel */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 bg-white border border-[#F6B7CF]/15 rounded-xl flex items-center justify-center text-[#18181B]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div>
                <h1 className="text-4xl md:text-5xl font-normal text-[#18181B] m-0 tracking-tight leading-none">
                  Financial Goals
                </h1>
                <p className="text-[13px] text-[#6B7280] mt-1.5 m-0 max-w-[420px]">
                  Track progress, health status and timelines dynamically driven by Savings Engine.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="text-xs font-semibold py-2.5 px-4 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Goal</span>
            </button>
          </header>

          {goals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 bg-white border border-[#F6B7CF]/15 rounded-[32px] shadow-sm text-center max-w-[600px] mx-auto mt-10">
              <div className="w-[64px] h-[64px] bg-[#FFF4F8] rounded-2xl flex items-center justify-center text-[#D46A96] border border-[#F6B7CF]/20 mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-zinc-800">No Goal Trackers Active</h2>
              <p className="text-xs text-zinc-500 mt-2 max-w-[320px] mb-6">Create emergency funds or laptops trackers to monitor milestones.</p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="text-xs font-semibold py-2 px-5 bg-zinc-800 text-white rounded-full"
              >
                Create Tracker
              </button>
            </div>
          ) : (
            <motion.main
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-6 md:gap-8"
            >
              {/* Summary KPIs */}
              <motion.div variants={itemVariants}>
                <GoalSummary
                  activeGoals={summary.activeGoalsCount}
                  totalGoalValue={summary.totalTargetAmount}
                  savedSoFar={summary.totalSaved}
                  completionRate={Math.round(summary.averageProgressPercentage)}
                />
              </motion.div>

              {/* Goals Cards list */}
              <motion.div variants={itemVariants} className="w-full">
                <GoalsGrid
                  goals={goals.map((g) => ({
                    id: g.goal._id,
                    name: g.goal.name,
                    category: g.goal.category,
                    icon: "🎯",
                    target: g.goal.targetAmount,
                    saved: g.saved,
                    remaining: g.remaining,
                    targetDate: g.estimatedCompletionDate,
                    status: g.health === "Completed" ? "Completed" : g.health === "On Track" ? "On Track" : "Delayed",
                    color: g.goal.color || "#D46A96",
                    bgColor: "#FFF4F8",
                    borderColor: "#F6B7CF]/20",
                  }))}
                  onSelectGoal={(g) => {
                    const matched = goals.find((item) => item.goal._id === g.id);
                    setSelectedGoal(matched);
                    setDetailsOpen(true);
                  }}
                  onAddMoney={handleAddMoney}
                />
              </motion.div>

              {/* Savings charts timeline */}
              <motion.div variants={itemVariants} className="w-full">
                <SavingsTimeline />
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                <div className="xl:col-span-2">
                  <Milestones />
                </div>
                <div>
                  <ContributionHistory />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="w-full">
                <GoalCategories />
              </motion.div>
            </motion.main>
          )}
        </div>

        {/* Right sticky sidebar recommendations */}
        <div className="w-full lg:w-[360px] shrink-0 z-10 flex flex-col gap-6 md:gap-8">
          
          {/* Smart Savings recommendations */}
          <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-[#D46A96]" />
              <h3 className="text-base font-semibold text-zinc-800 m-0">Goal Recommendations</h3>
            </div>

            <div className="flex flex-col gap-3">
              {recommendations.map((recText, idx) => (
                <div key={idx} className="p-3 bg-[#FFF4F8] border border-[#F6B7CF]/10 text-zinc-700 text-xs rounded-xl">
                  {recText}
                </div>
              ))}
              {recommendations.length === 0 && (
                <div className="py-4 text-center text-xs text-zinc-400">
                  No adjustments required. Trackers are running on track.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Stepper Wizard Modal */}
      <AnimatePresence>
        {createModalOpen && (
          <CreateGoalModal
            onClose={() => setCreateModalOpen(false)}
            onCreate={handleCreateGoal}
          />
        )}
      </AnimatePresence>

      {/* Details drawer */}
      <AnimatePresence>
        {detailsOpen && selectedGoal && (
          <GoalDetailsDrawer
            goal={{
              id: selectedGoal.goal._id,
              name: selectedGoal.goal.name,
              category: selectedGoal.goal.category,
              icon: "🎯",
              target: selectedGoal.goal.targetAmount,
              saved: selectedGoal.saved,
              remaining: selectedGoal.remaining,
              targetDate: selectedGoal.estimatedCompletionDate,
              status: selectedGoal.health === "Completed" ? "Completed" : selectedGoal.health === "On Track" ? "On Track" : "Delayed",
              color: selectedGoal.goal.color || "#D46A96",
              bgColor: "#FFF4F8",
              borderColor: "#F6B7CF]/20",
            }}
            onClose={() => {
              setDetailsOpen(false);
              setSelectedGoal(null);
            }}
            onDelete={handleDeleteGoal}
            onAddMoney={handleAddMoney}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
