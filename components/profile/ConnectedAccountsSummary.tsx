"use client";

import { motion } from "framer-motion";
import { Landmark, RefreshCw, ChevronRight } from "lucide-react";

interface AccountSummary {
  institution: string;
  type: string;
  status: string;
  lastSynced: string;
  icon: string;
}

export default function ConnectedAccountsSummary() {
  const accounts: AccountSummary[] = [
    { institution: "ICICI Bank", type: "Savings & Credit", status: "Connected", lastSynced: "2 mins ago", icon: "🏛️" },
    { institution: "Groww Portfolio", type: "Mutual Funds", status: "Connected", lastSynced: "5 mins ago", icon: "📈" },
    { institution: "HDFC Credit Card", type: "Credit Line", status: "Connected", lastSynced: "12 mins ago", icon: "💳" },
  ];

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] h-full flex flex-col justify-between">
      <div className="mb-5 shrink-0">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Connected Institutions</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Active bank and platform sync feeds</p>
      </div>

      <div className="flex-grow flex flex-col gap-3">
        {accounts.map((acc, idx) => (
          <div
            key={acc.institution}
            className="p-3.5 bg-zinc-50/50 border border-[#F6B7CF]/8 rounded-[20px] hover:border-[#F6B7CF]/20 transition-all duration-300 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-[34px] h-[34px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-lg border border-[#F6B7CF]/20 shrink-0">
                {acc.icon}
              </div>
              <div>
                <h4 className="text-[12.5px] font-semibold text-[#18181B] m-0 leading-normal">{acc.institution}</h4>
                <span className="text-[9.5px] text-[#6B7280] mt-0.5 block leading-none">
                  {acc.type} • Synced {acc.lastSynced}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600">
                {acc.status}
              </span>
              <button
                onClick={() => alert(`Syncing ${acc.institution}...`)}
                className="w-7 h-7 rounded-full bg-white border border-[#F6B7CF]/15 flex items-center justify-center text-zinc-400 group-hover:text-[#D46A96] hover:bg-[#FFF4F8] transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
