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
  Sparkles,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import AIHealthSummary from "@/components/ai-insights/AIHealthSummary";
import AIChatWorkspace from "@/components/ai-insights/AIChatWorkspace";
import AICardsList from "@/components/ai-insights/AICardsList";
import AIReportsList from "@/components/ai-insights/AIReportsList";
import AIFinancialTimeline from "@/components/ai-insights/AIFinancialTimeline";
import GlobalBrainAssistant from "@/components/dashboard/GlobalBrainAssistant";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/ai-insights", label: "AI Insights" },
  { href: "/security", label: "Security" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function AIInsightsPage() {
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
          {/* Active styling because we are in AI Insights page */}
          <button
            onClick={() => setAiOpen(true)}
            className="w-10 h-10 bg-[#FFF4F8] border border-[#F6B7CF]/30 rounded-full flex items-center justify-center text-[#D46A96] shadow-sm cursor-pointer"
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
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-8 pb-12 pt-[96px] md:pt-[110px] relative z-10 flex flex-col lg:flex-row gap-6 md:gap-8">
        
        {/* Desktop Sidebar (Left) - Sticky! */}
        <div className="hidden lg:block z-20 sticky top-[110px] w-[280px] h-[calc(100vh-140px)] shrink-0">
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
        <div className="flex-grow flex flex-col gap-6 md:gap-8 z-10 min-w-0">
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
                  AI Financial Intelligence
                </h1>
                <p className="text-[13px] text-[#6B7280] mt-1.5 m-0 max-w-[480px] leading-relaxed">
                  Transform your financial data into personalized insights, forecasts, and smarter financial decisions through explainable AI.
                </p>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => alert("Generating new conversation session.")}
                className="text-xs font-semibold py-2.5 px-4 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Conversation</span>
              </button>
              <button
                onClick={() => alert("PDF report generated successfully.")}
                className="text-xs font-semibold py-2 px-3 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full flex items-center gap-1 transition-colors cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Generate Report</span>
              </button>
            </div>
          </header>

          <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 md:gap-8"
          >
            {/* AI Health Snapshot KPIs */}
            <motion.div variants={itemVariants}>
              <AIHealthSummary />
            </motion.div>

            {/* Conversational Left pane + Explainable charts right column split grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Left Workspace Stack: Chat + Timeline/Reports */}
              <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
                <AIChatWorkspace />
                
                {/* Timelines + report downloads directly below the Chat workspace */}
                <div className="grid grid-cols-1 md:grid-cols-23 gap-6">
                  <div className="md:col-span-13">
                    <AIFinancialTimeline />
                  </div>
                  <div className="md:col-span-10">
                    <AIReportsList />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <AICardsList />
              </div>
            </motion.div>

          </motion.main>
        </div>
      </div>

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
