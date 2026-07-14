"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, CheckCircle, HelpCircle, ShieldAlert, LineChart as RechartIcon } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useState, useEffect } from "react";

const weekSpending = [
  { name: "W1", Expense: 28000 },
  { name: "W2", Expense: 34000 },
  { name: "W3", Expense: 26000 },
  { name: "W4", Expense: 22000 },
];

const savingsForecast = [
  { name: "Aug", Forecast: 15000 },
  { name: "Sep", Forecast: 18500 },
  { name: "Oct", Forecast: 22000 },
  { name: "Nov", Forecast: 25000 },
  { name: "Dec", Forecast: 29000 },
  { name: "Jan", Forecast: 35000 },
];

export default function AICardsList() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const explainables = [
    {
      recommendation: "Reduce dining expenses by ₹2,000.",
      why: "You spent 34% more than your monthly dining average over the last four weeks.",
      confidence: 94,
      evidence: "Last 30 days",
      transactions: 82,
    },
    {
      recommendation: "Increase emergency savings by ₹5,000.",
      why: "Current emergency fund target is delayed by 18 days based on actual spending rates.",
      confidence: 88,
      evidence: "Timeline sweep",
      transactions: 42,
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Today's Insight */}
      <div className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:border-[#F6B7CF]/30 transition-colors relative overflow-hidden">
        <div className="absolute top-[-30px] right-[-30px] w-24 h-24 rounded-full bg-[#F6B7CF]/10 blur-xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#D46A96] animate-[pulse_2s_infinite]" />
          <span className="text-[11px] font-bold text-[#D46A96] uppercase tracking-wider">Today's Insight</span>
        </div>
        <p className="text-[12.5px] text-zinc-700 leading-relaxed m-0 font-semibold">
          Dining expenses dropped by 18% this week. Great job! Redirect those savings toward your Emergency Fund.
        </p>
      </div>

      {/* Financial Health Score Circle Ring */}
      <div className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex items-center justify-between gap-4">
        <div>
          <h4 className="text-[12.5px] font-bold text-zinc-400 uppercase tracking-wider m-0">Financial Health</h4>
          <p className="text-[11.5px] text-[#6B7280] m-0 mt-1 max-w-[150px] leading-relaxed">
            Excellent standing. Your budget sweeps are optimized.
          </p>
        </div>
        <div className="relative w-[80px] h-[80px] flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="36" fill="transparent" stroke="#FFF4F8" strokeWidth="7" />
            <circle cx="50" cy="50" r="36" fill="transparent" stroke="#D46A96" strokeWidth="7" strokeDasharray={226} strokeDashoffset={226 - (92 / 100) * 226} strokeLinecap="round" />
          </svg>
          <span className="absolute text-sm font-extrabold text-[#18181B]">92%</span>
        </div>
      </div>

      {/* Recharts Week Spending Pattern */}
      <div className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] h-[200px] flex flex-col justify-between">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Spending Pattern</span>
        <div className="w-full h-[120px] mt-2">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekSpending} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D46A96" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#D46A96" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#6B7280" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: "10px" }} />
                <Area type="monotone" dataKey="Expense" stroke="#D46A96" strokeWidth={1.5} fillOpacity={1} fill="url(#scoreAreaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xs text-zinc-400 text-center">Loading patterns...</div>
          )}
        </div>
      </div>

      {/* Explainable AI Cards */}
      <div className="flex flex-col gap-3">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">Explainable AI Recommendations</span>
        <div className="flex flex-col gap-3">
          {explainables.map((el, idx) => (
            <div
              key={idx}
              className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col gap-3"
            >
              <div>
                <span className="text-[10px] font-bold text-[#D46A96] uppercase tracking-wide">Recommendation</span>
                <h5 className="text-[13px] font-semibold text-[#18181B] m-0 mt-1 leading-snug">{el.recommendation}</h5>
              </div>
              <div className="bg-[#FFF4F8]/50 border border-[#F6B7CF]/10 rounded-2xl p-3 text-[11.5px] leading-relaxed">
                <span className="text-zinc-400 block text-[9px] uppercase font-bold tracking-wider mb-1">Why?</span>
                <span className="text-zinc-700 font-semibold">{el.why}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-zinc-400 border-t border-zinc-50 pt-2.5 mt-0.5">
                <span>Confidence: <span className="font-bold text-[#D46A96]">{el.confidence}%</span></span>
                <span>Evidence: <span className="font-semibold text-zinc-600">{el.evidence} ({el.transactions} txs)</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next 6-Month Savings Forecast LineChart */}
      <div className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] h-[200px] flex flex-col justify-between">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Savings Forecast (Next 6 Mo)</span>
        <div className="w-full h-[120px] mt-2">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsForecast} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#6B7280" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: "10px" }} />
                <Line type="monotone" dataKey="Forecast" stroke="#D46A96" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xs text-zinc-400 text-center">Loading forecast...</div>
          )}
        </div>
      </div>

    </div>
  );
}
