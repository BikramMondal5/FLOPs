"use client";

import { motion } from "framer-motion";
import { Sparkles, Calendar, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useState } from "react";

interface Recurring {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  frequency: string;
  status: "Active" | "Paused";
  icon: string;
}

export default function RecurringExpenses() {
  const [expenses, setExpenses] = useState<Recurring[]>([
    {
      id: "rec1",
      name: "Netflix Premium",
      amount: 649,
      nextPayment: "Jul 18, 2026",
      frequency: "Monthly",
      status: "Active",
      icon: "🎬",
    },
    {
      id: "rec2",
      name: "Spotify Duo",
      amount: 149,
      nextPayment: "Jul 22, 2026",
      frequency: "Monthly",
      status: "Active",
      icon: "🎵",
    },
    {
      id: "rec3",
      name: "Electricity Bill",
      amount: 4200,
      nextPayment: "Aug 02, 2026",
      frequency: "Monthly",
      status: "Active",
      icon: "⚡",
    },
    {
      id: "rec4",
      name: "Internet Fiber",
      amount: 999,
      nextPayment: "Aug 05, 2026",
      frequency: "Monthly",
      status: "Active",
      icon: "🌐",
    },
    {
      id: "rec5",
      name: "Term Insurance",
      amount: 1500,
      nextPayment: "Aug 10, 2026",
      frequency: "Quarterly",
      status: "Paused",
      icon: "🛡️",
    },
  ]);

  const handleToggleStatus = (id: string) => {
    setExpenses((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Active" ? "Paused" : "Active" }
          : item
      )
    );
  };

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] h-[360px] relative overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-5 shrink-0">
        <div>
          <h3 className="text-base font-semibold text-[#18181B] m-0">Recurring Expenses</h3>
          <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Active bills & subscription tracking</p>
        </div>
        <Calendar className="w-4.5 h-4.5 text-[#D46A96]" />
      </div>

      <div className="flex-grow overflow-y-auto flex flex-col gap-2.5 pr-1">
        {expenses.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.06 }}
            className="p-3.5 bg-zinc-50/50 border border-[#F6B7CF]/8 rounded-[20px] flex items-center justify-between hover:border-[#F6B7CF]/20 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-[34px] h-[34px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-lg border border-[#F6B7CF]/20 shrink-0">
                {exp.icon}
              </div>
              <div>
                <h4 className="text-[12.5px] font-semibold text-[#18181B] m-0 leading-normal">{exp.name}</h4>
                <span className="text-[9.5px] text-[#6B7280] mt-0.5 block leading-none">
                  Next: {exp.nextPayment} • {exp.frequency}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-[#18181B]">₹{exp.amount.toLocaleString()}</span>
              
              <button
                onClick={() => handleToggleStatus(exp.id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                  exp.status === "Active" ? "text-emerald-500 hover:text-emerald-600" : "text-zinc-300 hover:text-zinc-400"
                }`}
              >
                {exp.status === "Active" ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
