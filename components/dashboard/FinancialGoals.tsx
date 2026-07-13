"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  date: string;
}

export default function FinancialGoals() {
  const goals: Goal[] = [
    {
      id: "g1",
      name: "Emergency Fund",
      current: 75000,
      target: 100000,
      date: "Dec 2026",
    },
    {
      id: "g2",
      name: "Vacation Trip",
      current: 45000,
      target: 80000,
      date: "Oct 2026",
    },
    {
      id: "g3",
      name: "New MacBook Pro",
      current: 120000,
      target: 150000,
      date: "Sep 2026",
    },
    {
      id: "g4",
      name: "Crypto Allocation",
      current: 18000,
      target: 30000,
      date: "Jan 2027",
    },
  ];

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden h-auto">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-semibold text-[#18181B]">Financial Goals</h3>
          <Sparkles className="w-4.5 h-4.5 text-[#D46A96]" />
        </div>

        <div className="flex flex-col gap-5">
          {goals.map((g, idx) => {
            const percentage = Math.min((g.current / g.target) * 100, 100);
            const remaining = g.target - g.current;
            return (
              <div key={g.id} className="flex flex-col gap-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[13px] font-semibold text-[#18181B]">{g.name}</span>
                  <span className="text-[11px] text-[#6B7280]">Target: {g.date}</span>
                </div>

                {/* Progress bar container */}
                <div className="w-full h-2 bg-[#FFF4F8] rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: idx * 0.15, ease: "easeOut" }}
                    className="h-full bg-[#D46A96] rounded-full shadow-[0_0_8px_rgba(246,183,207,0.5)]"
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] font-medium text-[#6B7280]">
                  <span>₹{g.current.toLocaleString()} saved ({Math.round(percentage)}%)</span>
                  <span>₹{remaining.toLocaleString()} left</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
