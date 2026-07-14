"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Plus,
  FileDown,
  FileUp,
  Brain,
  Star,
  ChevronRight,
  TrendingDown,
  Receipt,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import Sidebar from "@/components/dashboard/Sidebar";
import TransactionSummary from "@/components/transactions/TransactionSummary";
import FilterToolbar from "@/components/transactions/FilterToolbar";
import QuickStats from "@/components/transactions/QuickStats";
import TransactionDetailsDrawer from "@/components/transactions/TransactionDetailsDrawer";
import GlobalBrainAssistant from "@/components/dashboard/GlobalBrainAssistant";

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  time: string;
  status: string;
  bank: string;
  type: "Income" | "Expense" | "Refund" | "Pending";
  icon: string;
  favorite?: boolean;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/ai-insights", label: "AI Insights" },
  { href: "/security", label: "Security" },
  { href: "/dashboard", label: "Dashboard" },
];

const categoryBadges: Record<string, { badge: string; color: string; border: string }> = {
  Food: { badge: "🍔", color: "bg-[#FFF4F8]", border: "border-[#F6B7CF]/20" },
  Bills: { badge: "⚡", color: "bg-amber-50", border: "border-amber-100" },
  Travel: { badge: "✈️", color: "bg-indigo-50", border: "border-indigo-100" },
  Shopping: { badge: "🛍️", color: "bg-purple-50", border: "border-purple-100" },
  Health: { badge: "❤️", color: "bg-rose-50", border: "border-rose-100" },
  Entertainment: { badge: "🎬", color: "bg-pink-50", border: "border-pink-100" },
  Income: { badge: "💼", color: "bg-emerald-50", border: "border-emerald-100" },
  Salary: { badge: "💼", color: "bg-emerald-50", border: "border-emerald-100" },
  Investment: { badge: "📈", color: "bg-sky-50", border: "border-sky-100" },
};

const initialTransactions: Transaction[] = [
  {
    id: "tx1",
    merchant: "McDonald's",
    category: "Food",
    amount: -420,
    date: "Today",
    time: "2:45 PM",
    status: "Completed",
    bank: "ICICI Bank",
    type: "Expense",
    icon: "🍔",
    favorite: false,
  },
  {
    id: "tx2",
    merchant: "Salary Credit",
    category: "Salary",
    amount: 65000,
    date: "Yesterday",
    time: "9:00 AM",
    status: "Received",
    bank: "HDFC Bank",
    type: "Income",
    icon: "💼",
    favorite: true,
  },
  {
    id: "tx3",
    merchant: "Amazon Cloud Services",
    category: "Bills",
    amount: -8900,
    date: "Jul 11, 2026",
    time: "11:15 AM",
    status: "Completed",
    bank: "Axis Bank",
    type: "Expense",
    icon: "⚡",
    favorite: false,
  },
  {
    id: "tx4",
    merchant: "Uber Ride",
    category: "Travel",
    amount: -320,
    date: "Jul 10, 2026",
    time: "6:30 PM",
    status: "Completed",
    bank: "ICICI Bank",
    type: "Expense",
    icon: "✈️",
    favorite: false,
  },
  {
    id: "tx5",
    merchant: "Zara Retail",
    category: "Shopping",
    amount: -4890,
    date: "Jul 08, 2026",
    time: "4:20 PM",
    status: "Completed",
    bank: "HDFC Bank",
    type: "Expense",
    icon: "🛍️",
    favorite: true,
  },
  {
    id: "tx6",
    merchant: "Netflix Subscription",
    category: "Entertainment",
    amount: -649,
    date: "Jul 05, 2026",
    time: "10:00 AM",
    status: "Pending",
    bank: "Axis Bank",
    type: "Pending",
    icon: "🎬",
    favorite: false,
  },
];

