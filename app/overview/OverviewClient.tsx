"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/common/Navbar";
import {
  Menu,
  X,
  Bell,
  Wallet,
  Receipt,
  PiggyBank,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import MetricCard from "@/components/dashboard/MetricCard";
import SpendingChart from "@/components/dashboard/SpendingChart";
import BreakdownChart from "@/components/dashboard/BreakdownChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import QuickActions from "@/components/dashboard/QuickActions";
import CreateTransactionModal from "@/components/transactions/CreateTransactionModal";
import EditTransactionModal from "@/components/transactions/EditTransactionModal";
import ArchiveTransactionModal from "@/components/transactions/ArchiveTransactionModal";
import type { FinancialDashboardDTO } from "@/features/analytics/dto/dashboard.dto";
import type { AccountDTO } from "@/features/accounts/types/account.types";
import type { TransactionDTO } from "@/features/transactions/types/transaction.types";

interface OverviewClientProps {
  userName: string;
  userEmail?: string;
  userImage?: string | null;
}

export default function OverviewClient({ userName, userEmail, userImage }: OverviewClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: -9999, y: -9999, active: false });

  // ── Analytics data ──────────────────────────────────────────────────────
  const [data, setData] = useState<FinancialDashboardDTO | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "success" | "error">("loading");

  // ── Accounts list (needed by Create/Edit modals) ────────────────────────
  const [accounts, setAccounts] = useState<AccountDTO[]>([]);

  // ── Modal state ─────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [editTx, setEditTx] = useState<TransactionDTO | null>(null);
  const [archiveTx, setArchiveTx] = useState<TransactionDTO | null>(null);

  // ── Fetch dashboard analytics ───────────────────────────────────────────
  const fetchDashboard = useCallback(async () => {
    setLoadState("loading");
    try {
      const res = await fetch("/api/analytics/dashboard?range=This%20Month", {
        cache: "no-store",
      });
      const result = await res.json();
      if (result.success && result.data) {
        setData(result.data as FinancialDashboardDTO);
        setLoadState("success");
      } else {
        setLoadState("error");
      }
    } catch {
      setLoadState("error");
    }
  }, []);

  // ── Fetch accounts list (once, for modals) ──────────────────────────────
  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch("/api/accounts?archived=false", { cache: "no-store" });
      const result = await res.json();
      if (result.success && result.data) {
        setAccounts(result.data as AccountDTO[]);
      }
    } catch {
      // accounts will remain empty; modals will degrade gracefully
    }
  }, []);

  // Initial loads on mount
  useEffect(() => {
    fetchDashboard();
    fetchAccounts();
  }, [fetchDashboard, fetchAccounts]);

  // ── Mutation callbacks — each fires an automatic re-fetch ───────────────
  const handleCreated = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleUpdated = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleArchived = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ── Mouse glow ──────────────────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
  };
  const handleMouseLeave = () => setMouse({ x: -9999, y: -9999, active: false });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
  } as const;

  // ── Shared page chrome (navbar + sidebar + glow) ────────────────────────
  const pageShell = (children: React.ReactNode, rightPanel?: React.ReactNode) => (
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
      {/* Masked Glow */}
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

      {/* Radial Backdrops */}
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

        {/* Mobile Drawer */}
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
            {/* Header */}
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden w-10 h-10 bg-white border border-[#F6B7CF]/15 rounded-xl flex items-center justify-center text-[#18181B] shadow-sm hover:bg-[#FFF4F8] transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[15px] font-medium text-[#6B7280]">Good Morning, {userName} 👋</span>
                  <h1
                    className="text-4xl md:text-5xl font-normal text-[#18181B] m-0 tracking-tight leading-none"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Overview
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchDashboard}
                  disabled={loadState === "loading"}
                  title="Refresh dashboard"
                  className="w-10 h-10 bg-white border border-[#F6B7CF]/15 rounded-full flex items-center justify-center text-[#18181B] shadow-sm hover:bg-[#FFF4F8] transition-colors disabled:opacity-40"
                >
                  <RefreshCw className={`w-4 h-4 ${loadState === "loading" ? "animate-spin" : ""}`} />
                </button>
                <button className="w-10 h-10 bg-white border border-[#F6B7CF]/15 rounded-full flex items-center justify-center text-[#18181B] shadow-sm hover:bg-[#FFF4F8] transition-colors relative">
                  <Bell className="w-4.5 h-4.5" />
                  <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#D46A96] rounded-full" />
                </button>
              </div>
            </header>

            {children}
          </div>

          {/* Right sidebar panel */}
          {rightPanel}
        </div>
      </div>

      {/* ── Modals — mounted always so they can animate in/out ── */}
      <CreateTransactionModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          handleCreated();
        }}
        accounts={accounts}
      />

      <EditTransactionModal
        transaction={editTx}
        onClose={() => setEditTx(null)}
        onUpdated={() => {
          setEditTx(null);
          handleUpdated();
        }}
        accounts={accounts}
      />

      <ArchiveTransactionModal
        transaction={archiveTx}
        onClose={() => setArchiveTx(null)}
        onArchived={() => {
          setArchiveTx(null);
          handleArchived();
        }}
      />
    </div>
  );

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loadState === "loading" && !data) {
    return pageShell(
      <div className="flex flex-col gap-6 md:gap-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[120px] bg-white rounded-[24px] border border-[#F6B7CF]/10" />
          ))}
        </div>
        <div className="h-[120px] bg-white rounded-[24px] border border-[#F6B7CF]/10" />
        <div className="h-[320px] bg-white rounded-[24px] border border-[#F6B7CF]/10" />
        <div className="h-[240px] bg-white rounded-[24px] border border-[#F6B7CF]/10" />
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (loadState === "error" && !data) {
    return pageShell(
      <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white border border-[#F6B7CF]/15 rounded-[32px]">
        <AlertTriangle className="w-10 h-10 text-rose-400" />
        <p className="text-sm font-semibold text-zinc-700">Could not load dashboard analytics.</p>
        <button
          onClick={fetchDashboard}
          className="text-xs font-semibold py-2.5 px-6 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Loaded ───────────────────────────────────────────────────────────────
  const { summary, categories, monthlyTrends, recentTransactions } = data!;

  const rightPanel = (
    <div className="w-full lg:w-[360px] shrink-0 z-10 flex flex-col gap-6 md:gap-8">
      {/* Financial Health Score */}
      <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col relative overflow-hidden">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-[#18181B] m-0">Financial Health Score</h3>
          <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Engine Calculated Health index</p>
        </div>
        
        {data!.health.score === null ? (
          // Empty state for insufficient data
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-[#FFF4F8] flex items-center justify-center bg-[#FFF4F8]/30 mb-4">
              <span className="text-3xl font-black text-[#D46A96]">—</span>
            </div>
            <h4 className="text-sm font-bold text-[#18181B] m-0 mb-2">Let&apos;s get started!</h4>
            <p className="text-xs text-[#6B7280] leading-relaxed max-w-[280px]">
              Create your first account and add transactions to receive a personalized financial health score.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-5 mt-2">
              <div className="relative w-20 h-20 rounded-full border-4 border-[#FFF4F8] flex items-center justify-center bg-[#FFF4F8]/30">
                <span className="text-2xl font-black text-[#D46A96]">{data!.health.score}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-zinc-400">Score Rating</span>
                <h4 className="text-base font-bold text-[#18181B] m-0">{data!.health.rating}</h4>
              </div>
            </div>
            <hr className="border-[#F6B7CF]/10 my-4" />
            <div className="flex flex-col gap-3">
              {data!.health.healthInsights.map((insightText, idx) => (
                <div key={idx} className="flex gap-2 items-start text-xs text-zinc-600">
                  <ShieldCheck className="w-4 h-4 text-[#D46A96] shrink-0 mt-0.5" />
                  <span>{insightText}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Rule-Based Insights */}
      <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col">
        <h3 className="text-base font-semibold text-[#18181B] mb-4">Rule-Based Insights</h3>
        <div className="flex flex-col gap-3">
          {data!.insights.map((ins, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs leading-relaxed ${
                ins.type === "positive"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                  : ins.type === "warning"
                  ? "bg-rose-50 border-rose-100 text-rose-800"
                  : "bg-[#FFF4F8] border-[#F6B7CF]/10 text-zinc-700"
              }`}
            >
              {ins.message}
            </div>
          ))}
        </div>
      </div>

      <BreakdownChart categories={categories} totalExpenses={summary.totalExpenses} />
    </div>
  );

  return pageShell(
    <motion.main variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6 md:gap-8">
      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <MetricCard
          title="Net Worth"
          value={summary.totalBalance}
          trend="Synced Assets"
          isPositive={true}
          icon={Wallet}
          sparklineData={data!.cashFlow.sparkline}
          prefix="₹"
        />
        <MetricCard
          title="Monthly Spending"
          value={summary.totalExpenses}
          trend="This Month"
          isPositive={false}
          icon={Receipt}
          sparklineData={data!.cashFlow.sparkline}
          prefix="₹"
        />
        <MetricCard
          title="Savings Rate"
          value={summary.savingsRate}
          trend="Target: 20%"
          isPositive={summary.savingsRate >= 20}
          icon={PiggyBank}
          sparklineData={[0, 10, summary.savingsRate]}
          suffix="%"
        />
        <MetricCard
          title="Daily Average"
          value={summary.avgDailySpending}
          trend="Burn Rate"
          isPositive={true}
          icon={TrendingUp}
          sparklineData={data!.cashFlow.sparkline}
          prefix="₹"
        />
      </motion.div>

      {/* Quick Actions — "Add Transaction" opens CreateTransactionModal */}
      <motion.div variants={itemVariants}>
        <QuickActions onAddTransaction={() => setCreateOpen(true)} />
      </motion.div>

      {/* Spending Chart */}
      <motion.div variants={itemVariants} className="w-full">
        <SpendingChart monthlyTrends={monthlyTrends} trends={data!.trends} />
      </motion.div>

      {/* Recent Transactions — with Edit and Archive row actions */}
      <motion.div variants={itemVariants} className="w-full">
        <RecentTransactions
          transactions={recentTransactions}
          onEdit={(tx) => setEditTx(tx)}
          onArchive={(tx) => setArchiveTx(tx)}
        />
      </motion.div>
    </motion.main>,
    rightPanel
  );
}
