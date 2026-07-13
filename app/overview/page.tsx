"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Search,
  Bell,
  Wallet,
  Receipt,
  PiggyBank,
  TrendingUp,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import MetricCard from "@/components/dashboard/MetricCard";
import SpendingChart from "@/components/dashboard/SpendingChart";
import BreakdownChart from "@/components/dashboard/BreakdownChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import FinancialGoals from "@/components/dashboard/FinancialGoals";
import QuickActions from "@/components/dashboard/QuickActions";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/ai-insights", label: "AI Insights" },
  { href: "/security", label: "Security" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function OverviewDashboard() {
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

  // Stagger animation container
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

        <div className="flex items-center z-10 relative">
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

      {/* Main Grid Section (Sidebar + Content Workspace + Right Panel) */}
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

        {/* Main Dashboard Space */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8 z-10 lg:pl-[304px]">
          {/* Top Header Greeting Panel */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 bg-white border border-[#F6B7CF]/15 rounded-xl flex items-center justify-center text-[#18181B] shadow-sm hover:bg-[#FFF4F8] transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex flex-col gap-1.5">
                <span className="text-[15px] font-medium text-[#6B7280]">Good Morning, Bikram 👋</span>
                <h1
                  className="text-4xl md:text-5xl font-normal text-[#18181B] m-0 tracking-tight leading-none"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Overview
                </h1>
              </div>
            </div>

            {/* Right Header Navigation Panel */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-white/70 backdrop-blur-md border border-[#F6B7CF]/15 px-3 py-1.5 rounded-full shadow-sm max-w-[200px]">
                <Search className="w-4.5 h-4.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search report..."
                  className="w-full text-xs text-[#18181B] bg-transparent outline-none placeholder-zinc-400"
                />
              </div>

              {/* Notification bell */}
              <button className="w-10 h-10 bg-white border border-[#F6B7CF]/15 rounded-full flex items-center justify-center text-[#18181B] shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:bg-[#FFF4F8] transition-colors relative">
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#D46A96] rounded-full shadow-[0_0_6px_#F6B7CF]" />
              </button>

              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full border border-[#F6B7CF]/30 bg-[#FFF4F8] text-[#D46A96] font-bold flex items-center justify-center shadow-sm overflow-hidden text-sm cursor-pointer hover:border-[#F6B7CF]/60 transition-colors">
                BM
              </div>
            </div>
          </header>

          {/* Dashboard Grid Content */}
          <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 md:gap-8"
          >
            {/* Section 1: Financial Snapshot KPI Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <MetricCard
                title="Net Worth"
                value={842000}
                trend="+12%"
                isPositive={true}
                icon={Wallet}
                sparklineData={[750000, 765000, 780000, 792000, 810000, 825000, 842000]}
                prefix="₹"
              />
              <MetricCard
                title="Monthly Spending"
                value={32450}
                trend="-6%"
                isPositive={true}
                icon={Receipt}
                sparklineData={[38000, 36200, 37500, 35100, 34200, 33500, 32450]}
                prefix="₹"
              />
              <MetricCard
                title="Savings Rate"
                value={24}
                trend="+3%"
                isPositive={true}
                icon={PiggyBank}
                sparklineData={[21, 22, 21.5, 23, 22.8, 23.5, 24]}
                suffix="%"
              />
              <MetricCard
                title="Investment Growth"
                value={18.2}
                trend="+4.2%"
                isPositive={true}
                icon={TrendingUp}
                sparklineData={[14.1, 15.2, 14.8, 16.3, 17.1, 17.5, 18.2]}
                prefix="+"
                suffix="%"
              />
            </motion.div>

            {/* Quick Actions Panel */}
            <motion.div variants={itemVariants}>
              <QuickActions />
            </motion.div>

            {/* Section 2: Expense Analytics Charts */}
            <motion.div variants={itemVariants} className="w-full">
              <SpendingChart />
            </motion.div>

            {/* Section 3: Transactions */}
            <motion.div variants={itemVariants} className="w-full">
              <RecentTransactions />
            </motion.div>
          </motion.main>
        </div>

        {/* Sticky Right Panel & Relocated Goals (360px) */}
        <div className="w-full lg:w-[360px] shrink-0 z-10 flex flex-col gap-6 md:gap-8">
          <FinancialGoals />
          <BreakdownChart />
        </div>

      </div>
    </div>
  );
}
