"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Trophy } from "lucide-react";

interface Milestone {
  id: string;
  text: string;
  completed: boolean;
  type: "achievement" | "pending";
}

export default function Milestones() {
  const milestones: Milestone[] = [
    { id: "m1", text: "First ₹25,000 Saved", completed: true, type: "achievement" },
    { id: "m2", text: "50% Completed (MacBook Goal)", completed: true, type: "achievement" },
    { id: "m3", text: "Monthly Savings Target Increased by 15%", completed: true, type: "achievement" },
    { id: "m4", text: "75% Target threshold completion check", completed: false, type: "pending" },
    { id: "m5", text: "100% Target final milestone release", completed: false, type: "pending" },
  ];

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] relative overflow-hidden h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-5 shrink-0">
        <div>
          <h3 className="text-base font-semibold text-[#18181B] m-0">Milestones Timeline</h3>
          <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Goal achievements roadmap status</p>
        </div>
        <Trophy className="w-4.5 h-4.5 text-[#D46A96]" />
      </div>

      <div className="flex-grow flex flex-col gap-3 pr-1">
        {milestones.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className={`p-3 border rounded-[20px] flex gap-3 items-center ${
              item.completed
                ? "bg-emerald-50/50 text-emerald-600 border-emerald-100"
                : "bg-zinc-50 border-zinc-100 text-zinc-500"
            }`}
          >
            {item.completed ? (
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
            ) : (
              <Circle className="w-4.5 h-4.5 text-zinc-300 shrink-0" />
            )}
            <span className="text-[12.5px] font-semibold leading-normal">{item.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
