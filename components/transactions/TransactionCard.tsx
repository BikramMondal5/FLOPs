"use client";

import { motion } from "framer-motion";
import { Star, Eye } from "lucide-react";
import type { TransactionDTO } from "@/features/transactions/types/transaction.types";
import { CATEGORY_METADATA } from "@/features/transactions/types/transaction.types";

interface TransactionCardProps {
  transaction: TransactionDTO;
  index: number;
  onViewDetails: (tx: TransactionDTO) => void;
}

export default function TransactionCard({
  transaction,
  index,
  onViewDetails,
}: TransactionCardProps) {
  const isIncome = transaction.type === "Income";
  const badgeInfo = CATEGORY_METADATA[transaction.category] || {
    emoji: "💸",
    color: "bg-zinc-50",
    border: "border-zinc-100",
  };

  const formattedDate = new Date(transaction.transactionDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = new Date(transaction.transactionDate).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.4) }}
      onClick={() => onViewDetails(transaction)}
      whileHover={{ y: -2, scale: 1.002 }}
      className="p-4 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-[#F6B7CF]/30 hover:shadow-[0_8px_24px_rgba(246,183,207,0.06)] transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-[#FFF4F8]/30 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center gap-3">
        {/* Emoji Icon Badge */}
        <div
          className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center text-xl shrink-0 border ${badgeInfo.color} ${badgeInfo.border}`}
        >
          {badgeInfo.emoji}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-[13.5px] font-semibold text-[#18181B] m-0 leading-normal">
              {transaction.merchant}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10.5px] text-[#6B7280] mt-1 leading-none">
            <span className="font-semibold text-zinc-500">{transaction.category}</span>
            <span className="text-[#F6B7CF]/50">•</span>
            <span>{transaction.accountName ?? "External Account"}</span>
            <span className="text-[#F6B7CF]/50">•</span>
            <span>
              {formattedDate} • {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* Right side amount info */}
      <div className="flex items-center justify-between sm:justify-end gap-5 pl-14 sm:pl-0 shrink-0">
        <div className="text-right">
          <div
            className={`text-[15px] font-bold ${
              isIncome ? "text-emerald-600" : "text-[#18181B]"
            }`}
          >
            {isIncome ? "+" : "-"}₹
            {Math.abs(transaction.amount).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <span className="text-[9px] text-zinc-400 block mt-0.5">{transaction.paymentMethod}</span>
        </div>

        {/* View icon helper bubble */}
        <div className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-[#D46A96] hover:bg-[#FFF4F8] transition-colors shrink-0">
          <Eye className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
}
