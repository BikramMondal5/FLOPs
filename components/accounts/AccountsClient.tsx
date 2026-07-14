"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  SlidersHorizontal,
  Landmark,
  ArchiveX,
} from "lucide-react";
import { useRouter } from "next/navigation";

import AccountCard from "@/components/accounts/AccountCard";
import AccountSummary from "@/components/accounts/AccountSummary";
import CreateAccountModal from "@/components/accounts/CreateAccountModal";
import EditAccountModal from "@/components/accounts/EditAccountModal";
import DeleteConfirmModal from "@/components/accounts/DeleteConfirmModal";
import AccountDetailDrawer from "@/components/accounts/AccountDetailDrawer";

import type { AccountDTO } from "@/features/accounts/types/account.types";
import { ACCOUNT_TYPES } from "@/features/accounts/types/account.types";

interface AccountsClientProps {
  initialAccounts: AccountDTO[];
}

type SortOption = {
  value: string;
  label: string;
};

const SORT_OPTIONS: SortOption[] = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "createdAt_asc", label: "Oldest First" },
  { value: "balance_desc", label: "Highest Balance" },
  { value: "balance_asc", label: "Lowest Balance" },
  { value: "name_asc", label: "Alphabetical" },
];

export default function AccountsClient({ initialAccounts }: AccountsClientProps) {
  const router = useRouter();

  // ── Account list state ──
  const [accounts, setAccounts] = useState<AccountDTO[]>(initialAccounts);
  const [loading, setLoading] = useState(false);

  // ── Modals / Drawer state ──
  const [createOpen, setCreateOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<AccountDTO | null>(null);
  const [archiveAccount, setArchiveAccount] = useState<AccountDTO | null>(null);
  const [detailAccount, setDetailAccount] = useState<AccountDTO | null>(null);

  // ── Filter / Sort / Search state ──
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterArchived, setFilterArchived] = useState<"false" | "true" | "all">("false");
  const [sort, setSort] = useState("createdAt_desc");
  const [showFilters, setShowFilters] = useState(false);

  // ── Refresh from server ──
  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        type: filterType,
        archived: filterArchived,
        sort,
      });
      const res = await fetch(`/api/accounts?${params.toString()}`);
      const data = await res.json();
      if (data.success) setAccounts(data.data as AccountDTO[]);
    } catch {
      // keep stale data
    } finally {
      setLoading(false);
    }
  }, [search, filterType, filterArchived, sort]);

  // ── Client-side filtering for instant UX ──
  const filtered = useMemo(() => {
    let list = [...accounts];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.institution ?? "").toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q)
      );
    }

    if (filterType !== "all") {
      list = list.filter((a) => a.type === filterType);
    }

    if (filterArchived === "false") {
      list = list.filter((a) => !a.isArchived);
    } else if (filterArchived === "true") {
      list = list.filter((a) => a.isArchived);
    }

    switch (sort) {
      case "createdAt_asc":
        list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "balance_desc":
        list.sort((a, b) => b.balance - a.balance);
        break;
      case "balance_asc":
        list.sort((a, b) => a.balance - b.balance);
        break;
      case "name_asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [accounts, search, filterType, filterArchived, sort]);

  // ── Handlers ──
  function handleCreated(newAcc: AccountDTO) {
    setAccounts((prev) => [newAcc, ...prev]);
  }

  function handleUpdated(updated: AccountDTO) {
    setAccounts((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
    if (detailAccount?._id === updated._id) setDetailAccount(updated);
  }

  function handleArchived(id: string) {
    setAccounts((prev) =>
      prev.map((a) => (a._id === id ? { ...a, isArchived: true } : a))
    );
    if (detailAccount?._id === id) setDetailAccount(null);
  }

  const activeCount = accounts.filter((a) => !a.isArchived).length;
  const hasActiveAccounts = activeCount > 0;
  const displayAccounts = filtered.filter((a) => !a.isArchived || filterArchived !== "false");

  return (
    <>
      {/* ── Search / Filter / Sort Bar ── */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-[#F6B7CF]/20 rounded-2xl px-3.5 py-2.5 shadow-sm flex-1 min-w-[180px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
            <input
              id="accounts-search"
              type="text"
              placeholder="Search accounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[13px] text-[#18181B] bg-transparent outline-none placeholder-[#9CA3AF] w-full"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5 bg-white border border-[#F6B7CF]/20 rounded-2xl px-3.5 py-2.5 shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <select
              id="accounts-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-[12px] font-semibold text-[#374151] bg-transparent border-none outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter toggle */}
          <button
            id="toggle-filters"
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-[12px] font-semibold border transition-all cursor-pointer shadow-sm ${
              showFilters
                ? "bg-[#18181B] text-white border-[#18181B]"
                : "bg-white border-[#F6B7CF]/20 text-[#374151] hover:border-[#D46A96]/30"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>

          {/* Archived toggle */}
          {filterArchived === "true" && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
              <ArchiveX className="w-3 h-3" />
              Showing archived
            </span>
          )}

          {/* Spacer + Create button */}
          <div className="flex-1" />
          <button
            id="open-create-account"
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 text-[13px] font-semibold py-2.5 px-5 bg-[#18181B] text-white hover:bg-zinc-800 rounded-2xl transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Account</span>
          </button>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-3 bg-white border border-[#F6B7CF]/15 rounded-2xl px-4 py-4 shadow-sm">
                {/* Type filter */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Account Type
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <FilterChip
                      label="All"
                      active={filterType === "all"}
                      onClick={() => setFilterType("all")}
                    />
                    {ACCOUNT_TYPES.map((t) => (
                      <FilterChip
                        key={t}
                        label={t}
                        active={filterType === t}
                        onClick={() => setFilterType(filterType === t ? "all" : t)}
                      />
                    ))}
                  </div>
                </div>

                {/* Archived filter */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Status
                  </label>
                  <div className="flex gap-1.5">
                    <FilterChip
                      label="Active"
                      active={filterArchived === "false"}
                      onClick={() => setFilterArchived("false")}
                    />
                    <FilterChip
                      label="Archived"
                      active={filterArchived === "true"}
                      onClick={() => setFilterArchived("true")}
                    />
                    <FilterChip
                      label="All"
                      active={filterArchived === "all"}
                      onClick={() => setFilterArchived("all")}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Summary strip (only when accounts exist) ── */}
      {hasActiveAccounts && (
        <AccountSummary accounts={accounts.filter((a) => !a.isArchived)} />
      )}

      {/* ── Account grid / Empty state ── */}
      {displayAccounts.length === 0 && !loading ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 px-6 bg-white border border-[#F6B7CF]/15 rounded-[32px] shadow-sm text-center max-w-[560px] mx-auto"
        >
          <div className="w-16 h-16 bg-[#FFF4F8] rounded-2xl flex items-center justify-center text-[#D46A96] border border-[#F6B7CF]/20 mb-6">
            <Landmark className="w-8 h-8" />
          </div>
          {search || filterType !== "all" ? (
            <>
              <h2 className="text-xl font-bold text-[#18181B] m-0">No accounts match your search</h2>
              <p className="text-[13px] text-[#6B7280] mt-2 mb-6 max-w-[320px] leading-relaxed">
                Try adjusting your search terms or filters to find what you&apos;re looking for.
              </p>
              <button
                onClick={() => { setSearch(""); setFilterType("all"); }}
                className="text-[13px] font-semibold py-2.5 px-6 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[#18181B] m-0">Create Your First Financial Account</h2>
              <p className="text-[13px] text-[#6B7280] mt-2 mb-6 max-w-[340px] leading-relaxed">
                Add your bank accounts, wallets, credit cards, or investments. All your future transactions and budgets will be linked here.
              </p>
              <button
                id="empty-state-create"
                onClick={() => setCreateOpen(true)}
                className="text-[13px] font-semibold py-2.5 px-6 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
              >
                Add First Account
              </button>
            </>
          )}
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {displayAccounts.map((account, index) => (
              <AccountCard
                key={account._id}
                account={account}
                index={index}
                onEdit={(a) => setEditAccount(a)}
                onArchive={(a) => setArchiveAccount(a)}
                onViewDetail={(a) => setDetailAccount(a)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Modals & Drawer ── */}
      <CreateAccountModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />

      <EditAccountModal
        account={editAccount}
        onClose={() => setEditAccount(null)}
        onUpdated={handleUpdated}
      />

      <DeleteConfirmModal
        account={archiveAccount}
        onClose={() => setArchiveAccount(null)}
        onArchived={handleArchived}
      />

      <AccountDetailDrawer
        account={detailAccount}
        onClose={() => setDetailAccount(null)}
        onEdit={(a) => { setDetailAccount(null); setTimeout(() => setEditAccount(a), 150); }}
        onArchive={(a) => { setDetailAccount(null); setTimeout(() => setArchiveAccount(a), 150); }}
      />
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
        active
          ? "bg-[#18181B] text-white border-[#18181B]"
          : "bg-white text-[#6B7280] border-[#E4E4E7] hover:border-[#D46A96] hover:text-[#D46A96]"
      }`}
    >
      {label}
    </button>
  );
}
