"use client";

import { motion } from "framer-motion";
import { PlusCircle, Eye, Settings } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  category: string;
  icon: string;
  target: number;
  saved: number;
  remaining: number;
  targetDate: string;
  status: "On Track" | "Ahead" | "Delayed" | "Completed";
  color: string;
  bgColor: string;
  borderColor: string;
}

interface GoalsGridProps {
  goals: Goal[];
  onSelectGoal: (goal: Goal) => void;
  onAddMoney: (id: string) => void;
}

export default function GoalsGrid({ goals, onSelectGoal, onAddMoney }: GoalsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {goals.map((goal, idx) => {
        const percent = Math.round((goal.saved / goal.target) * 100) || 0;
        
        let statusStyle = "bg-emerald-50 text-emerald-600 border-emerald-100";
        if (goal.status === "Delayed") {
          statusStyle = "bg-rose-50 text-rose-600 border-rose-100";
        } else if (goal.status === "Ahead") {
          statusStyle = "bg-sky-50 text-sky-600 border-sky-100";
        }

        return (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.06 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between overflow-hidden group hover:border-[#F6B7CF]/30 transition-all duration-300 min-h-[220px]"
          >
            {/* Card Body */}
            <div className="p-5 flex flex-col gap-4 flex-grow">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-[36px] h-[36px] rounded-xl flex items-center justify-center text-lg border shrink-0`}
                    style={{ backgroundColor: goal.bgColor, borderColor: goal.borderColor }}
                  >
                    {goal.icon}
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-semibold text-[#18181B] m-0 leading-normal">{goal.name}</h4>
                    <span className="text-[10px] text-[#6B7280] leading-none mt-0.5 block">{goal.category} • Target {goal.targetDate}</span>
                  </div>
                </div>

                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusStyle}`}>
                  {goal.status}
                </span>
              </div>

              {/* Progress Slider */}
              <div className="mt-1">
                <div className="w-full bg-[#FFF4F8] h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: goal.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percent, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10.5px] text-[#6B7280] mt-1.5 font-medium leading-none">
                  <span>{percent}% saved</span>
                  <span>Goal: ₹{goal.target.toLocaleString()}</span>
                </div>
              </div>

              {/* Saved vs remaining */}
              <div className="grid grid-cols-2 gap-2 border-t border-[#F6B7CF]/8 pt-3 mt-1 text-[11px] leading-none">
                <div>
                  <span className="text-zinc-400">Saved So Far</span>
                  <div className="font-bold text-emerald-600 mt-1">₹{goal.saved.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400">Remaining</span>
                  <div className="font-bold text-[#18181B] mt-1">₹{goal.remaining.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="px-5 py-3.5 bg-[#FCFCFD] border-t border-[#F6B7CF]/10 flex gap-2 justify-between shrink-0">
              <button
                onClick={() => onSelectGoal(goal)}
                className="text-[10px] font-bold py-1.5 px-3 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full flex items-center gap-1 transition-all cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                <span>View Details</span>
              </button>
              
              <button
                onClick={() => onAddMoney(goal.id)}
                className="text-[10px] font-bold py-1.5 px-3 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full flex items-center gap-1 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Add Money</span>
              </button>
            </div>

          </motion.div>
        );
      })}
    </div>
  );
}
