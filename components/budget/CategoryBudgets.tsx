"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  budget: number;
  spent: number;
  remaining: number;
}

interface CategoryBudgetsProps {
  categories: BudgetCategory[];
  onEditBudget: (cat: BudgetCategory) => void;
  onViewTransactions: (catName: string) => void;
}

export default function CategoryBudgets({
  categories,
  onEditBudget,
  onViewTransactions,
}: CategoryBudgetsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {categories.map((cat, idx) => {
        const percent = Math.round((cat.spent / cat.budget) * 100) || 0;
        
        // Status Badge Logic
        let status: "Healthy" | "Near Limit" | "Exceeded" = "Healthy";
        let statusStyle = "bg-emerald-50 text-emerald-600 border-emerald-100";
        let progressColor = "bg-[#D46A96]";
        
        if (percent > 100) {
          status = "Exceeded";
          statusStyle = "bg-rose-50 text-rose-600 border-rose-100";
          progressColor = "bg-rose-500";
        } else if (percent >= 85) {
          status = "Near Limit";
          statusStyle = "bg-amber-50 text-amber-600 border-amber-100";
          progressColor = "bg-amber-500";
        }

        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.06 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between overflow-hidden group hover:border-[#F6B7CF]/30 transition-all duration-300 min-h-[200px]"
          >
            {/* Card Body */}
            <div className="p-5 flex flex-col gap-4 flex-grow">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-[36px] h-[36px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-lg border border-[#F6B7CF]/20 shrink-0">
                    {cat.icon}
                  </div>
                  <h4 className="text-[13.5px] font-semibold text-[#18181B] m-0 leading-normal">{cat.name}</h4>
                </div>

                {/* Status Badges */}
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusStyle}`}>
                  {status}
                </span>
              </div>

              {/* Progress Slider */}
              <div className="mt-1">
                <div className="w-full bg-[#FFF4F8] h-2 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${progressColor} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percent, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10.5px] text-[#6B7280] mt-1.5 font-medium leading-none">
                  <span>{percent}% spent</span>
                  <span>Goal: ₹{cat.budget.toLocaleString()}</span>
                </div>
              </div>

              {/* Balances details */}
              <div className="grid grid-cols-2 gap-2 border-t border-[#F6B7CF]/8 pt-3 mt-1 text-[11px] leading-none">
                <div>
                  <span className="text-zinc-400">Spent</span>
                  <div className="font-bold text-[#18181B] mt-1">₹{cat.spent.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400">Remaining</span>
                  <div className={`font-bold mt-1 ${cat.remaining < 0 ? "text-rose-600" : "text-[#18181B]"}`}>
                    {cat.remaining < 0 ? "-" : ""}₹{Math.abs(cat.remaining).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="px-5 py-3.5 bg-[#FCFCFD] border-t border-[#F6B7CF]/10 flex gap-2 justify-between shrink-0">
              <button
                onClick={() => onEditBudget(cat)}
                className="text-[10px] font-bold py-1.5 px-3 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full transition-all duration-300 cursor-pointer"
              >
                Edit Budget
              </button>
              <button
                onClick={() => onViewTransactions(cat.name)}
                className="text-[10px] font-bold py-1.5 px-3 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full transition-all duration-300 cursor-pointer"
              >
                View Logs
              </button>
            </div>

          </motion.div>
        );
      })}
    </div>
  );
}
