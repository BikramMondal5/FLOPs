"use client";

import { motion } from "framer-motion";
import { Coffee, ShoppingBag, Car, Landmark, ArrowRight, Eye } from "lucide-react";

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  status: "Completed" | "Pending";
  icon: any;
}

export default function RecentTransactions() {
  const transactions: Transaction[] = [
    {
      id: "t1",
      merchant: "Blue Bottle Coffee",
      category: "Food & Drinks",
      amount: 420,
      date: "Today, 10:42 AM",
      status: "Completed",
      icon: Coffee,
    },
    {
      id: "t2",
      merchant: "Zara Retail",
      category: "Shopping",
      amount: 4890,
      date: "Yesterday, 3:15 PM",
      status: "Completed",
      icon: ShoppingBag,
    },
    {
      id: "t3",
      merchant: "Uber Ride",
      category: "Transportation",
      amount: 320,
      date: "Jul 11, 2026",
      status: "Completed",
      icon: Car,
    },
    {
      id: "t4",
      merchant: "HDFC Bank Interest",
      category: "Income",
      amount: 1250,
      date: "Jul 10, 2026",
      status: "Completed",
      icon: Landmark,
    },
  ];

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden h-full">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-semibold text-[#18181B]">Recent Transactions</h3>
          <button className="flex items-center gap-1.5 text-[12px] font-semibold text-[#D46A96] hover:text-[#d46a96]/80 transition-colors">
            <span>View All</span>
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F6B7CF]/10">
                <th className="pb-3 text-xs font-semibold text-[#6B7280]">Merchant</th>
                <th className="pb-3 text-xs font-semibold text-[#6B7280]">Category</th>
                <th className="pb-3 text-xs font-semibold text-[#6B7280]">Amount</th>
                <th className="pb-3 text-xs font-semibold text-[#6B7280] hidden md:table-cell">Date</th>
                <th className="pb-3 text-xs font-semibold text-[#6B7280]">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, idx) => {
                const Icon = t.icon;
                return (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.08 }}
                    className="group border-b border-[#F6B7CF]/5 hover:bg-[#FFF4F8]/20 transition-all duration-300 cursor-pointer"
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
                      <span className={`text-[13px] font-bold ${t.category === "Income" ? "text-emerald-600" : "text-[#18181B]"}`}>
                        {t.category === "Income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 hidden md:table-cell">
                      <span className="text-[12px] text-[#6B7280]">{t.date}</span>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === "Completed"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
