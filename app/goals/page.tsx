"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Plus,
  Brain,
  FileDown,
  Target,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import GoalSummary from "@/components/goals/GoalSummary";
import HeroGoal from "@/components/goals/HeroGoal";
import GoalsGrid from "@/components/goals/GoalsGrid";
import SavingsTimeline from "@/components/goals/SavingsTimeline";
import GoalCategories from "@/components/goals/GoalCategories";
import Milestones from "@/components/goals/Milestones";
import ContributionHistory from "@/components/goals/ContributionHistory";
import CreateGoalModal from "@/components/goals/CreateGoalModal";
import GoalDetailsDrawer from "@/components/goals/GoalDetailsDrawer";
import GlobalBrainAssistant from "@/components/dashboard/GlobalBrainAssistant";

interface Goal {
  id: string;
  name: string;
  category: string;
  icon: string;
  target: number;
  saved: number;
  remaining: number;
  targetDate: string;
  status: "On Track" | "Ahead" | "Delayed" | "Completed";
  color: string;
  bgColor: string;
  borderColor: string;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/ai-insights", label: "AI Insights" },
  { href: "/security", label: "Security" },
  { href: "/dashboard", label: "Dashboard" },
];

const initialGoals: Goal[] = [
  {
    id: "g1",
    name: "Dream Home",
    category: "Home",
    icon: "🏡",
    target: 350000,
    saved: 120000,
    remaining: 230000,
    targetDate: "Dec 2028",
    status: "On Track",
    color: "#D46A96",
    bgColor: "#FFF4F8",
    borderColor: "#F6B7CF]/20",
  },
  {
    id: "g2",
    name: "New Family Car",
    category: "Vehicle",
    icon: "🚗",
    target: 120000,
    saved: 85000,
    remaining: 35000,
    targetDate: "Jul 2027",
    status: "Ahead",
    color: "#B19FFB",
    bgColor: "#EEF2F6",
    borderColor: "#E2E8F0",
  },
  {
    id: "g3",
    name: "Europe Trip Plan",
    category: "Travel",
    icon: "✈️",
    target: 95000,
    saved: 45000,
    remaining: 50000,
    targetDate: "Oct 2026",
    status: "Delayed",
    color: "#E88AB3",
    bgColor: "#FFF4F8",
    borderColor: "#F6B7CF]/20",
  },
  {
    id: "g4",
    name: "Emergency Reserve",
    category: "Emergency",
    icon: "🛡️",
    target: 30000,
    saved: 30000,
    remaining: 0,
    targetDate: "Completed",
    status: "Completed",
    color: "#DFC5D0",
    bgColor: "#F9DCE7",
    borderColor: "#F6B7CF]/10",
  },
];

