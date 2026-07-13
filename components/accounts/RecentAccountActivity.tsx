"use client";

import { motion } from "framer-motion";
import { Landmark, ArrowRight, RefreshCw } from "lucide-react";

interface Activity {
  id: string;
  institution: string;
  action: string;
  time: string;
  status: "Completed" | "Sync Failed";
}

export default function RecentAccountActivity() {
  const activities: Activity[] = [
    {
      id: "act1",
      institution: "ICICI Bank Savings",
      action: "Balance Updated",
      time: "2 mins ago",
      status: "Completed",
    },
    {
      id: "act2",
      institution: "HDFC Bank Credit Card",
      action: "New Transactions Synced",
      time: "10 mins ago",
      status: "Completed",
    },
    {
      id: "act3",
      institution: "Axis Active Investments",
      action: "System Refreshed",
      time: "15 mins ago",
      status: "Completed",
    },
    {
      id: "act4",
      institution: "SBI Pension Fund",
      action: "Sync Failed",
      time: "30 mins ago",
      status: "Sync Failed",
    },
  ];

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] relative overflow-hidden h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-base font-semibold text-[#18181B] m-0">Recent Account Activity</h3>
          <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Sync and statement upload logs</p>
        </div>
        <RefreshCw className="w-4.5 h-4.5 text-[#D46A96]" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F6B7CF]/10">
              <th className="pb-3 text-xs font-semibold text-[#6B7280]">Institution</th>
              <th className="pb-3 text-xs font-semibold text-[#6B7280]">Action</th>
              <th className="pb-3 text-xs font-semibold text-[#6B7280] hidden md:table-cell">Time</th>
              <th className="pb-3 text-xs font-semibold text-[#6B7280]">Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a, idx) => (
              <motion.tr
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="group border-b border-[#F6B7CF]/5 hover:bg-[#FFF4F8]/20 transition-all duration-300 cursor-pointer"
              >
                <td className="py-3.5 flex items-center gap-3">
                  <div className="w-[30px] h-[30px] bg-[#FFF4F8] rounded-lg flex items-center justify-center text-[#D46A96] group-hover:scale-105 transition-transform duration-300">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] font-semibold text-[#18181B]">{a.institution}</span>
                </td>
                <td className="py-3.5">
                  <span className="text-[12px] text-zinc-500">{a.action}</span>
                </td>
                <td className="py-3.5 hidden md:table-cell">
                  <span className="text-[12px] text-[#6B7280]">{a.time}</span>
                </td>
                <td className="py-3.5">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      a.status === "Completed"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${a.status === "Completed" ? "bg-emerald-500" : "bg-rose-500"}`} />
                    <span>{a.status}</span>
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
