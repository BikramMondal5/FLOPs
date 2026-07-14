"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { CategoryBreakdownItem } from "@/features/analytics/dto/dashboard.dto";

const PIE_COLORS = [
  "#D46A96", // Primary Accent Pink
  "#E88AB3",
  "#F4B3C2",
  "#B19FFB", // Purple accent
  "#DFC5D0",
  "#9EABB3",
  "#F6B7CF",
  "#C084FC",
  "#818CF8",
];

interface BreakdownChartProps {
  categories: CategoryBreakdownItem[];
  totalExpenses: number;
}

export default function BreakdownChart({ categories, totalExpenses }: BreakdownChartProps) {
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

  // Fallback if empty data is provided
  const chartData = categories.length > 0 
    ? categories.slice(0, 6).map((c, idx) => ({
        name: c.category,
        value: c.spent,
        percentage: c.percentage,
        color: PIE_COLORS[idx % PIE_COLORS.length],
      }))
    : [{ name: "No expenses", value: 1, percentage: 100, color: "#9EABB3" }];

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
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={78}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
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
            <span className="text-[10px] uppercase font-bold text-[#6B7280]">Total Spent</span>
            <span className="text-lg font-extrabold text-[#18181B] mt-0.5">₹{totalExpenses.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 w-full">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-zinc-700">{item.name}</span>
                {categories.length > 0 && (
                  <span className="text-zinc-400 font-normal">({item.percentage.toFixed(1)}%)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
