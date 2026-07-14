"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Landmark,
  Wallet,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Building2,
  Banknote,
  Coins,
  Pencil,
  Archive,
  Calendar,
  Info,
} from "lucide-react";
import type { AccountDTO } from "@/features/accounts/types/account.types";
import { CURRENCIES } from "@/features/accounts/types/account.types";

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  landmark: Landmark,
  wallet: Wallet,
  "credit-card": CreditCard,
  "piggy-bank": PiggyBank,
  "trending-up": TrendingUp,
  "building-2": Building2,
  banknote: Banknote,
  coins: Coins,
};

const typeBadgeStyles: Record<string, string> = {
  Savings: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Current: "bg-blue-50 text-blue-700 border-blue-100",
  Cash: "bg-amber-50 text-amber-700 border-amber-100",
  Wallet: "bg-purple-50 text-purple-700 border-purple-100",
  "Credit Card": "bg-rose-50 text-rose-700 border-rose-100",
  Investment: "bg-cyan-50 text-cyan-700 border-cyan-100",
  Business: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Other: "bg-zinc-50 text-zinc-700 border-zinc-100",
};

interface AccountDetailDrawerProps {
  account: AccountDTO | null;
  onClose: () => void;
  onEdit: (account: AccountDTO) => void;
  onArchive: (account: AccountDTO) => void;
}

function getCurrencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AccountDetailDrawer({
  account,
  onClose,
  onEdit,
  onArchive,
}: AccountDetailDrawerProps) {
  const open = !!account;
  const IconComponent = account ? (iconMap[account.icon ?? "landmark"] ?? Landmark) : Landmark;
  const accentColor = account?.color ?? "#F6B7CF";
  const currencySymbol = account ? getCurrencySymbol(account.currency) : "₹";
  const badgeStyle = account ? (typeBadgeStyles[account.type] ?? "bg-zinc-50 text-zinc-700 border-zinc-100") : "";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[400px] bg-white shadow-[−32px_0_80px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden"
          >
            {/* Top colour accent */}
            <div className="h-1 w-full shrink-0" style={{ backgroundColor: accentColor }} />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#F6B7CF]/15">
              <h2
                className="text-[17px] font-semibold text-[#18181B] m-0"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Account Details
              </h2>
              <button
                id="close-detail-drawer"
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {account && (
                <div className="px-6 py-6 flex flex-col gap-6">
                  {/* Account hero block */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${accentColor}20`,
                        borderColor: `${accentColor}40`,
                      }}
                    >
                      <IconComponent className="w-7 h-7" style={{ color: accentColor }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[18px] font-bold text-[#18181B] m-0 truncate">
                        {account.name}
                      </h3>
                      <p className="text-[12px] text-[#9CA3AF] m-0 mt-0.5 truncate">
                        {account.institution ?? "No institution"}
                      </p>
                    </div>
                  </div>

                  {/* Balance card */}
                  <div
                    className="rounded-2xl p-5 text-center"
                    style={{ backgroundColor: `${accentColor}12`, border: `1px solid ${accentColor}30` }}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
                      Current Balance
                    </span>
                    <div className="text-3xl font-bold text-[#18181B] mt-2 tracking-tight">
                      {currencySymbol}
                      {account.balance.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-[11px] text-[#9CA3AF] mt-1">{account.currency}</div>
                  </div>

                  {/* Detail rows */}
                  <div className="flex flex-col gap-0 rounded-2xl border border-[#F4F4F5] overflow-hidden">
                    <DetailRow label="Account Type">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
                        {account.type}
                      </span>
                    </DetailRow>
                    <DetailRow label="Currency">{account.currency}</DetailRow>
                    {account.institution && (
                      <DetailRow label="Institution">{account.institution}</DetailRow>
                    )}
                    <DetailRow label="Status">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        account.isArchived
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-emerald-50 text-emerald-700 border-emerald-100"
                      }`}>
                        {account.isArchived ? "Archived" : "Active"}
                      </span>
                    </DetailRow>
                    <DetailRow label="Created">
                      <span className="flex items-center gap-1.5 text-[#6B7280]">
                        <Calendar className="w-3 h-3" />
                        {formatDate(account.createdAt)}
                      </span>
                    </DetailRow>
                    <DetailRow label="Last Updated">
                      <span className="flex items-center gap-1.5 text-[#6B7280]">
                        <Calendar className="w-3 h-3" />
                        {formatDate(account.updatedAt)}
                      </span>
                    </DetailRow>
                  </div>

                  {/* Description */}
                  {account.description && (
                    <div className="flex gap-3 p-4 bg-[#FAFAFA] rounded-2xl border border-[#F4F4F5]">
                      <Info className="w-4 h-4 text-[#9CA3AF] mt-0.5 shrink-0" />
                      <p className="text-[12px] text-[#6B7280] leading-relaxed m-0">
                        {account.description}
                      </p>
                    </div>
                  )}

                  {/* Note about Phase 4 */}
                  <div className="p-4 bg-[#FFF4F8] rounded-2xl border border-[#F6B7CF]/20">
                    <p className="text-[11px] text-[#D46A96] leading-relaxed m-0">
                      <span className="font-semibold">Transaction history</span> for this account will be available after Phase 4 (Transactions) is implemented.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky footer actions */}
            <div className="px-6 py-5 border-t border-[#F6B7CF]/15 bg-white flex gap-3 shrink-0">
              <button
                id="drawer-edit-account"
                onClick={() => {
                  onClose();
                  setTimeout(() => account && onEdit(account), 150);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#E4E4E7] text-[13px] font-semibold text-[#18181B] hover:bg-[#F4F4F5] transition-all cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                id="drawer-archive-account"
                onClick={() => {
                  onClose();
                  setTimeout(() => account && onArchive(account), 150);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-amber-200 bg-amber-50 text-amber-700 text-[13px] font-semibold hover:bg-amber-100 transition-all cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5" />
                Archive
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F4F4F5] last:border-b-0">
      <span className="text-[12px] font-medium text-[#9CA3AF]">{label}</span>
      <span className="text-[12px] font-semibold text-[#18181B]">{children}</span>
    </div>
  );
}
