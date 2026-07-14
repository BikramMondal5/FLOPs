"use client";

import { motion } from "framer-motion";
import { Sparkles, Calendar, PlusCircle, Landmark } from "lucide-react";

interface HeroGoalProps {
  onAddMoney: () => void;
  onViewDetails: () => void;
}

export default function HeroGoal({ onAddMoney, onViewDetails }: HeroGoalProps) {
  const goal = {
    name: "New MacBook Pro",
    icon: "💻",
    target: 250000,
    saved: 182000,
    remaining: 68000,
    percent: 72,
    eta: "December 2026",
    color: "#D46A96",
  };

  // SVG Progress Ring metrics
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (goal.percent / 100) * circumference;

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden w-full min-h-[220px]">
      {/* Glow */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-[#F6B7CF]/5 blur-2xl pointer-events-none" />

      {/* Main Left Details */}
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex items-center gap-2.5">
          <div className="w-[42px] h-[42px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-2xl border border-[#F6B7CF]/20 shrink-0">
            {goal.icon}
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D46A96] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>Primary Financial Goal</span>
            </span>
            <h3 className="text-lg font-semibold text-[#18181B] m-0 mt-0.5 leading-tight">{goal.name}</h3>
          </div>
        </div>

        {/* Goals parameters */}
        <div className="grid grid-cols-3 gap-4 border-t border-[#F6B7CF]/8 pt-4">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Target</span>
            <div className="text-base font-bold text-[#18181B] mt-1">₹{goal.target.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Saved So Far</span>
            <div className="text-base font-bold text-emerald-600 mt-1">₹{goal.saved.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Remaining</span>
            <div className="text-base font-bold text-[#D46A96] mt-1">₹{goal.remaining.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-[#6B7280] font-medium mt-1">
          <Calendar className="w-4 h-4 text-zinc-400" />
          <span>Expected Completion: <span className="font-semibold text-zinc-700">{goal.eta}</span></span>
        </div>
      </div>

      {/* Right Circular Gauge & Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-[#F6B7CF]/8 pt-5 md:pt-0 md:pl-6">
        
        {/* Radial ring */}
        <div className="relative w-[130px] h-[130px] flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#FFF4F8"
              strokeWidth={strokeWidth}
            />
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={goal.color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-[9px] uppercase font-bold text-zinc-400">Progress</span>
            <span className="text-lg font-extrabold text-[#18181B] mt-0.5">{goal.percent}%</span>
          </div>
        </div>

        {/* Buttons layout */}
        <div className="flex flex-row sm:flex-col gap-2.5 w-full sm:w-[130px]">
          <button
            onClick={onAddMoney}
            className="flex-1 text-[11px] font-bold py-2.5 px-3 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Funds</span>
          </button>
          <button
            onClick={onViewDetails}
            className="flex-1 text-[11px] font-bold py-2.5 px-3 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full transition-colors cursor-pointer text-center"
          >
            View Details
          </button>
        </div>

      </div>

    </div>
  );
}
