"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/common/Navbar";
import {
  Menu,
  X,
  Plus,
  Brain,
  FileDown,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Send,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import type { AIInsightsDashboardDTO } from "@/features/ai/dto/ai-dashboard.dto";

interface AIClientProps {
  initialData: AIInsightsDashboardDTO;
  userName: string;
  userEmail?: string;
  userImage?: string | null;
}

export default function AIClient({ initialData, userName, userEmail, userImage }: AIClientProps) {
  const [data, setData] = useState<AIInsightsDashboardDTO>(initialData);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Chat conversational states
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: `Hello ${userName}! I am your FLOPs AI assistant. Ask me questions about your monthly spending or active savings trackers.` }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    "How can I save more?",
    "Am I on track for my laptop?",
    "Why did I spend more this month?"
  ]);
  const [loading, setLoading] = useState(false);

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

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setLoading(true);

    const nextUserMsg = { role: "user" as const, content: text };
    setChatMessages((prev) => [...prev, nextUserMsg]);
    setInputValue("");

    try {
      // Keep last 10 messages as history (excluding the current message)
      const conversationHistory = chatMessages.slice(-10);

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: conversationHistory
        })
      });
      const result = await response.json();

      if (result.success && result.data) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: result.data.reply }]);
        setSuggestedPrompts(result.data.suggestedQuestions || []);
      } else {
        setChatMessages((prev) => [...prev, { role: "assistant", content: "Unable to contact the AI assistant. Please try again." }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [...prev, { role: "assistant", content: "Unable to contact the AI assistant. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const { financialSummary, monthlyReview, recommendations, risks, opportunities, financialHealthExplanation } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { stiffness: 120, damping: 14 } }
  };

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
      {/* Glow */}
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

      {/* Radial soft background glows */}
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

        {/* Mobile Navigation Drawer */}
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
        <div className="lg:ml-[304px] flex flex-col gap-6 md:gap-8 z-10">
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
                  AI Financial Intelligence
                </h1>
                <p className="text-[13px] text-[#6B7280] mt-1.5 m-0 max-w-[480px]">
                  Explainable recommendations and monthly pattern analysis powered by Gemini.
                </p>
              </div>
            </div>
          </header>

          <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 md:gap-8"
          >
            {/* PRIMARY: FLOPs Personal Assistant - Full Width */}
            <motion.div variants={itemVariants} className="flex flex-col bg-white border border-[#F6B7CF]/15 rounded-[28px] shadow-sm overflow-hidden h-[540px]">
              {/* Header */}
              <div className="p-5 border-b border-[#F6B7CF]/10 bg-gradient-to-r from-[#FFF4F8] to-[#F9DCE7]/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Brain className="w-6 h-6 text-[#D46A96] animate-pulse" />
                  <span className="text-base font-bold text-[#D46A96]">FLOPs Personal Assistant</span>
                </div>
                <span className="text-xs text-zinc-400 uppercase tracking-wider">AI Financial Intelligence</span>
              </div>

              {/* Messages body */}
              <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-zinc-800 text-white self-end rounded-tr-none"
                        : "bg-[#FFF4F8] border border-[#F6B7CF]/10 text-zinc-700 self-start rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {loading && (
                  <div className="bg-zinc-100 text-zinc-400 text-sm p-4 rounded-2xl self-start animate-pulse">
                    Analyzing your financial data...
                  </div>
                )}
              </div>

              {/* Suggestions triggers */}
              <div className="px-5 py-3 flex flex-wrap gap-2 border-t border-[#F6B7CF]/10">
                {suggestedPrompts.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sug)}
                    disabled={loading}
                    className="text-xs font-medium py-2 px-4 bg-[#FFF4F8] border border-[#F6B7CF]/20 text-[#D46A96] hover:bg-[#F6B7CF]/10 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              {/* Input panel */}
              <div className="p-4 border-t border-[#F6B7CF]/10 flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && handleSendMessage(inputValue)}
                  placeholder="Ask about your spending, budgets, or goals..."
                  disabled={loading}
                  className="flex-grow bg-zinc-50 border border-zinc-200 text-sm py-3 px-5 rounded-xl outline-none focus:border-[#D46A96] disabled:opacity-50"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={loading || !inputValue.trim()}
                  className="w-12 h-12 bg-[#D46A96] text-white rounded-xl flex items-center justify-center hover:bg-[#d46a96]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* AI Executive Stance */}
            <motion.div variants={itemVariants} className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[28px] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-[#D46A96]" />
                  <span className="text-xs font-semibold text-[#D46A96] uppercase tracking-wider">AI Executive Stance</span>
                </div>
                <h2 className="text-2xl font-bold text-zinc-800 mb-2">{financialSummary.overallStance}</h2>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4">{financialHealthExplanation}</p>
                <div className="p-3 bg-[#FFF4F8] border border-[#F6B7CF]/10 text-[#D46A96] text-xs rounded-xl font-medium">
                  💡 Actionable: {financialSummary.actionableStep}
                </div>
              </div>

              <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-[#F6B7CF]/10 pt-4 md:pt-0 md:pl-6">
                <span className="text-xs font-semibold text-zinc-400 mb-3">KEY ACHIEVEMENTS</span>
                <div className="flex flex-col gap-2">
                  {financialSummary.achievements.map((ach, idx) => (
                    <div key={idx} className="text-xs text-zinc-600 flex items-start gap-2">
                      <span className="text-[#D46A96]">✓</span>
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Split row: Dynamic Recommendations & Risk Assessment */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              
              {/* Dynamic Recommendations */}
              <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#D46A96]" />
                  <h3 className="text-sm font-semibold text-zinc-800 m-0">Dynamic Recommendations</h3>
                </div>

                <div className="flex flex-col gap-3">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase">{rec.category}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          rec.type === "warning" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                        }`}>{rec.type}</span>
                      </div>
                      <p className="text-xs text-zinc-600 m-0 leading-normal">{rec.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-zinc-800 m-0">Risk Assessment</h3>
                </div>

                <div className="flex flex-col gap-3">
                  {risks.map((risk, idx) => (
                    <div key={idx} className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-amber-700">{risk.trigger}</span>
                        <span className="text-[9px] text-amber-500 uppercase">{risk.level} Priority</span>
                      </div>
                      <p className="text-zinc-500 m-0">{risk.impact}</p>
                    </div>
                  ))}
                  {risks.length === 0 && (
                    <span className="text-xs text-zinc-400 text-center py-4">No risk triggers detected. Safe utilization.</span>
                  )}
                </div>
              </div>

            </motion.div>
          </motion.main>
        </div>

      </div>
    </div>
  );
}