const mockMonthlyChart = {
  Weekly: [
    { name: "Mon", Expense: 1200 },
    { name: "Tue", Expense: 2800 },
    { name: "Wed", Expense: 1500 },
    { name: "Thu", Expense: 4200 },
    { name: "Fri", Expense: 3800 },
    { name: "Sat", Expense: 6000 },
    { name: "Sun", Expense: 2200 },
  ],
  Monthly: [
    { name: "Food", Expense: 18200 },
    { name: "Bills", Expense: 24500 },
    { name: "Travel", Expense: 12800 },
    { name: "Shopping", Expense: 32000 },
    { name: "Health", Expense: 8500 },
    { name: "Entertainment", Expense: 15000 },
  ],
  Yearly: [
    { name: "Jan", Expense: 112000 },
    { name: "Feb", Expense: 98000 },
    { name: "Mar", Expense: 124000 },
    { name: "Apr", Expense: 118000 },
    { name: "May", Expense: 135000 },
    { name: "Jun", Expense: 122980 },
  ],
};

const doughnutData = [
  { name: "Shopping", value: 32000, color: "#D46A96" },
  { name: "Bills", value: 24500, color: "#E88AB3" },
  { name: "Food", value: 18200, color: "#F4B3C2" },
  { name: "Entertainment", value: 15000, color: "#B19FFB" },
  { name: "Travel", value: 12800, color: "#DFC5D0" },
  { name: "Health", value: 8500, color: "#9EABB3" },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter toolbar states
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("All");
  const [category, setCategory] = useState("All");
  const [account, setAccount] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // Chart view state
  const [chartFilter, setChartFilter] = useState<"Weekly" | "Monthly" | "Yearly">("Monthly");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Filter computation
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bank.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = category === "All" || t.category === category;
    const matchesAccount = account === "All" || t.bank.includes(account);

    // Dynamic date range mock matches
    let matchesDate = true;
    if (dateRange === "Today") matchesDate = t.date === "Today";
    else if (dateRange === "This Week") matchesDate = t.date === "Today" || t.date === "Yesterday";
    else if (dateRange === "This Month") matchesDate = true; // All mock items fall in current month

    return matchesSearch && matchesCategory && matchesAccount && matchesDate;
  });

  // Sort computation
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "Newest") return 1; // Simplistic mock date sorting
    if (sortBy === "Oldest") return -1;
    if (sortBy === "Highest") return Math.abs(b.amount) - Math.abs(a.amount);
    if (sortBy === "Lowest") return Math.abs(a.amount) - Math.abs(b.amount);
    return 0;
  });

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setDateRange("All");
    setCategory("All");
    setAccount("All");
    setSortBy("Newest");
  };

  // Disconnect / delete transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setDetailsOpen(false);
    setSelectedTx(null);
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, favorite: !t.favorite } : t))
    );
  };

  // Add new mock transaction
  const handleAddTransaction = () => {
    const newTx: Transaction = {
      id: `tx${Date.now()}`,
      merchant: "Coffee Brews",
      category: "Food",
      amount: -Math.floor(150 + Math.random() * 500),
      date: "Today",
      time: "4:05 PM",
      status: "Completed",
      bank: "HDFC Bank",
      type: "Expense",
      icon: "🍔",
      favorite: false,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // KPI math
  const totalCount = 1248;
  const incomeVal = 184250;
  const expensesVal = 122980;
  const avgDailyVal = 2430;

  // Stagger animations
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
        <div className="flex-1 flex flex-col gap-6 md:gap-8 z-10 lg:pl-[304px]">
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
                  Transactions
                </h1>
                <p className="text-[13px] text-[#6B7280] mt-1.5 m-0 max-w-[420px]">
                  Track, filter, and understand every financial transaction from one unified workspace.
                </p>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => alert("CSV Export feature triggered.")}
                className="text-xs font-semibold py-2 px-3 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full flex items-center gap-1 transition-colors cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => alert("CSV Import feature triggered.")}
                className="text-xs font-semibold py-2 px-3 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full flex items-center gap-1 transition-colors cursor-pointer"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Import CSV</span>
              </button>
              <button
                onClick={handleAddTransaction}
                className="text-xs font-semibold py-2.5 px-4 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>
            </div>
          </header>

          {/* Conditional Display (Main Grid or Empty state) */}
          {transactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 px-6 bg-white border border-[#F6B7CF]/15 rounded-[32px] shadow-sm text-center max-w-[600px] mx-auto mt-10"
            >
              <div className="w-[64px] h-[64px] bg-[#FFF4F8] rounded-2xl flex items-center justify-center text-[#D46A96] border border-[#F6B7CF]/20 mb-6">
                <Receipt className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-[#18181B] m-0" style={{ fontFamily: "var(--font-body)" }}>
                No Transactions Yet
              </h2>
              <p className="text-[13px] text-[#6B7280] mt-2 mb-6 max-w-[360px] leading-relaxed">
                Start tracking your finances by adding your first transaction.
              </p>
              <button
                onClick={handleAddTransaction}
                className="text-xs font-semibold py-2.5 px-6 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
              >
                Add Transaction
              </button>
            </motion.div>
          ) : (
            <motion.main
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-6 md:gap-8"
            >
              {/* Summary KPIs */}
              <motion.div variants={itemVariants}>
                <TransactionSummary
                  totalCount={totalCount}
                  income={incomeVal}
                  expenses={expensesVal}
                  avgDaily={avgDailyVal}
                />
              </motion.div>

              {/* Floating Filter Toolbar */}
              <motion.div variants={itemVariants}>
                <FilterToolbar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  category={category}
                  setCategory={setCategory}
                  account={account}
                  setAccount={setAccount}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  onClearFilters={handleClearFilters}
                />
              </motion.div>

              {/* Apple Wallet / Copilot Money style Compact Cards list */}
              <motion.div variants={itemVariants} className="flex flex-col gap-3.5">
                {sortedTransactions.map((tx) => {
                  const isExpense = tx.type === "Expense" || tx.type === "Pending";
                  const isIncome = tx.type === "Income";
                  const isRefund = tx.type === "Refund";
                  
                  const badgeInfo = categoryBadges[tx.category] || { badge: "💸", color: "bg-zinc-50", border: "border-zinc-100" };

                  return (
                    <motion.div
                      key={tx.id}
                      onClick={() => {
                        setSelectedTx(tx);
                        setDetailsOpen(true);
                      }}
                      whileHover={{ y: -3, scale: 1.005 }}
                      className="p-4 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-[#F6B7CF]/30 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group relative overflow-hidden"
                    >
                      {/* Glow inside hover card */}
                      <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-[#FFF4F8]/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex items-center gap-3">
                        {/* Icon badge */}
                        <div className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center text-xl shrink-0 border ${badgeInfo.color} ${badgeInfo.border}`}>
                          {badgeInfo.badge}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-[13.5px] font-semibold text-[#18181B] m-0 leading-normal">{tx.merchant}</h4>
                            {tx.favorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10.5px] text-[#6B7280] mt-1 leading-none">
                            <span>{tx.category}</span>
                            <span className="text-[#F6B7CF]/50">•</span>
                            <span>{tx.bank}</span>
                            <span className="text-[#F6B7CF]/50">•</span>
                            <span>{tx.date} • {tx.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right amount and status actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 pl-14 sm:pl-0">
                        {/* Amount */}
                        <div className="text-right">
                          <div className={`text-[15px] font-bold ${
                            isIncome ? "text-emerald-600" :
                            isRefund ? "text-sky-600" : "text-[#18181B]"
                          }`}>
                            {isIncome ? "+" : isRefund ? "↺ " : "-"}₹{Math.abs(tx.amount).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1.5 justify-end mt-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              tx.status === "Completed" || tx.status === "Received" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                            }`} />
                            <span className="text-[10px] font-medium text-zinc-400 leading-none">{tx.status}</span>
                          </div>
                        </div>

                        {/* Spark Action buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleToggleFavorite(tx.id, e)}
                            className="w-8 h-8 rounded-full border border-zinc-100 hover:border-[#F6B7CF]/30 flex items-center justify-center text-zinc-400 hover:text-amber-500 transition-colors"
                          >
                            <Star className={`w-3.5 h-3.5 ${tx.favorite ? "fill-amber-400 text-amber-400" : ""}`} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Highlights Panels */}
              <motion.div variants={itemVariants}>
                <QuickStats />
              </motion.div>

              {/* Double Visualizations: Expense Area & Category Distribution */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                {/* Large Interactive Area Chart */}
                <div className="xl:col-span-2 p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[360px] relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6 shrink-0">
                    <div>
                      <h3 className="text-base font-semibold text-[#18181B] m-0">Monthly Spend Analysis</h3>
                      <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Spending trends visualizer</p>
                    </div>

                    {/* Filter Toggle Buttons */}
                    <div className="flex gap-1.5 bg-[#FFF4F8] p-1 rounded-full border border-[#F6B7CF]/10">
                      {(["Weekly", "Monthly", "Yearly"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setChartFilter(type)}
                          className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                            chartFilter === type
                              ? "bg-[#D46A96] text-white shadow-sm"
                              : "text-[#6B7280] hover:text-[#18181B]"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="w-full h-full flex-grow">
                    {mounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockMonthlyChart[chartFilter]} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="txGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#D46A96" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#D46A96" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                          <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} dx={-5} tickFormatter={(val) => `₹${val}`} />
                          <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "16px", border: "1px solid rgba(246,183,207,0.2)" }} formatter={(val: any) => [`₹${val.toLocaleString()}`, "Expenses"]} />
                          <Area type="monotone" dataKey="Expense" stroke="#D46A96" strokeWidth={2} fillOpacity={1} fill="url(#txGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">Loading analysis visualizer...</div>
                    )}
                  </div>
                </div>

                {/* Category Doughnut Chart breakdown */}
                <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[360px] relative overflow-hidden">
                  <div className="mb-4 shrink-0">
                    <h3 className="text-base font-semibold text-[#18181B] m-0">Category Share</h3>
                    <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Spending ratios breakdown</p>
                  </div>

                  <div className="flex flex-col items-center justify-center flex-grow gap-4">
                    {/* Doughnut Container */}
                    <div className="w-[140px] h-[140px] relative shrink-0">
                      {mounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={doughnutData}
                              cx="50%"
                              cy="50%"
                              innerRadius={46}
                              outerRadius={66}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {doughnutData.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "12px", border: "1px solid rgba(246,183,207,0.2)" }} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400 font-semibold">Loading...</div>
                      )}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[9px] uppercase font-bold text-[#6B7280]">Total</span>
                        <span className="text-sm font-extrabold text-[#18181B] mt-0.5">₹1,11,000</span>
                      </div>
                    </div>

                    {/* Legends */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-2">
                      {doughnutData.slice(0, 4).map((item) => (
                        <div key={item.name} className="flex items-center gap-1.5 text-[11px]">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="font-semibold text-zinc-600 truncate">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

            </motion.main>
          )}
        </div>
      </div>

      {/* Transaction Details slide-over drawer */}
      <AnimatePresence>
        {detailsOpen && selectedTx && (
          <TransactionDetailsDrawer
            transaction={selectedTx}
            onClose={() => {
              setDetailsOpen(false);
              setSelectedTx(null);
            }}
            onDelete={handleDeleteTransaction}
          />
        )}
      </AnimatePresence>

      {/* Reusable Global AI Brain Assistant Drawer */}
      <AnimatePresence>
        {aiOpen && (
          <GlobalBrainAssistant
            isOpen={aiOpen}
            onClose={() => setAiOpen(false)}
            currentPageName="Transactions"
            onSelectSuggestion={(sug) => alert(`AI Analysis Triggered: "${sug}"`)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
