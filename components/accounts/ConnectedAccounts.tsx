"use client";

import { motion } from "framer-motion";
import { Landmark, RefreshCw, MoreVertical, AlertCircle } from "lucide-react";

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

interface ConnectedAccountsProps {
  accounts: Account[];
  onSelectAccount: (acc: Account) => void;
  onSync: (id: string) => void;
  searchQuery: string;
  filterStatus: string;
}

export default function ConnectedAccounts({
  accounts,
  onSelectAccount,
  onSync,
  searchQuery,
  filterStatus,
}: ConnectedAccountsProps) {
  
  // Apply search query and status filter
  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.type.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = filterStatus === "All" || acc.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredAccounts.map((acc, idx) => (
        <motion.div
          key={acc.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.08 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between overflow-hidden group hover:border-[#F6B7CF]/30 transition-all duration-300 min-h-[220px]"
        >
          {/* Card Body */}
          <div className="p-6 flex flex-col gap-4 flex-grow">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-[38px] h-[38px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-[#D46A96] border border-[#F6B7CF]/20 shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-[#18181B] m-0 group-hover:text-[#D46A96] transition-colors leading-normal">{acc.nickname}</h4>
                  <p className="text-[11px] text-[#6B7280] m-0 mt-0.5 leading-none">{acc.bankName}</p>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  acc.status === "Connected"
                    ? "bg-emerald-50 text-emerald-600"
                    : acc.status === "Syncing"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                <span className={`w-1 h-1 rounded-full ${
                  acc.status === "Connected" ? "bg-emerald-500" :
                  acc.status === "Syncing" ? "bg-amber-500 animate-pulse" : "bg-rose-500"
                }`} />
                <span>{acc.status}</span>
              </span>
            </div>

            {/* Balances details */}
            <div className="mt-2">
              <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wide">Current Balance</span>
              <div className="text-2xl font-bold text-[#18181B] mt-1">₹{acc.balance.toLocaleString()}</div>
              {acc.availableBalance && (
                <div className="text-[11px] text-[#6B7280] mt-1">
                  Available: <span className="font-semibold text-zinc-700">₹{acc.availableBalance.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="text-[10px] text-zinc-400 mt-2 flex justify-between items-center border-t border-[#F6B7CF]/8 pt-3 leading-none">
              <span>Sync: {acc.lastSynced}</span>
              <span>Acc: •••• {acc.accountNumber.slice(-4)}</span>
            </div>
          </div>

          {/* Card Footer Actions */}
          <div className="px-6 py-4 bg-[#FCFCFD] border-t border-[#F6B7CF]/10 flex gap-2 justify-between items-center shrink-0">
            <button
              onClick={() => onSelectAccount(acc)}
              className="text-[11px] font-semibold py-1.5 px-3 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full transition-all duration-300 cursor-pointer"
            >
              View Details
            </button>
            <button
              onClick={() => onSync(acc.id)}
              disabled={acc.status === "Syncing"}
              className="text-[11px] font-semibold py-1.5 px-3 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full flex items-center gap-1.5 transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${acc.status === "Syncing" ? "animate-spin" : ""}`} />
              <span>Sync</span>
            </button>
          </div>

        </motion.div>
      ))}
    </div>
  );
}