export default function FinancialGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
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

  // Add Money handler
  const handleAddMoney = (id: string, amount: number = 5000) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const newSaved = Math.min(g.saved + amount, g.target);
          return {
            ...g,
            saved: newSaved,
            remaining: g.target - newSaved,
            status: newSaved === g.target ? "Completed" : g.status,
          };
        }
        return g;
      })
    );

    // Sync selected details view state
    setSelectedGoal((curr) => {
      if (curr && curr.id === id) {
        const newSaved = Math.min(curr.saved + amount, curr.target);
        return {
          ...curr,
          saved: newSaved,
          remaining: curr.target - newSaved,
          status: newSaved === curr.target ? "Completed" : curr.status,
        };
      }
      return curr;
    });

    alert(`Successfully deposited ₹${amount.toLocaleString()}!`);
  };

  // Delete goal callback
  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setDetailsOpen(false);
    setSelectedGoal(null);
  };

  // Stepper finished callback
  const handleCreateGoal = (name: string, target: number) => {
    const newGoal: Goal = {
      id: `gl${Date.now()}`,
      name,
      category: "Investment",
      icon: "📈",
      target,
      saved: 0,
      remaining: target,
      targetDate: "Dec 2027",
      status: "On Track",
      color: "#D46A96",
      bgColor: "#FFF4F8",
      borderColor: "#F6B7CF]/20",
    };
    setGoals((prev) => [newGoal, ...prev]);
    setCreateModalOpen(false);
  };

  // Aggregated math
  const activeCount = goals.length + 1; // plus 1 for MacBook featured
  const totalValue = goals.reduce((sum, g) => sum + g.target, 0) + 250000;
  const savedVal = goals.reduce((sum, g) => sum + g.saved, 0) + 182000;
  const completionRateVal = Math.round((savedVal / totalValue) * 100) || 57;

  // Stagger configurations
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
      {/* Masked Cursor Glow */}
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

      {/* Background radial soft pink glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none z-0 bg-radial from-[#F6B7CF]/10 to-transparent filter blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full pointer-events-none z-0 bg-radial from-[#F9DCE7]/15 to-transparent filter blur-[140px]" />

      {/* Top Navbar matching the landing page */}
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
          <span
            className="font-medium text-[#18181B]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              letterSpacing: "-0.01em",
            }}
          >
            FLOPs
          </span>
        </Link>

        {/* Center Desktop nav links */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-8 pointer-events-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="no-underline transition-opacity duration-150 text-[15px]"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#18181B",
                  opacity: 0.8,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Brain Assistant Trigger icon */}
        <div className="flex items-center gap-4 z-10 relative">
          <button
            onClick={() => setAiOpen(true)}
            className="w-10 h-10 bg-white border border-[#F6B7CF]/15 rounded-full flex items-center justify-center text-[#D46A96] shadow-sm hover:bg-[#FFF4F8] transition-colors cursor-pointer"
          >
            <Brain className="w-5 h-5 animate-pulse" />
          </button>
          
          <Link
            href="/plan"
            className="no-underline text-[15px] font-medium text-white"
            style={{
              fontFamily: "var(--font-body)",
              background: "#18181B",
              borderRadius: "999px",
              padding: "10px 24px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main Layout Grid Container */}
      <div className="flex-1 flex flex-col lg:flex-row p-6 md:p-8 gap-6 md:gap-8 relative z-10">
        
        {/* Desktop Sidebar (Left) - Fixed! */}
        <div className="hidden lg:block z-20 fixed left-6 md:left-8 top-[96px] w-[280px] h-[calc(100vh-128px)]">
          <Sidebar />
        </div>

        {/* Mobile Drawer Navigation */}
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

        {/* Main Workspace Column */}
        <div className="flex-grow flex flex-col gap-6 md:gap-8 z-10 lg:pl-[304px]">
          {/* Header section with actions */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 bg-white border border-[#F6B7CF]/15 rounded-xl flex items-center justify-center text-[#18181B] shadow-sm hover:bg-[#FFF4F8] transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div>
                <h1
                  className="text-4xl md:text-5xl font-normal text-[#18181B] m-0 tracking-tight leading-none"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Financial Goals
                </h1>
                <p className="text-[13px] text-[#6B7280] mt-1.5 m-0 max-w-[420px]">
                  Create, track, and achieve your financial goals with clear progress and intelligent planning.
                </p>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => alert("CSV Export feature triggered.")}
                className="text-xs font-semibold py-2 px-3 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full transition-colors cursor-pointer"
              >
                <span>Import Goals</span>
              </button>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="text-xs font-semibold py-2.5 px-4 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Goal</span>
              </button>
            </div>
          </header>

          {goals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 px-6 bg-white border border-[#F6B7CF]/15 rounded-[32px] shadow-sm text-center max-w-[600px] mx-auto mt-10"
            >
              <div className="w-[64px] h-[64px] bg-[#FFF4F8] rounded-2xl flex items-center justify-center text-[#D46A96] border border-[#F6B7CF]/20 mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-[#18181B] m-0" style={{ fontFamily: "var(--font-body)" }}>
                No Goals Yet
              </h2>
              <p className="text-[13px] text-[#6B7280] mt-2 mb-6 max-w-[360px] leading-relaxed">
                Start creating financial goals and let FLOPs help you achieve them with intelligent planning.
              </p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="text-xs font-semibold py-2.5 px-6 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
              >
                Create Your First Goal
              </button>
            </motion.div>
          ) : (
            <motion.main
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-6 md:gap-8"
            >
              {/* Goals Summary KPIs */}
              <motion.div variants={itemVariants}>
                <GoalSummary
                  activeGoals={activeCount}
                  totalGoalValue={totalValue}
                  savedSoFar={savedVal}
                  completionRate={completionRateVal}
                />
              </motion.div>

              {/* Large Featured Primary Goal Card */}
              <motion.div variants={itemVariants}>
                <HeroGoal
                  onAddMoney={() => handleAddMoney("featured_macbook", 10000)}
                  onViewDetails={() => {
                    setSelectedGoal({
                      id: "featured_macbook",
                      name: "New MacBook Pro",
                      category: "Electronics",
                      icon: "💻",
                      target: 250000,
                      saved: 182000,
                      remaining: 68000,
                      targetDate: "Dec 2026",
                      status: "On Track",
                      color: "#D46A96",
                      bgColor: "#FFF4F8",
                      borderColor: "#F6B7CF]/20",
                    });
                    setDetailsOpen(true);
                  }}
                />
              </motion.div>

              {/* Grid of active goals cards */}
              <motion.div variants={itemVariants} className="w-full">
                <GoalsGrid
                  goals={goals}
                  onSelectGoal={(g) => {
                    setSelectedGoal(g);
                    setDetailsOpen(true);
                  }}
                  onAddMoney={(id) => handleAddMoney(id, 5000)}
                />
              </motion.div>

              {/* Savings Timeline interactive AreaChart */}
              <motion.div variants={itemVariants} className="w-full">
                <SavingsTimeline />
              </motion.div>

              {/* Milestones timeline + Contributions lists columns */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                <div className="xl:col-span-2">
                  <Milestones />
                </div>
                <div>
                  <ContributionHistory />
                </div>
              </motion.div>

              {/* Categories highlights */}
              <motion.div variants={itemVariants} className="w-full">
                <GoalCategories />
              </motion.div>

            </motion.main>
          )}
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

      {/* Details slide-over drawer overlay */}
      <AnimatePresence>
        {detailsOpen && selectedGoal && (
          <GoalDetailsDrawer
            goal={selectedGoal}
            onClose={() => {
              setDetailsOpen(false);
              setSelectedGoal(null);
            }}
            onDelete={handleDeleteGoal}
            onAddMoney={handleAddMoney}
          />
        )}
      </AnimatePresence>

      {/* Reusable Global AI Brain Assistant Drawer */}
      <AnimatePresence>
        {aiOpen && (
          <GlobalBrainAssistant
            isOpen={aiOpen}
            onClose={() => setAiOpen(false)}
            currentPageName="Overview"
            onSelectSuggestion={(sug) => alert(`AI Analysis Triggered: "${sug}"`)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
