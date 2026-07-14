"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Edit2,
  Landmark,
  Calendar,
  Tag,
  ShieldCheck,
  MapPin,
  ReceiptText,
} from "lucide-react";
import type { TransactionDTO } from "@/features/transactions/types/transaction.types";
import { CATEGORY_METADATA } from "@/features/transactions/types/transaction.types";

interface TransactionDetailDrawerProps {
  transaction: TransactionDTO | null;
  onClose: () => void;
  onEdit: (tx: TransactionDTO) => void;
  onArchive: (tx: TransactionDTO) => void;
}

export default function TransactionDetailDrawer({
  transaction,
  onClose,
  onEdit,
  onArchive,
}: TransactionDetailDrawerProps) {
  const open = !!transaction;
  if (!transaction) return null;

  const isIncome = transaction.type === "Income";
  const badgeInfo = CATEGORY_METADATA[transaction.category] || {
    emoji: "💸",
    color: "bg-zinc-50",
    border: "border-zinc-100",
  };

  const formattedDate = new Date(transaction.transactionDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = new Date(transaction.transactionDate).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-[#FCFCFD] border-l border-[#F6B7CF]/20 shadow-2xl z-[101] flex flex-col justify-between"
          >
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-[#F6B7CF]/10 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="p-6 border-b border-[#F6B7CF]/10 flex justify-between items-center z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-[42px] h-[42px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-xl border border-[#F6B7CF]/20 shrink-0">
                  {badgeInfo.emoji}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#18181B] m-0">{transaction.merchant}</h3>
                  <span className="text-[10px] text-zinc-400">ID: {transaction._id}</span>
                </div>
              </div>
              <button
                id="close-tx-drawer"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-[#F6B7CF]/15 flex items-center justify-center text-zinc-500 hover:text-[#18181B] shadow-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Details details list */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6 flex-grow z-10">
              {/* Large Amount Box */}
              <div className="p-6 bg-white border border-[#F6B7CF]/10 rounded-[24px] shadow-sm text-center">
                <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                  Transaction Amount
                </span>
                <div
                  className={`text-3xl font-extrabold mt-2 ${
                    isIncome ? "text-emerald-600" : "text-[#18181B]"
                  }`}
                >
                  {isIncome ? "+" : "-"}₹
                  {Math.abs(transaction.amount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <span className="text-[10px] text-zinc-400 block mt-1">{transaction.paymentMethod}</span>
              </div>

              {/* Detail fields */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-semibold text-[#18181B] uppercase tracking-wide px-1">
                  Details
                </h4>

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
                    <span className="font-semibold text-zinc-700">
                      {formattedDate} • {formattedTime}
                    </span>
                  </div>

                  {/* Account */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#6B7280] flex items-center gap-2">
                      <Landmark className="w-3.5 h-3.5" />
                      <span>Linked Account</span>
                    </span>
                    <span className="font-semibold text-zinc-700">
                      {transaction.accountName ?? "External"}
                    </span>
                  </div>

                  {/* Location */}
                  {transaction.location && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#6B7280] flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Location</span>
                      </span>
                      <span className="font-semibold text-zinc-700">{transaction.location}</span>
                    </div>
                  )}

                  {/* Security */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#6B7280] flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Security Audit</span>
                    </span>
                    <span className="font-bold text-emerald-600">✓ Audited & Secured</span>
                  </div>
                </div>
              </div>

              {/* Memo Note box */}
              {transaction.notes && (
                <div className="p-4 bg-white border border-[#F6B7CF]/10 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                  <h4 className="text-xs font-semibold text-[#18181B] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <ReceiptText className="w-4 h-4 text-[#D46A96]" />
                    <span>Memo/Notes</span>
                  </h4>
                  <p className="text-[12px] text-zinc-600 m-0 leading-relaxed font-sans">
                    {transaction.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer triggers */}
            <div className="p-6 border-t border-[#F6B7CF]/10 bg-white z-10 flex gap-2 shrink-0">
              <button
                id="drawer-edit-tx"
                onClick={() => {
                  onClose();
                  setTimeout(() => onEdit(transaction), 100);
                }}
                className="flex-1 text-xs font-semibold py-3 px-4 bg-zinc-50 border border-[#F6B7CF]/20 text-[#18181B] hover:bg-zinc-100 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Log</span>
              </button>
              <button
                id="drawer-archive-tx"
                onClick={() => {
                  onClose();
                  setTimeout(() => onArchive(transaction), 100);
                }}
                className="text-xs font-semibold p-3 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
