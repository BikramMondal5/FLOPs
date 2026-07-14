"use client";

import { motion } from "framer-motion";
import {
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
  ChevronRight,
} from "lucide-react";
import type { AccountDTO } from "@/features/accounts/types/account.types";
import { CURRENCIES } from "@/features/accounts/types/account.types";

// ─────────────────────────────────────────────
// Icon Map
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Type badge colours
// ─────────────────────────────────────────────
const typeBadgeStyles: Record<string, string> = {
  Savings: "bg-emerald-50 text-emerald-700",
  Current: "bg-blue-50 text-blue-700",
  Cash: "bg-amber-50 text-amber-700",
  Wallet: "bg-purple-50 text-purple-700",
  "Credit Card": "bg-rose-50 text-rose-700",
  Investment: "bg-cyan-50 text-cyan-700",
  Business: "bg-indigo-50 text-indigo-700",
  Other: "bg-zinc-50 text-zinc-700",
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getCurrencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}

interface AccountCardProps {
  account: AccountDTO;
  index: number;
  onEdit: (account: AccountDTO) => void;
  onArchive: (account: AccountDTO) => void;
  onViewDetail: (account: AccountDTO) => void;
}

export default function AccountCard({
  account,
  index,
  onEdit,
  onArchive,
  onViewDetail,
}: AccountCardProps) {
  const IconComponent = iconMap[account.icon ?? "landmark"] ?? Landmark;
  const currencySymbol = getCurrencySymbol(account.currency);
  const badgeStyle = typeBadgeStyles[account.type] ?? "bg-zinc-50 text-zinc-700";
  const accentColor = account.color ?? "#F6B7CF";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07, type: "spring", stiffness: 130, damping: 16 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden hover:border-[#F6B7CF]/35 hover:shadow-[0_12px_40px_rgba(246,183,207,0.12)] transition-all duration-300 cursor-pointer"
      onClick={() => onViewDetail(account)}
    >
      {/* Colour accent bar at top */}
      <div
        className="h-1 w-full shrink-0"
        style={{ backgroundColor: accentColor }}
      />

      {/* Card body */}
      <div className="p-5 flex flex-col gap-4 flex-grow">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {/* Icon bubble */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `${accentColor}20`,
                borderColor: `${accentColor}40`,
              }}
            >
              <IconComponent
                className="w-5 h-5"
                style={{ color: accentColor }}
              />
            </div>

            {/* Name + institution */}
            <div className="min-w-0">
              <h3 className="text-[14px] font-semibold text-[#18181B] m-0 leading-tight truncate group-hover:text-[#D46A96] transition-colors">
                {account.name}
              </h3>
              {account.institution ? (
                <p className="text-[11px] text-[#6B7280] m-0 mt-0.5 truncate leading-none">
                  {account.institution}
                </p>
              ) : (
                <p className="text-[11px] text-[#9CA3AF] m-0 mt-0.5 leading-none italic">
                  No institution
                </p>
              )}
            </div>
          </div>

          {/* Type badge */}
          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badgeStyle}`}
          >
            {account.type}
          </span>
        </div>

        {/* Balance */}
        <div>
          <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
            Balance
          </span>
          <div className="text-2xl font-bold text-[#18181B] mt-1 tracking-tight">
            {currencySymbol}
            {account.balance.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="text-[10px] text-[#9CA3AF] mt-0.5">{account.currency}</div>
        </div>

        {/* Description if present */}
        {account.description && (
          <p className="text-[11px] text-[#6B7280] leading-relaxed line-clamp-2 border-t border-[#F6B7CF]/10 pt-3">
            {account.description}
          </p>
        )}
      </div>

      {/* Card footer actions */}
      <div
        className="px-5 py-3.5 bg-[#FAFAFA] border-t border-[#F6B7CF]/10 flex items-center justify-between gap-2 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id={`view-account-${account._id}`}
          onClick={() => onViewDetail(account)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-[#18181B] hover:text-[#D46A96] transition-colors cursor-pointer"
        >
          View Details
          <ChevronRight className="w-3 h-3" />
        </button>

        <div className="flex items-center gap-1.5">
          <button
            id={`edit-account-${account._id}`}
            onClick={() => onEdit(account)}
            title="Edit account"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B7280] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-all cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            id={`archive-account-${account._id}`}
            onClick={() => onArchive(account)}
            title="Archive account"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B7280] hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
          >
            <Archive className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
