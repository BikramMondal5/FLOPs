"use client";

import { motion } from "framer-motion";
import { FileDown, Calendar } from "lucide-react";

interface Report {
  name: string;
  date: string;
  status: string;
}

export default function AIReportsList() {
  const reports: Report[] = [
    { name: "Weekly Summary", date: "Jul 12, 2026", status: "Generated" },
    { name: "Monthly Financial Health Report", date: "Jul 01, 2026", status: "Generated" },
    { name: "Budget Optimization Audit", date: "Jun 24, 2026", status: "Archived" },
    { name: "Investment Allocation Forecast", date: "Jun 10, 2026", status: "Archived" },
  ];

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] relative overflow-hidden h-full flex flex-col justify-between">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Generated PDF Reports</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">AI compiled audit statements</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.name}
            className="p-4 bg-zinc-50/50 border border-[#F6B7CF]/8 rounded-[20px] hover:border-[#F6B7CF]/20 transition-all duration-300 flex flex-col justify-between gap-3 group"
          >
            <div className="flex gap-2.5 items-start">
              <Calendar className="w-4.5 h-4.5 text-[#D46A96] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-[12px] font-bold text-[#18181B] m-0 leading-normal">{rep.name}</h4>
                <p className="text-[10px] text-[#6B7280] mt-0.5 m-0 leading-normal">Compiled {rep.date} • {rep.status}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-1 pt-2.5 border-t border-zinc-100">
              <span className="text-[9.5px] font-bold text-zinc-400">PDF Document</span>
              <button
                onClick={() => alert(`Downloading report: ${rep.name}.pdf`)}
                className="text-[9px] font-bold py-1.5 px-3 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full flex items-center gap-1 transition-all cursor-pointer"
              >
                <FileDown className="w-3 h-3" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
