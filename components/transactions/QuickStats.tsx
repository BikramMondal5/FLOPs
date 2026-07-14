"use client";

import { motion } from "framer-motion";
import { Award, Sparkles, AlertCircle } from "lucide-react";

export default function QuickStats() {
  const stats = [
    {
      title: "Top Spending Category",
      value: "Food",
      detail: "₹18,200 spent",
      icon: "🍔",
      color: "#FFF4F8",
    },
    {
      title: "Highest Transaction",
      value: "MacBook Purchase",
      detail: "₹1,32,000 spent",
      icon: "💻",
      color: "#F9DCE7",
    },
    {
      title: "Most Frequent Merchant",
      value: "Amazon",
      detail: "42 Transactions",
      icon: "🛍️",
      color: "#FFF4F8",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {stats.map((st, idx) => (
        <motion.div
          key={st.title}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:border-[#F6B7CF]/30 transition-all duration-300 flex items-center gap-4 group"
        >
          <div
            className="w-[48px] h-[48px] rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform duration-300"
            style={{ backgroundColor: st.color }}
          >
            {st.icon}
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{st.title}</span>
            <h4 className="text-[15px] font-semibold text-[#18181B] m-0 mt-1 leading-tight">{st.value}</h4>
            <p className="text-[12px] font-medium text-[#D46A96] m-0 mt-0.5">{st.detail}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
