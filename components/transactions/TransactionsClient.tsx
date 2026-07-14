"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Receipt, Loader2, Sparkles } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import Sidebar from "@/components/dashboard/Sidebar";
import TransactionSummary from "@/components/transactions/TransactionSummary";
import TransactionCard from "@/components/transactions/TransactionCard";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionPagination from "@/components/transactions/TransactionPagination";
import CreateTransactionModal from "@/components/transactions/CreateTransactionModal";
import EditTransactionModal from "@/components/transactions/EditTransactionModal";
import ArchiveTransactionModal from "@/components/transactions/ArchiveTransactionModal";
import TransactionDetailDrawer from "@/components/transactions/TransactionDetailDrawer";

import type { AccountDTO } from "@/features/accounts/types/account.types";
import type { TransactionDTO, PaginatedTransactions } from "@/features/transactions/types/transaction.types";
import { CATEGORY_METADATA } from "@/features/transactions/types/transaction.types";

interface TransactionsClientProps {
  initialData: PaginatedTransactions;
  accounts: AccountDTO[];
}

export default function TransactionsClient({ initialData, accounts }: TransactionsClientProps) {
  const [transactions, setTransactions] = useState<TransactionDTO[]>(initialData.transactions);
  const [pagination, setPagination] = useState(initialData.pagination);
  const [loading, setLoading] = useState(false);

  // Filter conditions
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [accountId, setAccountId] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Modals state
  const [createOpen, setCreateOpen] = useState(false);
  const [editTx, setEditTx] = useState<TransactionDTO | null>(null);
  const [archiveTx, setArchiveTx] = useState<TransactionDTO | null>(null);
  const [detailTx, setDetailTx] = useState<TransactionDTO | null>(null);

  // Chart state
  const [chartFilter, setChartFilter] = useState<"Weekly" | "Monthly" | "Yearly">("Monthly");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch from API on query params change
  const fetchTransactions = useCallback(
    async (pageNumber = 1) => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(pageNumber),
          limit: "20",
          search,
          type,
          category,
          paymentMethod,
          accountId,
          dateFrom,
          dateTo,
        });

        const res = await fetch(`/api/transactions?${query.toString()}`);
        const result = await res.json();
        if (result.success) {
          setTransactions(result.data.transactions);
          setPagination(result.data.pagination);
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    },
    [search, type, category, paymentMethod, accountId, dateFrom, dateTo]
  );

  // Trigger search / filters updates
  useEffect(() => {
    fetchTransactions(1);
  }, [search, type, category, paymentMethod, accountId, dateFrom, dateTo]);

  // Mutations callbacks
  function handleCreated(newTx: TransactionDTO) {
    setTransactions((prev) => [newTx, ...prev.slice(0, 19)]);
    setPagination((prev) => ({ ...prev, totalCount: prev.totalCount + 1 }));
    fetchTransactions(1);
  }

  function handleUpdated(updated: TransactionDTO) {
    setTransactions((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    if (detailTx?._id === updated._id) setDetailTx(updated);
    fetchTransactions(pagination.page);
  }

  function handleArchived(id: string) {
    setTransactions((prev) => prev.filter((t) => t._id !== id));
    setPagination((prev) => ({ ...prev, totalCount: prev.totalCount - 1 }));
    if (detailTx?._id === id) setDetailTx(null);
    fetchTransactions(pagination.page);
  }

  function handleClearFilters() {
    setSearch("");
    setType("all");
    setCategory("all");
    setPaymentMethod("all");
    setAccountId("all");
    setDateFrom("");
    setDateTo("");
  }

  // Visual analytics stats computed from transactions
  const summaryStats = useMemo(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((tx) => {
      if (tx.type === "Income") income += tx.amount;
      else expenses += tx.amount;
    });

    const netFlow = income - expenses;
    return {
      income,
      expenses,
      netFlow,
      totalCount: pagination.totalCount,
    };
  }, [transactions, pagination.totalCount]);

  // Sparkline stats calculation defaults
  const chartsData = useMemo(() => {
    // Expense grouped categories for Doughnut Cell
    const catMap: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.type === "Expense") {
        catMap[t.category] = (catMap[t.category] ?? 0) + t.amount;
      }
    });

    const colors = ["#D46A96", "#E88AB3", "#F4B3C2", "#B19FFB", "#DFC5D0", "#9EABB3"];
    const doughnut = Object.entries(catMap).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }));

    // Area Chart: Mock Weekly, Monthly, Yearly based on visual styles but using some real transaction names
    const weekly = [
      { name: "Mon", Expense: 1200 },
      { name: "Tue", Expense: 2800 },
      { name: "Wed", Expense: 1500 },
      { name: "Thu", Expense: 4200 },
      { name: "Fri", Expense: 3800 },
      { name: "Sat", Expense: 6000 },
      { name: "Sun", Expense: 2200 },
    ];

    const monthly = transactions.slice(0, 6).map((t) => ({
      name: t.merchant.slice(0, 8),
      Expense: Math.abs(t.amount),
    }));

    const yearly = [
      { name: "Jan", Expense: 112000 },
      { name: "Feb", Expense: 98000 },
      { name: "Mar", Expense: 124000 },
      { name: "Apr", Expense: 118000 },
      { name: "May", Expense: 135000 },
      { name: "Jun", Expense: 122980 },
    ];

    return {
      doughnut: doughnut.length > 0 ? doughnut : [{ name: "No Expenses", value: 1, color: "#E4E4E7" }],
      weekly,
      monthly: monthly.length > 0 ? monthly : [{ name: "N/A", Expense: 0 }],
      yearly,
    };
  }, [transactions]);

  return (
    <>
      {/* Dynamic Summary Strip */}
      <TransactionSummary
        totalCount={summaryStats.totalCount}
        income={summaryStats.income}
        expenses={summaryStats.expenses}
        avgDaily={Math.round(summaryStats.expenses / 30 || 0)}
      />

      {/* Filters Area */}
      <TransactionFilters
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        category={category}
        setCategory={setCategory}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        accountId={accountId}
        setAccountId={setAccountId}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        accounts={accounts}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onClear={handleClearFilters}
      />

      {/* Main ledger list or Empty state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-[#D46A96] animate-spin" />
          <span className="text-xs font-semibold text-zinc-500">Loading ledger logs...</span>
        </div>
      ) : transactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 px-6 bg-white border border-[#F6B7CF]/15 rounded-[32px] shadow-sm text-center max-w-[600px] mx-auto mt-5"
        >
          <div className="w-[64px] h-[64px] bg-[#FFF4F8] rounded-2xl flex items-center justify-center text-[#D46A96] border border-[#F6B7CF]/20 mb-6">
            <Receipt className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#18181B] m-0">No Ledger Logs Found</h2>
          <p className="text-[13px] text-[#6B7280] mt-2 mb-6 max-w-[360px] leading-relaxed">
            Create a transaction log or clear your active search query filters to display records.
          </p>
          <button
            id="empty-state-create-tx"
            onClick={() => setCreateOpen(true)}
            className="text-xs font-semibold py-2.5 px-6 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
          >
            Add Transaction
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Action Row */}
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-zinc-500 uppercase">Recent Ledger records</span>
            <button
              id="top-add-tx"
              onClick={() => setCreateOpen(true)}
              className="text-xs font-semibold py-2 px-3 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
            >
              Add Log
            </button>
          </div>

          {/* Cards Grid list */}
          <div className="flex flex-col gap-3">
            {transactions.map((tx, idx) => (
              <TransactionCard
                key={tx._id}
                transaction={tx}
                index={idx}
                onViewDetails={(t) => setDetailTx(t)}
              />
            ))}
          </div>

          {/* Pagination bar */}
          <TransactionPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            limit={pagination.limit}
            onPageChange={(p) => fetchTransactions(p)}
          />
        </div>
      )}

      {/* Visual Analytics */}
      {mounted && transactions.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 mt-4">
          {/* Spend trend analysis */}
          <div className="xl:col-span-2 p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[360px] relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div>
                <h3 className="text-base font-semibold text-[#18181B] m-0">Recent Trends</h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Spend chart visualizer</p>
              </div>

              <div className="flex gap-1.5 bg-[#FFF4F8] p-1 rounded-full border border-[#F6B7CF]/10">
                {(["Weekly", "Monthly", "Yearly"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartFilter(type)}
                    className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                      chartFilter === type ? "bg-[#D46A96] text-white shadow-sm" : "text-[#6B7280] hover:text-[#18181B]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-full flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={
                    chartFilter === "Weekly"
                      ? chartsData.weekly
                      : chartFilter === "Monthly"
                      ? chartsData.monthly
                      : chartsData.yearly
                  }
                  margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="txGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D46A96" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#D46A96" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dx={-5}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: "12px",
                      borderRadius: "16px",
                      border: "1px solid rgba(246,183,207,0.2)",
                    }}
                    formatter={(val: any) => [`₹${val.toLocaleString()}`, "Amount"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="Expense"
                    stroke="#D46A96"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#txGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categories share share */}
          <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[360px] relative overflow-hidden">
            <div className="mb-4 shrink-0">
              <h3 className="text-base font-semibold text-[#18181B] m-0">Category Breakdown</h3>
              <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Category ratios</p>
            </div>

            <div className="flex flex-col items-center justify-center flex-grow gap-4">
              <div className="w-[140px] h-[140px] relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartsData.doughnut}
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={66}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartsData.doughnut.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        fontSize: "11px",
                        borderRadius: "12px",
                        border: "1px solid rgba(246,183,207,0.2)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[9px] uppercase font-bold text-[#6B7280]">Expense</span>
                  <span className="text-sm font-extrabold text-[#18181B] mt-0.5">
                    ₹{summaryStats.expenses.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-2">
                {chartsData.doughnut.slice(0, 4).map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-[11px]">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-zinc-600 truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide drawer details and edit modals triggers */}
      <CreateTransactionModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
        accounts={accounts}
      />

      <EditTransactionModal
        transaction={editTx}
        onClose={() => setEditTx(null)}
        onUpdated={handleUpdated}
        accounts={accounts}
      />

      <ArchiveTransactionModal
        transaction={archiveTx}
        onClose={() => setArchiveTx(null)}
        onArchived={handleArchived}
      />

      <TransactionDetailDrawer
        transaction={detailTx}
        onClose={() => setDetailTx(null)}
        onEdit={(t) => { setDetailTx(null); setTimeout(() => setEditTx(t), 150); }}
        onArchive={(t) => { setDetailTx(null); setTimeout(() => setArchiveTx(t), 150); }}
      />
    </>
  );
}
