"use client";

import { motion } from "framer-motion";
import { Landmark, ArrowUpRight, CheckCircle } from "lucide-react";

interface Log {
  id: string;
  date: string;
  goal: string;
  amount: number;
  method: string;
  status: string;
}

export default function ContributionHistory() {
  const historyList: Log[] = [
    { id: "log1", date: "Today", goal: "New MacBook Pro", amount: 5000, method: "ICICI Savings", status: "Completed" },
    { id: "log2", date: "Yesterday", goal: "Dream Home", amount: 15000, method: "HDFC Salary", status: "Completed" },
    { id: "log3", date: "Jul 10, 2026", goal: "Europe Trip Plan", amount: 8000, method: "Axis Savings", status: "Completed" },
    { id: "log4", date: "Jul 05, 2026", goal: "Emergency Fund", amount: 3500, method: "ICICI Savings", status: "Completed" },
  ];

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] h-[360px] relative overflow-hidden flex flex-col justify-between">
      <div className="flex justify-between items-center mb-5 shrink-0">
        <div>
          <h3 className="text-base font-semibold text-[#18181B] m-0">Contribution History</h3>
          <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Recent savings deposits logs</p>
        </div>
        <ArrowUpRight className="w-4.5 h-4.5 text-[#D46A96]" />
      </div>

      <div className="flex-grow overflow-y-auto flex flex-col gap-2.5 pr-1">
        {historyList.map((log, idx) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.06 }}
            className="p-3.5 bg-zinc-50/50 border border-[#F6B7CF]/8 rounded-[20px] flex items-center justify-between hover:border-[#F6B7CF]/20 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-[34px] h-[34px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-lg border border-[#F6B7CF]/20 shrink-0 text-[#D46A96]">
                <Landmark className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-[12.5px] font-semibold text-[#18181B] m-0 leading-normal">{log.goal}</h4>
                <span className="text-[9.5px] text-[#6B7280] mt-0.5 block leading-none">
                  {log.date} • {log.method}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-emerald-600">+₹{log.amount.toLocaleString()}</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
