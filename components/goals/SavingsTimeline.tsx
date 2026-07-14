"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const timelineData = {
  "6 Months": [
    { name: "Feb", Contribution: 8000, Accumulated: 420000 },
    { name: "Mar", Contribution: 11000, Accumulated: 431000 },
    { name: "Apr", Contribution: 12000, Accumulated: 443000 },
    { name: "May", Contribution: 14000, Accumulated: 457000 },
    { name: "Jun", Contribution: 11000, Accumulated: 468000 },
    { name: "Jul", Contribution: 14500, Accumulated: 482500 },
  ],
  "1 Year": [
    { name: "Aug 25", Contribution: 6000, Accumulated: 380000 },
    { name: "Oct 25", Contribution: 9000, Accumulated: 395000 },
    { name: "Dec 25", Contribution: 15000, Accumulated: 410000 },
    { name: "Feb 26", Contribution: 8000, Accumulated: 420000 },
    { name: "Apr 26", Contribution: 12000, Accumulated: 443000 },
    { name: "Jun 26", Contribution: 11000, Accumulated: 468000 },
    { name: "Jul 26", Contribution: 14500, Accumulated: 482500 },
  ],
  "All Time": [
    { name: "2024", Contribution: 68000, Accumulated: 250000 },
    { name: "2025", Contribution: 120000, Accumulated: 370000 },
    { name: "2026", Contribution: 112500, Accumulated: 482500 },
  ],
};

export default function SavingsTimeline() {
  const [filter, setFilter] = useState<"6 Months" | "1 Year" | "All Time">("6 Months");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[360px] relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h3 className="text-base font-semibold text-[#18181B] m-0">Savings Timeline</h3>
          <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Accumulated growth vs monthly additions</p>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 bg-[#FFF4F8] p-1 rounded-full border border-[#F6B7CF]/10">
          {(["6 Months", "1 Year", "All Time"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                filter === type
                  ? "bg-[#D46A96] text-white shadow-sm"
                  : "text-[#6B7280] hover:text-[#18181B]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-full flex-grow">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData[filter]} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="accumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D46A96" stopOpacity="0.25"/>
                  <stop offset="95%" stopColor="#D46A96" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DFC5D0" stopOpacity="0.08"/>
                  <stop offset="95%" stopColor="#DFC5D0" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} dy={8} />
              <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} dx={-5} tickFormatter={(val) => `₹${val}`} />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "16px", border: "1px solid rgba(246,183,207,0.2)" }} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              <Area type="monotone" dataKey="Accumulated" stroke="#D46A96" strokeWidth={2} fillOpacity={1} fill="url(#accumGrad)" />
              <Area type="monotone" dataKey="Contribution" stroke="#DFC5D0" strokeWidth={1.5} fillOpacity={1} fill="url(#contribGrad)" strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">Loading growth visualizer...</div>
        )}
      </div>

    </div>
  );
}
