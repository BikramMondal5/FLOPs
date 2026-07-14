"use client";

import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import {
  TRANSACTION_CATEGORIES,
  PAYMENT_METHODS,
} from "@/features/transactions/types/transaction.types";
import type { AccountDTO } from "@/features/accounts/types/account.types";

interface TransactionFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  type: string;
  setType: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
  accountId: string;
  setAccountId: (val: string) => void;
  dateFrom: string;
  setDateFrom: (val: string) => void;
  dateTo: string;
  setDateTo: (val: string) => void;
  accounts: AccountDTO[];
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  onClear: () => void;
}

export default function TransactionFilters({
  search,
  setSearch,
  type,
  setType,
  category,
  setCategory,
  paymentMethod,
  setPaymentMethod,
  accountId,
  setAccountId,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  accounts,
  showFilters,
  setShowFilters,
  onClear,
}: TransactionFiltersProps) {
  const hasActiveFilters =
    type !== "all" ||
    category !== "all" ||
    paymentMethod !== "all" ||
    accountId !== "all" ||
    dateFrom !== "" ||
    dateTo !== "";

  return (
    <div className="flex flex-col gap-3">
      {/* Upper search & toggle bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 bg-white border border-[#F6B7CF]/20 rounded-2xl px-3.5 py-2.5 shadow-sm flex-1 min-w-[200px] max-w-xs">
          <input
            id="tx-search-input"
            type="text"
            placeholder="Search merchants, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[13px] text-[#18181B] bg-transparent outline-none placeholder-[#9CA3AF] w-full"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-zinc-400 hover:text-zinc-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          id="toggle-tx-filters"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-[12px] font-semibold border transition-all cursor-pointer shadow-sm ${
            showFilters
              ? "bg-[#18181B] text-white border-[#18181B]"
              : "bg-white border-[#F6B7CF]/20 text-[#374151] hover:border-[#D46A96]/30"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Advanced Filters</span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-[11px] font-semibold text-[#D46A96] bg-[#FFF4F8] border border-[#F6B7CF]/30 rounded-2xl px-3.5 py-2.5 hover:bg-[#FFF4F8] transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Expanded filters panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border border-[#F6B7CF]/15 rounded-2xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {/* Type Selection */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-[#9CA3AF] uppercase">Flow Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="text-[12px] font-medium border border-zinc-200 rounded-xl p-2 bg-white outline-none focus:border-[#D46A96]"
            >
              <option value="all">All Flows</option>
              <option value="Income">Income (+)</option>
              <option value="Expense">Expense (-)</option>
            </select>
          </div>

          {/* Account Selection */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-[#9CA3AF] uppercase">Financial Account</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="text-[12px] font-medium border border-zinc-200 rounded-xl p-2 bg-white outline-none focus:border-[#D46A96] max-w-full"
            >
              <option value="all">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selection */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-[#9CA3AF] uppercase">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-[12px] font-medium border border-zinc-200 rounded-xl p-2 bg-white outline-none focus:border-[#D46A96]"
            >
              <option value="all">All Categories</option>
              {TRANSACTION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-[#9CA3AF] uppercase">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-[12px] font-medium border border-zinc-200 rounded-xl p-2 bg-white outline-none focus:border-[#D46A96]"
            >
              <option value="all">All Methods</option>
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>

          {/* Date from & to */}
          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
            <label className="text-[10px] font-bold text-[#9CA3AF] uppercase">Date Range</label>
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="text-[11px] border border-zinc-200 rounded-lg p-1.5 bg-white w-full outline-none focus:border-[#D46A96]"
              />
              <span className="text-zinc-400 text-xs">-</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="text-[11px] border border-zinc-200 rounded-lg p-1.5 bg-white w-full outline-none focus:border-[#D46A96]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
