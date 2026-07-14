"use client";

import { motion } from "framer-motion";
import { Sparkles, Wallet, PiggyBank, Target } from "lucide-react";

interface BudgetProgressCircleProps {
  monthlyBudget: number;
  spent: number;
  remaining: number;
  savingsTarget: number;
}

export default function BudgetProgressCircle({
  monthlyBudget,
  spent,
  remaining,
  savingsTarget,
}: BudgetProgressCircleProps) {
  const percent = Math.round((spent / monthlyBudget) * 100) || 0;
  
  // Circle path mathematics
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col items-center relative overflow-hidden w-full">
      {/* Decorative Blur */}
      <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full bg-[#F6B7CF]/5 blur-2xl pointer-events-none" />

      <div className="mb-4 text-center">
        <span className="text-[11px] font-bold text-[#D46A96] uppercase tracking-wider flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Jul Budget Status</span>
        </span>
      </div>

      {/* Main circular SVG */}
      <div className="relative w-[190px] h-[190px] flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="circlePinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D46A96" />
              <stop offset="100%" stopColor="#F6B7CF" />
            </linearGradient>
          </defs>
          
          {/* Base circle background */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="#FFF4F8"
            strokeWidth={strokeWidth}
          />
          
          {/* Active progress indicator arc */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="url(#circlePinkGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Labels */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Used</span>
          <span className="text-3xl font-extrabold text-[#18181B] tracking-tight leading-none mt-1">
            {percent}%
          </span>
          <span className="text-[11px] font-semibold text-zinc-500 mt-1">
            ₹{spent.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Details labels below */}
      <div className="grid grid-cols-3 gap-6 w-full mt-6 pt-5 border-t border-[#F6B7CF]/10">
        <div className="flex flex-col items-center text-center">
          <div className="w-[30px] h-[30px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-[#D46A96] mb-2 shrink-0">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Limit</span>
          <span className="text-[12.5px] font-bold text-[#18181B] mt-1 leading-none">₹{monthlyBudget.toLocaleString()}</span>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-[30px] h-[30px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-[#D46A96] mb-2 shrink-0">
            <PiggyBank className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Remaining</span>
          <span className="text-[12.5px] font-bold text-[#18181B] mt-1 leading-none">₹{remaining.toLocaleString()}</span>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-[30px] h-[30px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-[#D46A96] mb-2 shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Savings Goal</span>
          <span className="text-[12.5px] font-bold text-[#18181B] mt-1 leading-none">₹{savingsTarget.toLocaleString()}</span>
        </div>
      </div>

    </div>
  );
}
