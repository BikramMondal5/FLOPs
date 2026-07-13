"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, PlusCircle, CheckCircle2, TrendingUp, RefreshCw, Zap } from "lucide-react";

export default function AIAssistantPanel() {
  const suggestions = [
    { name: "Optimize Budget", desc: "Trim unnecessary expenses in dining.", icon: Zap },
    { name: "Detect Subscriptions", desc: "Identify active recurring payments.", icon: RefreshCw },
    { name: "Weekly Summary", desc: "Generate summary for the past 7 days.", icon: CheckCircle2 },
    { name: "Investment Suggestions", desc: "Optimize savings allocation rates.", icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col gap-6 w-full lg:sticky lg:top-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-[30px] h-[30px] bg-[#FFF4F8] rounded-lg flex items-center justify-center text-[#D46A96] border border-[#F6B7CF]/20">
          <Brain className="w-4.5 h-4.5" />
        </div>
        <h3 className="text-base font-semibold text-[#18181B] m-0">AI Financial Assistant</h3>
      </div>

      {/* Main AI Insight Card */}
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ duration: 0.3 }}
        className="p-6 bg-radial from-[#FFF4F8] to-white border border-[#F6B7CF]/25 rounded-[24px] shadow-[0_12px_40px_rgba(246,183,207,0.08)] relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-[-30px] right-[-30px] w-24 h-24 rounded-full bg-[#F6B7CF]/20 blur-xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#D46A96] animate-[pulse_2s_infinite]" />
          <span className="text-[11px] font-bold text-[#D46A96] uppercase tracking-wider">Today's Insight</span>
        </div>

        <p className="text-[13px] text-[#18181B] font-medium leading-relaxed m-0">
          You spent 18% less on dining this week. Consider moving the savings toward your Emergency Fund.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-2 mt-6">
          <button className="flex-1 text-[11px] font-semibold py-2 px-3 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full transition-all duration-300 shadow-sm cursor-pointer text-center">
            View Details
          </button>
          <button className="flex-1 text-[11px] font-semibold py-2 px-3 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full transition-all duration-300 cursor-pointer text-center">
            Generate Report
          </button>
        </div>
      </motion.div>

      {/* Quick AI Suggestions */}
      <div className="flex flex-col gap-3">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">Quick Suggestions</span>
        
        <div className="flex flex-col gap-3">
          {suggestions.map((sug, idx) => {
            const Icon = sug.icon;
            return (
              <motion.div
                key={sug.name}
                whileHover={{ x: 3, scale: 1.005 }}
                transition={{ duration: 0.2 }}
                className="group flex items-center justify-between p-4 bg-white border border-[#F6B7CF]/12 rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:border-[#F6B7CF]/25 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-[34px] h-[34px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-[#D46A96] group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-semibold text-[#18181B] m-0">{sug.name}</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5 m-0 leading-tight">{sug.desc}</p>
                  </div>
                </div>
                <PlusCircle className="w-4.5 h-4.5 text-[#6B7280] group-hover:text-[#D46A96] transition-colors" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
