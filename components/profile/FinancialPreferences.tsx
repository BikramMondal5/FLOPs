"use client";

import { useState } from "react";
import { PiggyBank, ShieldCheck } from "lucide-react";

export default function FinancialPreferences() {
  const [risk, setRisk] = useState<"Conservative" | "Moderate" | "Aggressive">("Moderate");
  const [cycle, setCycle] = useState<"Weekly" | "Monthly" | "Yearly">("Monthly");
  const [currency, setCurrency] = useState("INR (₹)");
  const [incomeRange, setIncomeRange] = useState("₹1,00,000 - ₹2,00,000");
  const [primaryGoal, setPrimaryGoal] = useState("Dream Home Fund");

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] h-full flex flex-col justify-between">
      <div className="mb-5 shrink-0">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Financial Preferences</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Personalize your optimization algorithms</p>
      </div>

      <div className="flex-grow flex flex-col gap-4">
        {/* Preferred Currency & Income range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Reporting Currency</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#F6B7CF]/40 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Monthly Income Range</label>
            <input
              type="text"
              value={incomeRange}
              onChange={(e) => setIncomeRange(e.target.value)}
              className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#F6B7CF]/40 transition-colors"
            />
          </div>
        </div>

        {/* Primary Goal */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Primary Target Focus</label>
          <input
            type="text"
            value={primaryGoal}
            onChange={(e) => setPrimaryGoal(e.target.value)}
            className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#F6B7CF]/40 transition-colors"
          />
        </div>

        {/* Risk Preference segmented list */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Risk Tolerance Profile</label>
          <div className="flex gap-1 bg-[#FFF4F8] p-1 rounded-xl border border-[#F6B7CF]/10">
            {(["Conservative", "Moderate", "Aggressive"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRisk(r)}
                className={`flex-1 text-[11px] font-semibold py-2 rounded-lg transition-all cursor-pointer ${
                  risk === r ? "bg-[#D46A96] text-white shadow-sm" : "text-[#6B7280] hover:text-[#18181B]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Budget Cycle segmented list */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Optimization Frequency</label>
          <div className="flex gap-1 bg-[#FFF4F8] p-1 rounded-xl border border-[#F6B7CF]/10">
            {(["Weekly", "Monthly", "Yearly"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={`flex-1 text-[11px] font-semibold py-2 rounded-lg transition-all cursor-pointer ${
                  cycle === c ? "bg-[#D46A96] text-white shadow-sm" : "text-[#6B7280] hover:text-[#18181B]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
