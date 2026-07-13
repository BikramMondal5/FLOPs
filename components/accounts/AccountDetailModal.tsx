"use client";

import { useState, useEffect } from "react";
import { X, RefreshCw, Trash2, Edit2, Landmark, CheckCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Account {
  id: string;
  bankName: string;
  nickname: string;
  type: string;
  accountNumber: string;
  balance: number;
  availableBalance?: number;
  lastSynced: string;
  status: "Connected" | "Syncing" | "Requires Attention";
}

interface AccountDetailModalProps {
  account: Account;
  onClose: () => void;
  onSync: (id: string) => void;
  onDisconnect: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

const mockTransactions = [
  { desc: "Salary Credit - FLOPs Inc", date: "Jul 10, 2026", amount: 75000, type: "credit" },
  { desc: "Amazon Web Services", date: "Jul 08, 2026", amount: -4500, type: "debit" },
  { desc: "Starbucks Coffee", date: "Jul 05, 2026", amount: -380, type: "debit" },
  { desc: "Rent Transfer - Landlord", date: "Jul 01, 2026", amount: -22000, type: "debit" },
];

const cashFlowData = [
  { month: "Jan", Flow: 12000 },
  { month: "Feb", Flow: 14200 },
  { month: "Mar", Flow: 11500 },
  { month: "Apr", Flow: 15000 },
  { month: "May", Flow: 16800 },
  { month: "Jun", Flow: 18600 },
];

export default function AccountDetailModal({
  account,
  onClose,
  onSync,
  onDisconnect,
  onRename,
}: AccountDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(account.nickname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveRename = () => {
    onRename(account.id, nickname);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md">
      <div className="bg-[#FCFCFD] border border-[#F6B7CF]/25 rounded-[32px] w-full max-w-[620px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header decoration */}
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 rounded-full bg-[#F6B7CF]/10 blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-[#F6B7CF]/10 flex justify-between items-start z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-[#D46A96] border border-[#F6B7CF]/20">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="text-base font-semibold text-[#18181B] bg-white border border-[#F6B7CF]/30 px-2 py-0.5 rounded-lg outline-none max-w-[150px]"
                  />
                ) : (
                  <h3 className="text-base font-semibold text-[#18181B] m-0">{account.nickname}</h3>
                )}
                {isEditing ? (
                  <button onClick={handleSaveRename} className="text-xs font-semibold text-emerald-600 cursor-pointer">Save</button>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="text-zinc-400 hover:text-[#18181B] cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-[11px] text-[#6B7280]">{account.bankName} • {account.type} (•••• {account.accountNumber.slice(-4)})</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-[#F6B7CF]/15 flex items-center justify-center text-zinc-500 hover:text-[#18181B] shadow-sm cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 flex-grow">
          {/* Balance Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-[#F6B7CF]/10 rounded-[20px] shadow-sm">
              <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">Current Balance</span>
              <div className="text-2xl font-bold text-[#18181B] mt-1.5">₹{account.balance.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-white border border-[#F6B7CF]/10 rounded-[20px] shadow-sm">
              <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">Available Balance</span>
              <div className="text-2xl font-bold text-[#18181B] mt-1.5">
                ₹{(account.availableBalance || account.balance).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Monthly Cash Flow Chart */}
          <div className="p-4 bg-white border border-[#F6B7CF]/10 rounded-[24px] shadow-sm">
            <h4 className="text-xs font-semibold text-[#18181B] uppercase tracking-wide mb-3">Monthly Cash Flow</h4>
            <div className="w-full h-[150px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlowData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D46A96" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#D46A96" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "12px", border: "1px solid rgba(246,183,207,0.2)" }} />
                    <Area type="monotone" dataKey="Flow" stroke="#D46A96" strokeWidth={2} fillOpacity={1} fill="url(#colorFlow)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">Loading flow data...</div>
              )}
            </div>
          </div>

          {/* Recent Transactions List */}
          <div>
            <h4 className="text-xs font-semibold text-[#18181B] uppercase tracking-wide mb-3">Recent Transactions</h4>
            <div className="flex flex-col gap-2.5">
              {mockTransactions.map((tx, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-white border border-[#F6B7CF]/8 rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                  <div>
                    <div className="text-[12.5px] font-semibold text-[#18181B]">{tx.desc}</div>
                    <span className="text-[10px] text-[#6B7280]">{tx.date}</span>
                  </div>
                  <span className={`text-[12.5px] font-bold ${tx.type === "credit" ? "text-emerald-600" : "text-[#18181B]"}`}>
                    {tx.type === "credit" ? "+" : "-"}₹{Math.abs(tx.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[#F6B7CF]/10 bg-white flex justify-between items-center gap-3 shrink-0 z-10">
          <div className="flex gap-2">
            <button
              onClick={() => onSync(account.id)}
              className="text-[12px] font-semibold py-2 px-4 bg-[#FFF4F8] border border-[#F6B7CF]/20 text-[#D46A96] hover:bg-[#FFF4F8]/70 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Now</span>
            </button>
            <button
              onClick={() => onDisconnect(account.id)}
              className="text-[12px] font-semibold py-2 px-4 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100/50 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          </div>
          <span className="text-[10px] text-zinc-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span>Synced {account.lastSynced}</span>
          </span>
        </div>

      </div>
    </div>
  );
}
