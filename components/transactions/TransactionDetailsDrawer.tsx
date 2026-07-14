"use client";

import { motion } from "framer-motion";
import { X, Trash2, Edit2, Download, Landmark, Calendar, Tag, ShieldCheck, MapPin, ReceiptText } from "lucide-react";

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  time: string;
  status: string;
  bank: string;
  type: "Income" | "Expense" | "Refund" | "Pending";
  icon: string;
}

interface TransactionDetailsDrawerProps {
  transaction: Transaction;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function TransactionDetailsDrawer({
  transaction,
  onClose,
  onDelete,
}: TransactionDetailsDrawerProps) {
  const isIncome = transaction.type === "Income";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[100]" onClick={onClose} />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-[#FCFCFD] border-l border-[#F6B7CF]/20 shadow-2xl z-[101] flex flex-col justify-between"
      >
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-[#F6B7CF]/10 blur-3xl pointer-events-none" />

        {/* Drawer Header */}
        <div className="p-6 border-b border-[#F6B7CF]/10 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-xl border border-[#F6B7CF]/20 shrink-0">
              {transaction.icon}
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#18181B] m-0">{transaction.merchant}</h3>
              <span className="text-[10px] text-zinc-400">ID: {transaction.id}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#F6B7CF]/15 flex items-center justify-center text-zinc-500 hover:text-[#18181B] shadow-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 flex-grow z-10">
          
          {/* Large Amount Display */}
          <div className="p-6 bg-white border border-[#F6B7CF]/10 rounded-[24px] shadow-sm text-center">
            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Transaction Amount</span>
            <div className={`text-3xl font-extrabold mt-2 ${isIncome ? "text-emerald-600" : "text-[#18181B]"}`}>
              {isIncome ? "+" : "-"}₹{Math.abs(transaction.amount).toLocaleString()}
            </div>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-2.5 ${
                transaction.status === "Completed"
                  ? "bg-emerald-50 text-emerald-600"
                  : transaction.status === "Received"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              <span className={`w-1 h-1 rounded-full ${
                transaction.status === "Completed" || transaction.status === "Received" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
              }`} />
              <span>{transaction.status}</span>
            </span>
          </div>

          {/* Details Metadata List */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-[#18181B] uppercase tracking-wide px-1">Details</h4>
            
            <div className="flex flex-col gap-3 bg-white border border-[#F6B7CF]/10 rounded-[24px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              {/* Category */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B7280] flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Category</span>
                </span>
                <span className="font-semibold text-zinc-700">{transaction.category}</span>
              </div>
              
              {/* Date & Time */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B7280] flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Date & Time</span>
                </span>
                <span className="font-semibold text-zinc-700">{transaction.date} • {transaction.time}</span>
              </div>

              {/* Bank Account */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B7280] flex items-center gap-2">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Account</span>
                </span>
                <span className="font-semibold text-zinc-700">{transaction.bank}</span>
              </div>

              {/* Security Audit */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B7280] flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Security</span>
                </span>
                <span className="font-bold text-emerald-600">✓ Audited & Secure</span>
              </div>
            </div>
          </div>

          {/* Receipt Preview Component Placeholder */}
          <div className="p-4 bg-white border border-[#F6B7CF]/10 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
            <h4 className="text-xs font-semibold text-[#18181B] uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <ReceiptText className="w-4 h-4 text-[#D46A96]" />
              <span>Receipt Preview</span>
            </h4>
            <div className="w-full h-[80px] border border-dashed border-[#F6B7CF]/30 rounded-2xl flex flex-col items-center justify-center bg-zinc-50/50">
              <span className="text-[11px] font-semibold text-[#D46A96]">RECEIPT_FLOPs_{transaction.id}.PDF</span>
              <span className="text-[9px] text-[#6B7280] mt-1">Verified on transaction settlement</span>
            </div>
          </div>

          {/* Map Location Placeholder */}
          <div className="p-4 bg-white border border-[#F6B7CF]/10 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
            <h4 className="text-xs font-semibold text-[#18181B] uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#D46A96]" />
              <span>Transaction Location</span>
            </h4>
            <div className="w-full h-[80px] bg-[#FFF4F8]/50 border border-[#F6B7CF]/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <span className="text-[11px] font-semibold text-zinc-600 z-10 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D46A96] animate-bounce" />
                <span>Mumbai, Maharashtra</span>
              </span>
              {/* Fake grid lines mapping illustration */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/0 via-white/40 to-white/80 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 border-t border-[#F6B7CF]/10 bg-white z-10 flex gap-2 shrink-0">
          <button className="flex-1 text-xs font-semibold py-3 px-4 bg-zinc-50 border border-[#F6B7CF]/20 text-[#18181B] hover:bg-zinc-100 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Log</span>
          </button>
          <button className="flex-1 text-xs font-semibold py-3 px-4 bg-zinc-50 border border-[#F6B7CF]/20 text-[#18181B] hover:bg-zinc-100 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="text-xs font-semibold p-3 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </motion.div>
    </>
  );
}
