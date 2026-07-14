"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const timelineData = {
  Monthly: [
    { name: "Jan", Budget: 75000, Spend: 62000, Savings: 13000 },
    { name: "Feb", Budget: 75000, Spend: 68000, Savings: 7000 },
    { name: "Mar", Budget: 75000, Spend: 71000, Savings: 4000 },
    { name: "Apr", Budget: 75000, Spend: 58000, Savings: 17000 },
    { name: "May", Budget: 75000, Spend: 63000, Savings: 12000 },
    { name: "Jun", Budget: 75000, Spend: 65000, Savings: 10000 },
    { name: "Jul", Budget: 75000, Spend: 42650, Savings: 20000 },
  ],
  Quarterly: [
    { name: "Q1", Budget: 225000, Spend: 201000, Savings: 24000 },
    { name: "Q2", Budget: 225000, Spend: 186000, Savings: 39000 },
    { name: "Q3", Budget: 225000, Spend: 198000, Savings: 27000 },
  ],
  Yearly: [
    { name: "2024", Budget: 850000, Spend: 780000, Savings: 70000 },
    { name: "2025", Budget: 900000, Spend: 840000, Savings: 60000 },
    { name: "2026", Budget: 900000, Spend: 450000, Savings: 120000 },
  ],
};

export default function BudgetTimelineChart() {
  const [filter, setFilter] = useState<"Monthly" | "Quarterly" | "Yearly">("Monthly");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[360px] relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h3 className="text-base font-semibold text-[#18181B] m-0">Monthly Budget Timeline</h3>
          <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Historical spending vs budget ceilings</p>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 bg-[#FFF4F8] p-1 rounded-full border border-[#F6B7CF]/10">
          {(["Monthly", "Quarterly", "Yearly"] as const).map((type) => (
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
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D46A96" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#D46A96" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DFC5D0" stopOpacity={0.08}/>
                  <stop offset="95%" stopColor="#DFC5D0" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} dy={8} />
              <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} dx={-5} tickFormatter={(val) => `₹${val}`} />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "16px", border: "1px solid rgba(246,183,207,0.2)" }} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              <Area type="monotone" dataKey="Budget" stroke="#DFC5D0" strokeWidth={1.5} fillOpacity={1} fill="url(#budgetGrad)" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="Spend" stroke="#D46A96" strokeWidth={2} fillOpacity={1} fill="url(#spendGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">Loading timeline visualizer...</div>
        )}
      </div>

    </div>
  );
}
