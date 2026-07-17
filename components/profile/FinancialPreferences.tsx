"use client";

import { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import type { FullProfileDTO } from "@/features/profile/dto/profile.dto";

interface FinancialPreferencesProps {
  profile: FullProfileDTO;
  onUpdate: (updates: any) => Promise<void>;
}

export default function FinancialPreferences({ profile }: FinancialPreferencesProps) {
  const { financialSnapshot, profile: userProfile } = profile;

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] h-full flex flex-col justify-between">
      <div className="mb-5 shrink-0">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Financial Snapshot</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Your financial overview and preferences</p>
      </div>

      <div className="flex-grow flex flex-col gap-4">
        {/* Currency - Editable */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Preferred Currency</label>
          <div className="text-sm text-[#18181B] bg-zinc-50 border border-[#F6B7CF]/15 rounded-xl px-3.5 py-2.5">
            {userProfile.currency}
          </div>
        </div>

        {/* Net Worth - Read Only */}
        <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100">
          <span className="text-[#6B7280]">Net Worth</span>
          <span className="font-bold text-[#18181B]">
            {userProfile.currency} {financialSnapshot.netWorth.toLocaleString()}
          </span>
        </div>

        {/* Monthly Income - Read Only */}
        <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100">
          <span className="text-[#6B7280]">Monthly Income</span>
          <span className="font-bold text-emerald-600">
            {userProfile.currency} {financialSnapshot.monthlyIncome.toLocaleString()}
          </span>
        </div>

        {/* Monthly Expenses - Read Only */}
        <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100">
          <span className="text-[#6B7280]">Monthly Expenses</span>
          <span className="font-bold text-rose-600">
            {userProfile.currency} {financialSnapshot.monthlyExpenses.toLocaleString()}
          </span>
        </div>

        {/* Savings Rate - Read Only */}
        <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100">
          <span className="text-[#6B7280]">Savings Rate</span>
          <span className="font-bold text-[#18181B]">{financialSnapshot.savingsRate}%</span>
        </div>

        {/* Connected Banks - Read Only */}
        <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100">
          <span className="text-[#6B7280]">Connected Banks</span>
          <span className="font-bold text-[#18181B]">{financialSnapshot.connectedBanks}</span>
        </div>

        {/* Risk Profile - Read Only */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Risk Tolerance Profile</label>
          <div className="flex gap-1 bg-[#FFF4F8] p-1 rounded-xl border border-[#F6B7CF]/10">
            {(["Conservative", "Moderate", "Aggressive"] as const).map((r) => (
              <div
                key={r}
                className={`flex-1 text-[11px] font-semibold py-2 rounded-lg text-center transition-all ${
                  financialSnapshot.riskProfile === r
                    ? "bg-[#D46A96] text-white shadow-sm"
                    : "text-[#6B7280]"
                }`}
              >
                {r}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
