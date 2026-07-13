"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Bills", value: 12000, color: "#D46A96" },
  { name: "Food", value: 8400, color: "#E88AB3" },
  { name: "Shopping", value: 6200, color: "#F4B3C2" },
  { name: "Travel", value: 3500, color: "#B19FFB" },
  { name: "Entertainment", value: 2900, color: "#DFC5D0" },
  { name: "Healthcare", value: 1800, color: "#9EABB3" },
];

export default function BreakdownChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[280px] bg-zinc-50 rounded-2xl flex items-center justify-center">
        <span className="text-sm text-zinc-400">Loading analysis data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden h-auto">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Expense Breakdown</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Percentage categorical share</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Doughnut Chart */}
        <div className="w-[180px] h-[180px] relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={78}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.96)",
                  border: "1px solid rgba(246, 183, 207, 0.2)",
                  borderRadius: "16px",
                  fontSize: "12px",
                  color: "#18181B",
                }}
                formatter={(value: any) => [`₹${value.toLocaleString()}`, "Share"]}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text inside Doughnut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase font-bold text-[#6B7280]">Total</span>
            <span className="text-lg font-extrabold text-[#18181B] mt-0.5">₹34,800</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 w-full">
          {data.map((item) => (
            <div key={item.name} className="flex items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-zinc-700">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
