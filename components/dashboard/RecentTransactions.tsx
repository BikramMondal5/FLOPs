"use client";

import { motion } from "framer-motion";
import { Coffee, ShoppingBag, Car, Landmark, Eye, CreditCard, Pencil, Archive } from "lucide-react";
import Link from "next/link";
import type { TransactionDTO } from "@/features/transactions/types/transaction.types";

interface RecentTransactionsProps {
  transactions: TransactionDTO[];
  onEdit?: (tx: TransactionDTO) => void;
  onArchive?: (tx: TransactionDTO) => void;
}

const iconMap: Record<string, any> = {
  Housing: Coffee,
  "Food & Dining": Coffee,
  Shopping: ShoppingBag,
  Transportation: Car,
  Salary: Landmark,
  "Business Income": Landmark,
  Investments: Landmark,
};

export default function RecentTransactions({ transactions, onEdit, onArchive }: RecentTransactionsProps) {
  const hasActions = !!(onEdit || onArchive);

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden h-full">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-semibold text-[#18181B]">Recent Transactions</h3>
          <Link
            href="/transactions"
            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#D46A96] hover:text-[#d46a96]/80 transition-colors no-underline"
          >
            <span>View All</span>
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#6B7280]">
            No transactions found. Log transactions to fill summary assets.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F6B7CF]/10">
                  <th className="pb-3 text-xs font-semibold text-[#6B7280]">Merchant</th>
                  <th className="pb-3 text-xs font-semibold text-[#6B7280]">Category</th>
                  <th className="pb-3 text-xs font-semibold text-[#6B7280]">Amount</th>
                  <th className="pb-3 text-xs font-semibold text-[#6B7280] hidden md:table-cell">Date</th>
                  <th className="pb-3 text-xs font-semibold text-[#6B7280]">Account</th>
                  {hasActions && (
                    <th className="pb-3 text-xs font-semibold text-[#6B7280] text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, idx) => {
                  const Icon = iconMap[t.category] || CreditCard;
                  const dateStr = new Date(t.transactionDate).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  return (
                    <motion.tr
                      key={t._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                      className="group border-b border-[#F6B7CF]/5 hover:bg-[#FFF4F8]/20 transition-all duration-300"
                    >
                      <td className="py-3.5 flex items-center gap-3">
                        <div className="w-[32px] h-[32px] bg-[#FFF4F8] rounded-lg flex items-center justify-center text-[#D46A96] group-hover:scale-105 transition-transform duration-300">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-semibold text-[#18181B]">{t.merchant}</span>
                      </td>
                      <td className="py-3.5">
                        <span className="text-[12px] text-[#6B7280]">{t.category}</span>
                      </td>
                      <td className="py-3.5">
                        <span className={`text-[13px] font-bold ${t.type === "Income" ? "text-emerald-600" : "text-[#18181B]"}`}>
                          {t.type === "Income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3.5 hidden md:table-cell">
                        <span className="text-[12px] text-[#6B7280]">{dateStr}</span>
                      </td>
                      <td className="py-3.5">
                        <span className="text-[11px] font-semibold text-[#6B7280] bg-[#FFF4F8] px-2 py-0.5 rounded">
                          {t.accountName || "Account"}
                        </span>
                      </td>
                      {hasActions && (
                        <td className="py-3.5">
                          <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {onEdit && (
                              <button
                                onClick={() => onEdit(t)}
                                title="Edit transaction"
                                className="w-7 h-7 rounded-lg bg-[#FFF4F8] flex items-center justify-center text-[#D46A96] hover:bg-[#F6B7CF]/30 transition-colors cursor-pointer"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                            )}
                            {onArchive && (
                              <button
                                onClick={() => onArchive(t)}
                                title="Archive transaction"
                                className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 hover:bg-amber-100 transition-colors cursor-pointer"
                              >
                                <Archive className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
