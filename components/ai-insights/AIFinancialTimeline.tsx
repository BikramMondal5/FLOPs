"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";

interface TimelineItem {
  period: string;
  income: number;
  expenses: number;
  savings: number;
  forecast?: boolean;
}

export default function AIFinancialTimeline() {
  const timeline: TimelineItem[] = [
    { period: "Last Week", income: 14500, expenses: 11200, savings: 3300 },
    { period: "This Week (Actual)", income: 75000, expenses: 24200, savings: 50800 },
    { period: "Next Week (Forecast)", income: 0, expenses: 8400, savings: -8400, forecast: true },
    { period: "End of Month (Predicted)", income: 95000, expenses: 54600, savings: 40400, forecast: true },
  ];

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] h-full relative overflow-hidden flex flex-col justify-between">
      <div className="mb-5 shrink-0">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Weekly Financial Timeline</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Actual deposits vs AI expenditure forecasts</p>
      </div>

      <div className="flex-grow flex flex-col gap-3 pr-1">
        {timeline.map((item, idx) => (
          <motion.div
            key={item.period}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className={`p-3.5 border rounded-[20px] flex flex-col gap-2 ${
              item.forecast
                ? "bg-[#FFF4F8]/40 border-dashed border-[#F6B7CF]/30 text-zinc-600"
                : "bg-zinc-50 border-zinc-100 text-zinc-700"
            }`}
          >
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                {item.forecast && <Sparkles className="w-3.5 h-3.5 text-[#D46A96] animate-pulse" />}
                <span>{item.period}</span>
              </span>
              <span className={item.savings < 0 ? "text-[#D46A96]" : "text-emerald-600"}>
                Net: {item.savings < 0 ? "-" : "+"}₹{Math.abs(item.savings).toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[11px] border-t border-zinc-100 pt-2 mt-1">
              <div className="flex items-center gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Inflows: <span className="font-bold text-zinc-800">₹{item.income.toLocaleString()}</span></span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Outflows: <span className="font-bold text-zinc-800">₹{item.expenses.toLocaleString()}</span></span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
