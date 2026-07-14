"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PiggyBank,
  Target,
  BarChart3,
  Brain,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/overview" },
    { name: "Accounts", icon: Wallet, href: "/accounts" },
    { name: "Transactions", icon: Receipt, href: "/transactions" },
    { name: "Budget", icon: PiggyBank, href: "/budget" },
    { name: "Goals", icon: Target, href: "/goals" },
    { name: "Analytics", icon: BarChart3, href: "/overview" },
    { name: "AI Insights", icon: Brain, href: "/ai-insights" },
    { name: "Profile", icon: Settings, href: "/profile" },
  ];

  return (
    <aside className="w-70 h-full bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between p-6 shrink-0 relative overflow-hidden">
      {/* Background glow inside sidebar */}
      <div className="absolute -top-12.5 -left-12.5 w-48 h-48 rounded-full bg-radial from-[#F6B7CF]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-8 relative z-10">
        {/* Logo and Brand Heading */}
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-xl bg-radial from-[#FFF4F8] to-[#F9DCE7]/30 flex items-center justify-center border border-[#F6B7CF]/20">
            <Sparkles className="w-4.5 h-4.5 text-[#D46A96]" />
          </div>
          <span
            className="text-xl font-bold tracking-tight text-[#18181B] leading-none"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            FLOPs
          </span>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`group flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 relative ${isActive
                  ? "text-[#D46A96]"
                  : "text-[#6B7280] hover:text-[#18181B] hover:bg-[#FFF4F8]/50"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-3 bottom-3 w-0.75 bg-[#D46A96] rounded-r-full shadow-[0_0_10px_#F6B7CF]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <item.icon className={`w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-105 ${isActive ? "text-[#D46A96]" : "text-[#6B7280] group-hover:text-[#18181B]"
                  }`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="relative z-10">
        <button
          type="button"
          onClick={() => {
            onCloseMobile?.();
            void signOut({ callbackUrl: "/auth/login" });
          }}
          className="group flex w-full items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50/50 transition-all duration-300 cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform duration-300" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
