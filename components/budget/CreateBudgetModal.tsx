"use client";

import { useState } from "react";
import { X, ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";

interface CreateBudgetModalProps {
  onClose: () => void;
  onCreate: (name: string, total: number) => void;
}

export default function CreateBudgetModal({ onClose, onCreate }: CreateBudgetModalProps) {
  const [step, setStep] = useState(1);
  const [budgetName, setBudgetName] = useState("");
  const [income, setIncome] = useState("95000");
  const [totalBudget, setTotalBudget] = useState("75000");
  const [startDate, setStartDate] = useState("2026-07-01");

  // Allocation Slider Mock Values
  const [foodLimit, setFoodLimit] = useState(15000);
  const [billsLimit, setBillsLimit] = useState(25000);
  const [shoppingLimit, setShoppingLimit] = useState(20000);
  
  const handleFinish = () => {
    onCreate(budgetName || "Custom Budget Plan", Number(totalBudget));
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
            <h3 className="text-sm font-semibold text-[#18181B] m-0">Create Budget • Step {step} of 2</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-[#F6B7CF]/15 flex items-center justify-center text-zinc-500 hover:text-[#18181B] shadow-sm cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-5 z-10">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              {/* Plan name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Budget Name</label>
                <input
                  type="text"
                  placeholder="e.g. My Monthly Living Budget"
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
                />
              </div>

              {/* Monthly Income & Total Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Monthly Income</label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Total Budget</label>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
                  />
                </div>
              </div>

              {/* Start Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Budget Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Category Allocations</span>

              {/* Slider for Food */}
              <div className="flex flex-col gap-2 p-3 bg-white border border-[#F6B7CF]/10 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-zinc-600">🍔 Food & Dining</span>
                  <span className="text-[#D46A96]">₹{foodLimit.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40000"
                  step="500"
                  value={foodLimit}
                  onChange={(e) => setFoodLimit(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#FFF4F8] rounded-lg appearance-none cursor-pointer accent-[#D46A96]"
                />
              </div>

              {/* Slider for Bills */}
              <div className="flex flex-col gap-2 p-3 bg-white border border-[#F6B7CF]/10 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-zinc-600">⚡ Bills & Utilities</span>
                  <span className="text-[#D46A96]">₹{billsLimit.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={billsLimit}
                  onChange={(e) => setBillsLimit(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#FFF4F8] rounded-lg appearance-none cursor-pointer accent-[#D46A96]"
                />
              </div>

              {/* Slider for Shopping */}
              <div className="flex flex-col gap-2 p-3 bg-white border border-[#F6B7CF]/10 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-zinc-600">🛍️ Shopping & Apparel</span>
                  <span className="text-[#D46A96]">₹{shoppingLimit.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40000"
                  step="500"
                  value={shoppingLimit}
                  onChange={(e) => setShoppingLimit(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#FFF4F8] rounded-lg appearance-none cursor-pointer accent-[#D46A96]"
                />
              </div>

              <div className="text-[10px] text-zinc-400 text-center mt-2 leading-relaxed">
                Allocated: <span className="font-bold text-zinc-700">₹{(foodLimit + billsLimit + shoppingLimit).toLocaleString()}</span> of ₹{Number(totalBudget).toLocaleString()} planned limit.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[#F6B7CF]/10 bg-white flex justify-between items-center shrink-0 z-10">
          {step === 1 ? (
            <>
              <button onClick={onClose} className="text-xs font-semibold py-2 px-4 border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="text-xs font-semibold py-2 px-4 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full flex items-center gap-1 cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold py-2 px-4 border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleFinish}
                className="text-xs font-semibold py-2 px-4 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Create Plan</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
