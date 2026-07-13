"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw } from "lucide-react";

export default function AccountAIInsights() {
  const alerts = [
    { text: "Your salary account receives income regularly.", type: "success", icon: CheckCircle2 },
    { text: "Two accounts have overlapping subscriptions.", type: "warning", icon: AlertTriangle },
    { text: "Consider consolidating idle balances into your savings account.", type: "info", icon: Sparkles },
  ];

  const suggestions = [
    { name: "Detect duplicate subscriptions", icon: AlertCircle },
    { name: "Identify inactive accounts", icon: RefreshCw },
    { name: "Improve cash allocation", icon: Sparkles },
    { name: "Weekly account summary", icon: CheckCircle2 },
  ];

  return (
    <div className="flex flex-col gap-6 w-full lg:sticky lg:top-[96px] h-auto">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-[30px] h-[30px] bg-[#FFF4F8] rounded-lg flex items-center justify-center text-[#D46A96] border border-[#F6B7CF]/20">
          <Brain className="w-4.5 h-4.5" />
        </div>
        <h3 className="text-base font-semibold text-[#18181B] m-0">AI Account Insights</h3>
      </div>

      {/* Main Insight Card */}
      <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col gap-4">
        {/* Glow */}
        <div className="absolute top-[-30px] right-[-30px] w-24 h-24 rounded-full bg-[#F6B7CF]/10 blur-xl pointer-events-none" />

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D46A96] animate-[pulse_2s_infinite]" />
          <span className="text-[11px] font-bold text-[#D46A96] uppercase tracking-wider">Account Recommendations</span>
        </div>

        <div className="flex flex-col gap-4">
          {alerts.map((al, index) => {
            const Icon = al.icon;
            return (
              <div key={index} className="flex gap-3">
                <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${
                  al.type === "success" ? "text-emerald-500" :
                  al.type === "warning" ? "text-amber-500" : "text-[#D46A96]"
                }`} />
                <span className="text-[12.5px] font-medium text-zinc-700 leading-normal">{al.text}</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mt-4">
          <button className="flex-1 text-[11px] font-semibold py-2 px-3 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full transition-all duration-300 shadow-sm cursor-pointer text-center">
            View Recommendations
          </button>
          <button className="flex-1 text-[11px] font-semibold py-2 px-3 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full transition-all duration-300 cursor-pointer text-center">
            Optimize Accounts
          </button>
        </div>
      </div>

      {/* Smart Suggestions */}
      <div className="flex flex-col gap-3">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">Smart Suggestions</span>
        <div className="flex flex-col gap-2.5">
          {suggestions.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.name}
                whileHover={{ x: 3, scale: 1.005 }}
                transition={{ duration: 0.2 }}
                className="group flex items-center justify-between p-3.5 bg-white border border-[#F6B7CF]/12 rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:border-[#F6B7CF]/25 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-[#D46A96] shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[12px] font-semibold text-[#18181B]">{s.name}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
