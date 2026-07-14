"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion as motionElement, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Plus,
  Copy,
  Brain,
  FileDown,
  ChevronRight,
  TrendingDown,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import BudgetSummary from "@/components/budget/BudgetSummary";
import BudgetProgressCircle from "@/components/budget/BudgetProgressCircle";
import CategoryBudgets from "@/components/budget/CategoryBudgets";
import BudgetAllocationBar from "@/components/budget/BudgetAllocationBar";
import BudgetTimelineChart from "@/components/budget/BudgetTimelineChart";
import RecurringExpenses from "@/components/budget/RecurringExpenses";
import BudgetTemplates from "@/components/budget/BudgetTemplates";
import BudgetAlerts from "@/components/budget/BudgetAlerts";
import CreateBudgetModal from "@/components/budget/CreateBudgetModal";
import GlobalBrainAssistant from "@/components/dashboard/GlobalBrainAssistant";

interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  budget: number;
  spent: number;
  remaining: number;
  color: string;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/ai-insights", label: "AI Insights" },
  { href: "/security", label: "Security" },
  { href: "/dashboard", label: "Dashboard" },
];

const initialCategories: BudgetCategory[] = [
  { id: "cat1", name: "Food", icon: "🍔", budget: 20000, spent: 18200, remaining: 1800, color: "#F6B7CF" },
  { id: "cat2", name: "Bills", icon: "⚡", budget: 25000, spent: 24500, remaining: 500, color: "#F9DCE7" },
  { id: "cat3", name: "Shopping", icon: "🛍️", budget: 30000, spent: 32000, remaining: -2000, color: "#D46A96" },
  { id: "cat4", name: "Travel", icon: "✈️", budget: 15000, spent: 12800, remaining: 2200, color: "#DFC5D0" },
  { id: "cat5", name: "Entertainment", icon: "🎬", budget: 18000, spent: 15000, remaining: 3000, color: "#B19FFB" },
  { id: "cat6", name: "Health", icon: "❤️", budget: 10000, spent: 8500, remaining: 1500, color: "#9EABB3" },
  { id: "cat7", name: "Education", icon: "📚", budget: 12000, spent: 4500, remaining: 7500, color: "#E88AB3" },
  { id: "cat8", name: "Transportation", icon: "🚗", budget: 8000, spent: 6800, remaining: 1200, color: "#F4B3C2" },
];

export default function BudgetPlannerPage() {
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);
  const [monthlyLimit, setMonthlyLimit] = useState(138000);
  const [spentLimit, setSpentLimit] = useState(122300);
  const [savingsTarget, setSavingsTarget] = useState(20000);
  
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

  // Stepper Modal finish callback
  const handleCreateBudget = (name: string, total: number) => {
    setMonthlyLimit(total);
    setSpentLimit(Math.round(total * 0.57)); // Scale spent to match 57%
    setCreateModalOpen(false);
  };

  // Quick apply template callback
  const handleApplyTemplate = (total: number) => {
    setMonthlyLimit(total);
    setSpentLimit(Math.round(total * 0.42)); // Scale to a safe zone
    alert(`Applied Template Budget Limit of ₹${total.toLocaleString()}`);
  };

  const remainingLimit = monthlyLimit - spentLimit;

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

      {/* Main Grid Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row p-6 md:p-8 gap-6 md:gap-8 relative z-10">
        
        {/* Desktop Sidebar (Left) - Fixed! */}
        <div className="hidden lg:block z-20 fixed left-6 md:left-8 top-[96px] w-[280px] h-[calc(100vh-128px)]">
          <Sidebar />
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/10 backdrop-blur-sm">
            <motionElement.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="h-full w-[280px]"
            >
              <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </motionElement.div>
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
                  Budget Planner
                </h1>
                <p className="text-[13px] text-[#6B7280] mt-1.5 m-0 max-w-[420px]">
                  Plan smarter budgets, monitor spending limits, and stay on track with your financial goals.
                </p>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => alert("Duplicate Budget feature triggered.")}
                className="text-xs font-semibold py-2 px-3 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Duplicate Plan</span>
              </button>
              <button
                onClick={() => alert("CSV Export feature triggered.")}
                className="text-xs font-semibold py-2 px-3 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full flex items-center gap-1 transition-colors cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="text-xs font-semibold py-2.5 px-4 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Budget</span>
              </button>
            </div>
          </header>

          <motionElement.main
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 md:gap-8"
          >
            {/* Budget Summary KPIs */}
            <motionElement.div variants={itemVariants}>
              <BudgetSummary
                monthlyBudget={monthlyLimit}
                spent={spentLimit}
                remaining={remainingLimit}
                savingsTarget={savingsTarget}
              />
            </motionElement.div>

            {/* Hero Circular Progress Ring */}
            <motionElement.div variants={itemVariants} className="w-full">
              <BudgetProgressCircle
                monthlyBudget={monthlyLimit}
                spent={spentLimit}
                remaining={remainingLimit}
                savingsTarget={savingsTarget}
              />
            </motionElement.div>

            {/* Grid of category budget cards */}
            <motionElement.div variants={itemVariants} className="w-full">
              <CategoryBudgets
                categories={categories}
                onEditBudget={(cat) => alert(`Editing budget for ${cat.name}`)}
                onViewTransactions={(catName) => alert(`Redirecting to ${catName} transactions.`)}
              />
            </motionElement.div>

            {/* Segmented Allocation Bar */}
            <motionElement.div variants={itemVariants} className="w-full">
              <BudgetAllocationBar segments={categories} />
            </motionElement.div>

            {/* Timeline Charts + Recurring lists columns */}
            <motionElement.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
              <div className="xl:col-span-2">
                <BudgetTimelineChart />
              </div>
              <div>
                <RecurringExpenses />
              </div>
            </motionElement.div>

            {/* Templates grid + Alert lists */}
            <motionElement.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <BudgetTemplates onApply={handleApplyTemplate} />
              <BudgetAlerts />
            </motionElement.div>

          </motionElement.main>
        </div>
      </div>

      {/* Stepper Wizard Modal */}
      <AnimatePresence>
        {createModalOpen && (
          <CreateBudgetModal
            onClose={() => setCreateModalOpen(false)}
            onCreate={handleCreateBudget}
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
            onSelectSuggestion={(sug) => alert(`AI Suggestion Triggered: "${sug}"`)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
