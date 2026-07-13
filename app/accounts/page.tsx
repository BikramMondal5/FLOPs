"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  Bell,
  Plus,
  FileDown,
  Filter,
  Landmark,
  Shield,
  HelpCircle,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import AccountSummary from "@/components/accounts/AccountSummary";
import QuickAccountActions from "@/components/accounts/QuickAccountActions";
import ConnectedAccounts from "@/components/accounts/ConnectedAccounts";
import RecentAccountActivity from "@/components/accounts/RecentAccountActivity";
import AccountAIInsights from "@/components/accounts/AccountAIInsights";
import AccountDetailModal from "@/components/accounts/AccountDetailModal";

interface Account {
  id: string;
  bankName: string;
  nickname: string;
  type: string;
  accountNumber: string;
  balance: number;
  availableBalance?: number;
  lastSynced: string;
  status: "Connected" | "Syncing" | "Requires Attention";
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/ai-insights", label: "AI Insights" },
  { href: "/security", label: "Security" },
  { href: "/dashboard", label: "Dashboard" },
];

const initialAccounts: Account[] = [
  {
    id: "acc1",
    bankName: "HDFC Bank",
    nickname: "Primary Savings",
    type: "Savings Account",
    accountNumber: "•••• •••• 5612",
    balance: 542000,
    availableBalance: 542000,
    lastSynced: "2 mins ago",
    status: "Connected",
  },
  {
    id: "acc2",
    bankName: "ICICI Bank",
    nickname: "Secondary Salary",
    type: "Savings Account",
    accountNumber: "•••• •••• 9821",
    balance: 185000,
    availableBalance: 185000,
    lastSynced: "5 mins ago",
    status: "Connected",
  },
  {
    id: "acc3",
    bankName: "Axis Bank",
    nickname: "Daily Expense Credit",
    type: "Credit Card",
    accountNumber: "•••• •••• 4421",
    balance: 85000,
    availableBalance: 115000,
    lastSynced: "Just now",
    status: "Syncing",
  },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
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

  // Sync function handler
  const handleSyncAccount = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          return { ...acc, status: "Syncing" };
        }
        return acc;
      })
    );

    setTimeout(() => {
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === id) {
            return { ...acc, status: "Connected", lastSynced: "Just now" };
          }
          return acc;
        })
      );
      // Update selected modal view account too
      setSelectedAccount((curr) => {
        if (curr && curr.id === id) {
          return { ...curr, status: "Connected", lastSynced: "Just now" };
        }
        return curr;
      });
    }, 2000);
  };

  // Disconnect function handler
  const handleDisconnectAccount = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    setModalOpen(false);
    setSelectedAccount(null);
  };

  // Rename function handler
  const handleRenameAccount = (id: string, newName: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, nickname: newName } : acc))
    );
    setSelectedAccount((curr) => (curr && curr.id === id ? { ...curr, nickname: newName } : curr));
  };

  // Add mock account trigger
  const handleAddAccount = () => {
    const newAcc: Account = {
      id: `acc${Date.now()}`,
      bankName: "SBI Bank",
      nickname: "Mock Retirement",
      type: "Savings Account",
      accountNumber: `•••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      balance: Math.floor(25000 + Math.random() * 150000),
      lastSynced: "Just now",
      status: "Connected",
    };
    setAccounts((prev) => [newAcc, ...prev]);
  };

  // Compute stats
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalCashFlow = 18600;

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

      {/* Main Layout Container (Sidebar + Contents Grid) */}
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
                  Accounts
                </h1>
                <p className="text-[13px] text-[#6B7280] mt-1.5 m-0 max-w-[420px]">
                  Manage your connected financial accounts and monitor balances from one unified dashboard.
                </p>
              </div>
            </div>

            {/* Header Actions panel */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-[#F6B7CF]/15 px-3 py-1.5 rounded-full shadow-sm max-w-[150px]">
                <Search className="w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs text-[#18181B] bg-transparent outline-none placeholder-zinc-400"
                />
              </div>

              {/* Status filter dropdown */}
              <div className="flex items-center gap-1.5 bg-white border border-[#F6B7CF]/15 px-3 py-1.5 rounded-full shadow-sm">
                <Filter className="w-3.5 h-3.5 text-zinc-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs font-semibold text-zinc-700 bg-transparent border-none outline-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Connected">Connected</option>
                  <option value="Syncing">Syncing</option>
                  <option value="Requires Attention">Attention</option>
                </select>
              </div>

              <button
                onClick={handleAddAccount}
                className="text-xs font-semibold py-2 px-3 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Connect Account</span>
              </button>
            </div>
          </header>

          {/* Conditional Display (Main Grid or Empty state) */}
          {accounts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 px-6 bg-white border border-[#F6B7CF]/15 rounded-[32px] shadow-sm text-center max-w-[600px] mx-auto mt-10"
            >
              <div className="w-[64px] h-[64px] bg-[#FFF4F8] rounded-2xl flex items-center justify-center text-[#D46A96] border border-[#F6B7CF]/20 mb-6">
                <Landmark className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-[#18181B] m-0" style={{ fontFamily: "var(--font-body)" }}>
                Connect Your First Financial Account
              </h2>
              <p className="text-[13px] text-[#6B7280] mt-2 mb-6 max-w-[360px] leading-relaxed">
                Securely connect your bank accounts to unlock AI-powered financial insights and unified money management.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddAccount}
                  className="text-xs font-semibold py-2.5 px-6 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                >
                  Connect Account
                </button>
                <button className="text-xs font-semibold py-2.5 px-6 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full transition-colors cursor-pointer">
                  Learn More
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.main
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-6 md:gap-8"
            >
              {/* Account Summary Cards */}
              <motion.div variants={itemVariants}>
                <AccountSummary totalBalance={totalBalance} cashFlow={totalCashFlow} />
              </motion.div>

              {/* Quick Actions Grid */}
              <motion.div variants={itemVariants}>
                <QuickAccountActions
                  onConnect={handleAddAccount}
                  onUpload={() => alert("Upload Statement Feature triggered.")}
                  onRefresh={() => {
                    accounts.forEach((acc) => handleSyncAccount(acc.id));
                  }}
                  onViewAnalytics={() => alert("Redirecting to analytics.")}
                />
              </motion.div>

              {/* Connected Accounts Card List */}
              <motion.div variants={itemVariants}>
                <ConnectedAccounts
                  accounts={accounts}
                  onSync={handleSyncAccount}
                  onSelectAccount={(acc) => {
                    setSelectedAccount(acc);
                    setModalOpen(true);
                  }}
                  searchQuery={searchQuery}
                  filterStatus={filterStatus}
                />
              </motion.div>

              {/* Recent Activity Log Table */}
              <motion.div variants={itemVariants} className="w-full">
                <RecentAccountActivity />
              </motion.div>
            </motion.main>
          )}
        </div>

        {/* Sticky Right AI Insights Column (360px) */}
        <div className="w-full lg:w-[360px] shrink-0 z-10 flex flex-col gap-6 md:gap-8">
          <AccountAIInsights />
        </div>

      </div>

      {/* Account Details Modal Overlay */}
      <AnimatePresence>
        {modalOpen && selectedAccount && (
          <AccountDetailModal
            account={selectedAccount}
            onClose={() => {
              setModalOpen(false);
              setSelectedAccount(null);
            }}
            onSync={handleSyncAccount}
            onDisconnect={handleDisconnectAccount}
            onRename={handleRenameAccount}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
