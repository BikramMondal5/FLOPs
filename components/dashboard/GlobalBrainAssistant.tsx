"use client";

import { motion } from "framer-motion";
import { Brain, X, Sparkles, AlertCircle, RefreshCw, CheckCircle2, ChevronRight } from "lucide-react";

import Link from "next/link";

interface GlobalBrainAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentPageName?: string;
  onSelectSuggestion?: (suggestion: string) => void;
}

export default function GlobalBrainAssistant({
  isOpen,
  onClose,
  currentPageName = "Dashboard",
  onSelectSuggestion,
}: GlobalBrainAssistantProps) {
  const suggestionsMap: Record<string, string[]> = {
    Overview: [
      "Show unusually high expenses.",
      "Find recurring subscriptions.",
      "Summarize this month's spending.",
    ],
    Accounts: [
      "Improve cash allocation.",
      "Identify inactive accounts.",
      "Detect duplicate subscriptions.",
    ],
    Transactions: [
      "Show unusually high expenses.",
      "Find recurring subscriptions.",
      "Summarize this month's spending.",
      "Detect duplicate payments.",
      "Find bills higher than last month.",
    ],
  };

  const suggestions = suggestionsMap[currentPageName] || suggestionsMap["Overview"];

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="fixed right-0 top-0 bottom-0 w-full sm:w-[380px] bg-[#FCFCFD] border-l border-[#F6B7CF]/20 shadow-2xl z-[999] flex flex-col justify-between"
    >
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-[#F6B7CF]/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="p-6 border-b border-[#F6B7CF]/10 flex justify-between items-center z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-[#D46A96] border border-[#F6B7CF]/20">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#18181B] m-0">AI Financial Assistant</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-zinc-400">Analyzing {currentPageName}</span>
              <span className="text-[9px] text-[#F6B7CF]">•</span>
              <Link
                href="/ai-insights"
                onClick={onClose}
                className="text-[10px] font-bold text-[#D46A96] hover:underline"
              >
                Open Full Workspace
              </Link>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white border border-[#F6B7CF]/15 flex items-center justify-center text-zinc-500 hover:text-[#18181B] shadow-sm cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-6 overflow-y-auto flex flex-col gap-6 flex-grow z-10">
        {/* Intro */}
        <div className="p-4 bg-radial from-[#FFF4F8] to-white border border-[#F6B7CF]/20 rounded-[20px] shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#D46A96]" />
            <span className="text-[11px] font-bold text-[#D46A96] uppercase tracking-wider">Ask FLOPs AI</span>
          </div>
          <p className="text-[12.5px] text-zinc-700 leading-relaxed m-0 font-medium">
            How can I optimize your financial lifestyle today? Select a shortcut query below or let me analyze your {currentPageName.toLowerCase()} logs.
          </p>
        </div>

        {/* Suggestion prompts */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">AI Suggestions</span>
          <div className="flex flex-col gap-2.5">
            {suggestions.map((prompt) => (
              <button
                key={prompt}
                onClick={() => onSelectSuggestion?.(prompt)}
                className="group w-full flex items-center justify-between p-3.5 bg-white border border-[#F6B7CF]/10 rounded-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:border-[#F6B7CF]/30 transition-all duration-300 text-left cursor-pointer"
              >
                <span className="text-[12.5px] font-semibold text-[#18181B] leading-tight pr-4">
                  {prompt}
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-[#D46A96] transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer input */}
      <div className="p-6 border-t border-[#F6B7CF]/10 bg-white z-10 flex gap-2">
        <input
          type="text"
          placeholder="Ask a custom question..."
          className="flex-1 text-xs text-[#18181B] bg-zinc-50 border border-[#F6B7CF]/15 rounded-full px-4 py-3 outline-none focus:border-[#F6B7CF]/50 transition-colors"
        />
        <button
          onClick={() => alert("Custom prompt sent to AI Assistant.")}
          className="text-xs font-semibold py-3 px-5 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
        >
          Send
        </button>
      </div>
    </motion.div>
  );
}
