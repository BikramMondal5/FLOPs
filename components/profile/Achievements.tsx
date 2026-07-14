"use client";

import { motion } from "framer-motion";
import { Award, Trophy, ShieldCheck, Sparkles } from "lucide-react";

interface Badge {
  name: string;
  icon: string;
  unlockedDate: string;
  bgColor: string;
  borderColor: string;
}

export default function Achievements() {
  const achievements: Badge[] = [
    { name: "First Budget Created", icon: "🏆", unlockedDate: "Jan 12, 2026", bgColor: "#FFF4F8", borderColor: "#F6B7CF]/20" },
    { name: "First Goal Completed", icon: "🎯", unlockedDate: "Feb 04, 2026", bgColor: "#EEF2F6", borderColor: "#E2E8F0" },
    { name: "₹1L Savings Threshold", icon: "💰", unlockedDate: "Mar 10, 2026", bgColor: "#FFF4F8", borderColor: "#F6B7CF]/10" },
    { name: "100 AI Insights Triggered", icon: "🤖", unlockedDate: "Jul 01, 2026", bgColor: "#F9DCE7", borderColor: "#F6B7CF]/15" },
  ];

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] h-full flex flex-col justify-between">
      <div className="mb-5 shrink-0">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Unlocked Badges</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Personal milestones achieved so far</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
        {achievements.map((item, idx) => (
          <motion.div
            key={item.name}
            whileHover={{ y: -3, scale: 1.01 }}
            className="p-3.5 bg-zinc-50/50 border border-[#F6B7CF]/8 rounded-[20px] hover:border-[#F6B7CF]/20 transition-all duration-300 flex items-center gap-3.5"
          >
            <div
              className="w-[36px] h-[36px] rounded-xl flex items-center justify-center text-lg border shrink-0"
              style={{ backgroundColor: item.bgColor, borderColor: item.borderColor }}
            >
              {item.icon}
            </div>
            <div>
              <h4 className="text-[12.5px] font-bold text-[#18181B] m-0 leading-tight">{item.name}</h4>
              <span className="text-[9.5px] text-[#6B7280] mt-1 block leading-none">Unlocked {item.unlockedDate}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
