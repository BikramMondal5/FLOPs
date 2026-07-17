"use client";

import { useState } from "react";
import { X, ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface CreateGoalModalProps {
  onClose: () => void;
  onCreate: (name: string, target: number, currentSaved: number, targetDate: string, monthlyContribution: number, category: string, priority: string) => void;
}

export default function CreateGoalModal({ onClose, onCreate }: CreateGoalModalProps) {
  const [step, setStep] = useState(1);
  const [goalName, setGoalName] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [priority, setPriority] = useState("Medium");
  const [targetAmount, setTargetAmount] = useState("150000");
  const [currentSavings, setCurrentSavings] = useState("0");
  const [targetDate, setTargetDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  });
  const [monthlyContribution, setMonthlyContribution] = useState("5000");

  const handleFinish = () => {
    if (!goalName.trim() || !targetAmount || Number(targetAmount) <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    onCreate(
      goalName.trim(),
      Number(targetAmount),
      Number(currentSavings),
      targetDate,
      Number(monthlyContribution),
      category,
      priority
    );
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
            <h3 className="text-sm font-semibold text-[#18181B] m-0">Create Financial Goal • Step {step} of 3</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-[#F6B7CF]/15 flex items-center justify-center text-zinc-500 hover:text-[#18181B] shadow-sm cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-5 z-10">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dream House Fund"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
                >
                  <option value="Emergency Fund">🛡️ Emergency Fund</option>
                  <option value="Electronics">💻 Electronics (Laptop)</option>
                  <option value="Vehicle">🚗 Vehicle (Bike/Car)</option>
                  <option value="Travel">✈️ Vacation</option>
                  <option value="Home">🏡 House</option>
                  <option value="Education">📚 Education</option>
                  <option value="Wedding">💒 Wedding</option>
                  <option value="Investment">📈 Investment</option>
                  <option value="Retirement">🎯 Retirement</option>
                  <option value="Other">📦 Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Target Amount</label>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Current Savings</label>
                  <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                    className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Monthly Addition</label>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="p-5 bg-gradient-to-br from-[#FFF4F8] to-white border border-[#F6B7CF]/20 rounded-2xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-3">Goal Summary</p>
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600">Goal:</span>
                    <span className="font-bold text-zinc-800">{goalName || "Unnamed Goal"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600">Target:</span>
                    <span className="font-bold text-[#D46A96]">₹{Number(targetAmount).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600">Current Saved:</span>
                    <span className="font-bold text-emerald-600">₹{Number(currentSavings).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600">Monthly:</span>
                    <span className="font-bold text-zinc-800">₹{Number(monthlyContribution).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600">Target Date:</span>
                    <span className="font-bold text-zinc-800">{new Date(targetDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-[#F6B7CF]/10">
                    <span className="text-zinc-600">Remaining:</span>
                    <span className="font-bold text-zinc-800">₹{(Number(targetAmount) - Number(currentSavings)).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
              <p className="text-[9.5px] text-center text-zinc-400 leading-relaxed">
                Based on your monthly contribution, this goal will track your progress automatically using your transaction data.
              </p>
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
          ) : step === 2 ? (
            <>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold py-2 px-4 border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="text-xs font-semibold py-2 px-4 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full flex items-center gap-1 cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(2)}
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
                <span>Create Goal</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
