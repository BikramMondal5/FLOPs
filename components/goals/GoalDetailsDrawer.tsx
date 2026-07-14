"use client";

import { motion } from "framer-motion";
import { X, Plus, Trash2, Edit2, Landmark, Calendar, Target, ShieldCheck, AreaChart as ChartIcon } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

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

interface GoalDetailsDrawerProps {
  goal: Goal;
  onClose: () => void;
  onDelete: (id: string) => void;
  onAddMoney: (id: string, amt: number) => void;
}

const mockChartData = [
  { name: "Feb", Savings: 12000 },
  { name: "Mar", Savings: 24000 },
  { name: "Apr", Savings: 35000 },
  { name: "May", Savings: 48000 },
  { name: "Jun", Savings: 59000 },
  { name: "Jul", Savings: 72000 },
];

const mockContributions = [
  { desc: "Added to Savings", date: "Today", amount: 5000, bank: "ICICI Savings" },
  { desc: "System Auto-Sweep", date: "Yesterday", amount: 1500, bank: "Auto-Pay" },
  { desc: "Added to Savings", date: "Jul 10, 2026", amount: 8000, bank: "Axis Bank" },
];

export default function GoalDetailsDrawer({
  goal,
  onClose,
  onDelete,
  onAddMoney,
}: GoalDetailsDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const percent = Math.round((goal.saved / goal.target) * 100) || 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[100]" onClick={onClose} />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-[#FCFCFD] border-l border-[#F6B7CF]/20 shadow-2xl z-[101] flex flex-col justify-between"
      >
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-[#F6B7CF]/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-[#F6B7CF]/10 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-xl border shrink-0"
              style={{ backgroundColor: goal.bgColor, borderColor: goal.borderColor }}
            >
              {goal.icon}
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#18181B] m-0">{goal.name}</h3>
              <span className="text-[10px] text-zinc-400">{goal.category} • Target {goal.targetDate}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#F6B7CF]/15 flex items-center justify-center text-zinc-500 hover:text-[#18181B] shadow-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 flex-grow z-10">
          {/* Progress Circular Display */}
          <div className="p-6 bg-white border border-[#F6B7CF]/10 rounded-[24px] shadow-sm text-center">
            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Goal Savings Progress</span>
            <div className="text-3xl font-extrabold mt-2 text-emerald-600">
              ₹{goal.saved.toLocaleString()} <span className="text-sm font-medium text-zinc-400">of ₹{goal.target.toLocaleString()}</span>
            </div>
            
            {/* Horizontal progress bar */}
            <div className="w-full bg-[#FFF4F8] h-3 rounded-full overflow-hidden mt-4">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: goal.color }}
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <div className="flex justify-between items-center text-[10.5px] text-[#6B7280] mt-2 font-medium">
              <span>{percent}% saved</span>
              <span>₹{goal.remaining.toLocaleString()} left</span>
            </div>
          </div>

          {/* Contribution Chart Recharts */}
          <div className="p-4 bg-white border border-[#F6B7CF]/10 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
            <h4 className="text-xs font-semibold text-[#18181B] uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <ChartIcon className="w-4 h-4 text-[#D46A96]" />
              <span>Contribution Timeline</span>
            </h4>
            <div className="w-full h-[120px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGoalDraw" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={goal.color} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={goal.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "12px", border: "1px solid rgba(246,183,207,0.2)" }} />
                    <Area type="monotone" dataKey="Savings" stroke={goal.color} strokeWidth={2} fillOpacity={1} fill="url(#colorGoalDraw)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">Loading flow logs...</div>
              )}
            </div>
          </div>

          {/* Details list */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-[#18181B] uppercase tracking-wide px-1">Parameters</h4>
            <div className="flex flex-col gap-3 bg-white border border-[#F6B7CF]/10 rounded-[24px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B7280] flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Target Date</span>
                </span>
                <span className="font-semibold text-zinc-700">{goal.targetDate}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B7280] flex items-center gap-2">
                  <Target className="w-3.5 h-3.5" />
                  <span>Target Status</span>
                </span>
                <span className="font-semibold text-zinc-700">{goal.status}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B7280] flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Security Sweep</span>
                  <span className="font-bold text-emerald-600 ml-1">Active</span>
                </span>
              </div>
            </div>
          </div>

          {/* Recent Contributions log */}
          <div>
            <h4 className="text-xs font-semibold text-[#18181B] uppercase tracking-wide mb-3">Recent Contributions</h4>
            <div className="flex flex-col gap-2.5">
              {mockContributions.map((tx, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-white border border-[#F6B7CF]/8 rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                  <div>
                    <div className="text-[12.5px] font-semibold text-[#18181B]">{tx.desc}</div>
                    <span className="text-[10px] text-[#6B7280]">{tx.date} • {tx.bank}</span>
                  </div>
                  <span className="text-[12.5px] font-bold text-emerald-600">
                    +₹{tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-[#F6B7CF]/10 bg-white z-10 flex gap-2 shrink-0">
          <button
            onClick={() => onAddMoney(goal.id, 5000)}
            className="flex-grow text-xs font-semibold py-3 px-4 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Money</span>
          </button>
          <button className="text-xs font-semibold p-3 bg-zinc-50 border border-[#F6B7CF]/20 text-[#18181B] hover:bg-zinc-100 rounded-full flex items-center justify-center transition-colors cursor-pointer">
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="text-xs font-semibold p-3 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </motion.div>
    </>
  );
}
