"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    id?: string;
  };
  secondary?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondary,
  children,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 bg-white border border-[#F6B7CF]/15 rounded-[32px] shadow-sm text-center max-w-[560px] mx-auto"
    >
      <div className="w-16 h-16 bg-[#FFF4F8] rounded-2xl flex items-center justify-center text-[#D46A96] border border-[#F6B7CF]/20 mb-6">
        <Icon className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-[#18181B] m-0">{title}</h2>
      <p className="text-[13px] text-[#6B7280] mt-2 mb-6 max-w-[360px] leading-relaxed">
        {description}
      </p>
      {children}
      {action && (
        <button
          id={action.id}
          onClick={action.onClick}
          className="text-[13px] font-semibold py-2.5 px-6 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer mb-2"
        >
          {action.label}
        </button>
      )}
      {secondary && (
        <button
          onClick={secondary.onClick}
          className="text-[13px] font-semibold py-2.5 px-6 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full transition-colors cursor-pointer"
        >
          {secondary.label}
        </button>
      )}
    </motion.div>
  );
}
