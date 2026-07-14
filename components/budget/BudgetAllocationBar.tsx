"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

interface AllocationSegment {
  name: string;
  budget: number;
  spent: number;
  remaining: number;
  color: string;
  icon: string;
}

interface BudgetAllocationBarProps {
  segments: AllocationSegment[];
}

export default function BudgetAllocationBar({ segments }: BudgetAllocationBarProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  
  // Calculate total budget to scale ratios
  const totalBudget = segments.reduce((sum, item) => sum + item.budget, 0) || 1;

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] relative overflow-hidden w-full flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-[#18181B] m-0">Budget Allocation</h3>
          <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Segmented category allocation share</p>
        </div>
        <Info className="w-4.5 h-4.5 text-[#D46A96]" />
      </div>

      {/* Segmented Horizontal Bar container */}
      <div className="relative">
        <div className="w-full h-8 bg-zinc-50 border border-[#F6B7CF]/10 rounded-full flex overflow-hidden">
          {segments.map((item, idx) => {
            const widthPct = (item.budget / totalBudget) * 100;
            return (
              <div
                key={item.name}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                className="h-full transition-all duration-300 relative cursor-pointer border-r border-white last:border-none"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: item.color,
                }}
              />
            );
          })}
        </div>

        {/* Hover Tooltip Overlay Panel */}
        <div className="h-16 relative mt-4">
          <AnimatePresence>
            {activeIdx !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-[#FFF4F8]/80 backdrop-blur-sm border border-[#F6B7CF]/20 rounded-2xl p-3 flex justify-between items-center text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{segments[activeIdx].icon}</span>
                  <div>
                    <span className="font-bold text-[#18181B]">{segments[activeIdx].name}</span>
                    <span className="text-[10px] text-[#6B7280] ml-2">
                      ({Math.round((segments[activeIdx].budget / totalBudget) * 100)}% share)
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 font-semibold">
                  <div>
                    <span className="text-zinc-400 block text-[9px] uppercase tracking-wide">Budget</span>
                    <span className="text-[#18181B]">₹{segments[activeIdx].budget.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[9px] uppercase tracking-wide">Spent</span>
                    <span className="text-zinc-700">₹{segments[activeIdx].spent.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[9px] uppercase tracking-wide">Remaining</span>
                    <span className={segments[activeIdx].remaining < 0 ? "text-rose-600" : "text-[#D46A96]"}>
                      ₹{segments[activeIdx].remaining.toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
