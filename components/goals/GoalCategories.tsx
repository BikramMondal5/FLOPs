"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Category {
  name: string;
  icon: string;
  count: number;
  color: string;
}

export default function GoalCategories() {
  const categories: Category[] = [
    { name: "Travel Plan", icon: "✈️", count: 2, color: "#FFF4F8" },
    { name: "Education Plan", icon: "🎓", count: 1, color: "#F9DCE7" },
    { name: "Electronics Set", icon: "💻", count: 1, color: "#FFF4F8" },
    { name: "Vehicle Fund", icon: "🚗", count: 1, color: "#F9DCE7" },
    { name: "Investments Goal", icon: "📈", count: 2, color: "#FFF4F8" },
    { name: "Emergency Fund", icon: "🛡️", count: 1, color: "#F9DCE7" },
  ];

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] relative overflow-hidden h-full flex flex-col justify-between">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Goal Categories</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Target categorization filters</p>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {categories.map((c, idx) => (
          <motion.div
            key={c.name}
            whileHover={{ y: -3, scale: 1.01 }}
            className="p-3 bg-zinc-50/50 border border-[#F6B7CF]/8 rounded-[20px] flex items-center gap-3 hover:border-[#F6B7CF]/20 transition-all duration-300 cursor-pointer"
          >
            <div
              className="w-[34px] h-[34px] rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ backgroundColor: c.color }}
            >
              {c.icon}
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-[#18181B] m-0 leading-tight">{c.name}</h4>
              <span className="text-[9.5px] text-[#6B7280] mt-0.5 block leading-none">{c.count} targets active</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
