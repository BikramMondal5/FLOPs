"use client";

import { useState } from "react";
import { X, Check, Sparkles } from "lucide-react";

const TRANSACTION_CATEGORIES = [
  "Housing",
  "Bills & Utilities",
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Travel",
  "Entertainment",
  "Health & Fitness",
  "Education",
  "Personal Care",
  "Gifts & Donations",
  "Insurance",
  "Taxes",
  "Fees & Charges",
  "Other",
] as const;

const CATEGORY_ICONS: Record<string, string> = {
  "Housing": "🏠",
  "Bills & Utilities": "⚡",
  "Food & Dining": "🍔",
  "Shopping": "🛍️",
  "Transportation": "🚗",
  "Travel": "✈️",
  "Entertainment": "🎬",
  "Health & Fitness": "❤️",
  "Education": "📚",
  "Personal Care": "💅",
  "Gifts & Donations": "🎁",
  "Insurance": "🛡️",
  "Taxes": "📝",
  "Fees & Charges": "💸",
  "Other": "🪙",
};

interface CreateBudgetModalProps {
  onClose: () => void;
  onCreate: (name: string, total: number, category: string, alertThreshold: number) => void;
}

export default function CreateBudgetModal({ onClose, onCreate }: CreateBudgetModalProps) {
  const [budgetName, setBudgetName] = useState("");
  const [category, setCategory] = useState<string>("Food & Dining");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [alertThreshold, setAlertThreshold] = useState("80");
  
  const handleCreate = () => {
    if (!budgetName.trim() || !monthlyLimit || Number(monthlyLimit) <= 0) {
      alert("Please fill in all required fields");
      return;
    }
    onCreate(budgetName.trim(), Number(monthlyLimit), category, Number(alertThreshold));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md">
      <div className="bg-[#FCFCFD] border border-[#F6B7CF]/25 rounded-[32px] w-full max-w-[500px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col">
        {/* Header decoration */}
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 rounded-full bg-[#F6B7CF]/10 blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-[#F6B7CF]/10 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-[#D46A96]" />
            <h3 className="text-sm font-semibold text-[#18181B] m-0">Create Budget Tracker</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-[#F6B7CF]/15 flex items-center justify-center text-zinc-500 hover:text-[#18181B] shadow-sm cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-5 z-10">
          <div className="flex flex-col gap-4">
            {/* Budget Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Tracker Name</label>
              <input
                type="text"
                placeholder="e.g. Monthly Groceries"
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
                className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
              />
            </div>

            {/* Category Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors cursor-pointer"
              >
                {TRANSACTION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_ICONS[cat]} {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly Limit */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Monthly Limit (₹)</label>
              <input
                type="number"
                placeholder="e.g. 10000"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
                min="0"
                step="100"
              />
            </div>

            {/* Alert Threshold */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Alert Threshold (%)</label>
              <input
                type="number"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
                min="50"
                max="100"
                step="5"
              />
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Get notified when spending reaches {alertThreshold}% of your limit
              </p>
            </div>

            {/* Preview Card */}
            <div className="p-4 bg-gradient-to-br from-[#FFF4F8] to-white border border-[#F6B7CF]/20 rounded-2xl">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-2">Preview</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                <div>
                  <p className="text-sm font-bold text-zinc-800 m-0">{budgetName || "Budget Name"}</p>
                  <p className="text-xs text-zinc-500 m-0">{category}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#F6B7CF]/10">
                <p className="text-xs text-zinc-600">
                  Limit: <span className="font-bold text-[#D46A96]">₹{monthlyLimit ? Number(monthlyLimit).toLocaleString("en-IN") : "0"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[#F6B7CF]/10 bg-white flex justify-between items-center shrink-0 z-10">
          <button onClick={onClose} className="text-xs font-semibold py-2 px-4 border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="text-xs font-semibold py-2 px-4 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Create Tracker</span>
          </button>
        </div>

      </div>
    </div>
  );
}
