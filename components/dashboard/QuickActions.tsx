"use client";

import { motion } from "framer-motion";
import { Plus, PieChart, Target, FileText } from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  onAddTransaction?: () => void;
}

export default function QuickActions({ onAddTransaction }: QuickActionsProps) {
  const actions = [
    {
      name: "Add Transaction",
      icon: Plus,
      color: "#F9DCE7",
      href: undefined,
      onClick: onAddTransaction,
    },
    {
      name: "Create Budget",
      icon: PieChart,
      color: "#FFF4F8",
      href: "/budget",
      onClick: undefined,
    },
    {
      name: "New Goal",
      icon: Target,
      color: "#F9DCE7",
      href: "/goals",
      onClick: undefined,
    },
    {
      name: "Generate Report",
      icon: FileText,
      color: "#FFF4F8",
      href: "/reports",
      onClick: undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {actions.map((act) => {
        const inner = (
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center p-5 bg-white/70 backdrop-blur-md border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:border-[#F6B7CF]/30 transition-all duration-300 group cursor-pointer h-[120px]"
          >
            <div
              className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-[#D46A96] group-hover:scale-110 transition-transform duration-300 mb-3"
              style={{ backgroundColor: act.color }}
            >
              <act.icon className="w-5 h-5" />
            </div>
            <span className="text-[12px] font-semibold text-[#18181B] tracking-tight">{act.name}</span>
          </motion.div>
        );

        if (act.onClick) {
          return (
            <button
              key={act.name}
              type="button"
              onClick={act.onClick}
              className="block text-left"
            >
              {inner}
            </button>
          );
        }

        if (act.href) {
          return (
            <Link key={act.name} href={act.href} className="block no-underline">
              {inner}
            </Link>
          );
        }

        return <div key={act.name}>{inner}</div>;
      })}
    </div>
  );
}
