"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { MonthlyTrendItem } from "@/features/analytics/dto/dashboard.dto";

interface SpendingChartProps {
  monthlyTrends: MonthlyTrendItem[];
  weeklyMock?: { name: string; Spending: number }[];
  yearlyMock?: { name: string; Spending: number }[];
}

const defaultWeekly = [
  { name: "Mon", Spending: 1200 },
  { name: "Tue", Spending: 2800 },
  { name: "Wed", Spending: 1500 },
  { name: "Thu", Spending: 4200 },
  { name: "Fri", Spending: 3800 },
  { name: "Sat", Spending: 6000 },
  { name: "Sun", Spending: 2200 },
];

const defaultYearly = [
  { name: "Jan", Spending: 45000 },
  { name: "Feb", Spending: 38000 },
  { name: "Mar", Spending: 52000 },
  { name: "Apr", Spending: 48000 },
  { name: "May", Spending: 61000 },
  { name: "Jun", Spending: 55000 },
];

export default function SpendingChart({
  monthlyTrends,
  weeklyMock = defaultWeekly,
  yearlyMock = defaultYearly,
}: SpendingChartProps) {
  const [filter, setFilter] = useState<"Weekly" | "Monthly" | "Yearly">("Monthly");
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

  // Map monthly data formatted for Recharts consumption
  const parsedMonthly = monthlyTrends.map((t) => ({
    name: t.month.split(" ")[0], // Display short month name, e.g. "Jan"
    Spending: t.expense,
  }));

  const chartData = filter === "Monthly"
    ? parsedMonthly
    : filter === "Weekly"
    ? weeklyMock
    : yearlyMock;

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-base font-semibold text-[#18181B] m-0">Interactive Spending</h3>
          <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Detailed historical review</p>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex gap-1.5 bg-[#FFF4F8] p-1 rounded-full border border-[#F6B7CF]/10">
          {(["Weekly", "Monthly", "Yearly"] as const).map((type) => (
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

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(246,183,207,0.08)" />
            <XAxis
              dataKey="name"
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-5}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              cursor={{ fill: "rgba(246,183,207,0.03)" }}
              contentStyle={{
                background: "rgba(255, 255, 255, 0.96)",
                border: "1px solid rgba(246, 183, 207, 0.2)",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                fontSize: "12px",
                color: "#18181B",
              }}
              formatter={(value: any) => [`₹${value.toLocaleString()}`, "Spending"]}
            />
            {/* Custom rounded bar */}
            <Bar
              dataKey="Spending"
              fill="#D46A96"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
