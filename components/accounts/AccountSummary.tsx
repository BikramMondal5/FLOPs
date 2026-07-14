"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingUp, LayoutGrid } from "lucide-react";
import type { AccountDTO } from "@/features/accounts/types/account.types";
import { CURRENCIES } from "@/features/accounts/types/account.types";

interface AccountSummaryProps {
  accounts: AccountDTO[];
}

function getCurrencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}

export default function AccountSummary({ accounts }: AccountSummaryProps) {
  // Group balances by currency for multi-currency display
  const currencyTotals: Record<string, number> = {};
  for (const acc of accounts) {
    currencyTotals[acc.currency] = (currencyTotals[acc.currency] ?? 0) + acc.balance;
  }

  // Primary currency: most common among accounts (default INR)
  const primaryCurrency =
    Object.entries(currencyTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "INR";

  const primaryTotal = currencyTotals[primaryCurrency] ?? 0;
  const primarySymbol = getCurrencySymbol(primaryCurrency);
  const otherCurrencies = Object.entries(currencyTotals).filter(([code]) => code !== primaryCurrency);

  const totalAccounts = accounts.length;
  const typeBreakdown = accounts.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] ?? 0) + 1;
    return acc;
  }, {});

  const stats = [
    {
      icon: Wallet,
      label: "Total Balance",
      value: `${primarySymbol}${primaryTotal.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      sub: otherCurrencies.length > 0
        ? `+ ${otherCurrencies.map(([code, v]) => `${getCurrencySymbol(code)}${v.toLocaleString("en-IN")}`).join(" · ")}`
        : `${primaryCurrency} balance`,
      color: "#D46A96",
      bg: "#FFF4F8",
      border: "#F6B7CF",
    },
    {
      icon: LayoutGrid,
      label: "Total Accounts",
      value: String(totalAccounts),
      sub: Object.entries(typeBreakdown)
        .slice(0, 2)
        .map(([t, n]) => `${n} ${t}`)
        .join(" · ") || "No accounts",
      color: "#6366F1",
      bg: "#EEF2FF",
      border: "#C7D2FE",
    },
    {
      icon: TrendingUp,
      label: "Highest Balance",
      value: (() => {
        const top = accounts.reduce<AccountDTO | null>(
          (best, acc) => (!best || acc.balance > best.balance ? acc : best),
          null
        );
        if (!top) return "—";
        return `${getCurrencySymbol(top.currency)}${top.balance.toLocaleString("en-IN")}`;
      })(),
      sub: (() => {
        const top = accounts.reduce<AccountDTO | null>(
          (best, acc) => (!best || acc.balance > best.balance ? acc : best),
          null
        );
        return top?.name ?? "No accounts";
      })(),
      color: "#059669",
      bg: "#ECFDF5",
      border: "#A7F3D0",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, type: "spring", stiffness: 140, damping: 16 }}
          className="bg-white border border-[#F6B7CF]/15 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-3"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
            style={{ backgroundColor: stat.bg, borderColor: stat.border }}
          >
            <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
              {stat.label}
            </span>
            <div
              className="text-xl font-bold text-[#18181B] mt-1 tracking-tight truncate"
              title={stat.value}
            >
              {stat.value}
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5 truncate">{stat.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
