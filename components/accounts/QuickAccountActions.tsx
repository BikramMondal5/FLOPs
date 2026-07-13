"use client";

import { motion } from "framer-motion";
import { PlusCircle, FileUp, RefreshCw, BarChart2 } from "lucide-react";

interface QuickAccountActionsProps {
  onConnect: () => void;
  onUpload: () => void;
  onRefresh: () => void;
  onViewAnalytics: () => void;
}

export default function QuickAccountActions({
  onConnect,
  onUpload,
  onRefresh,
  onViewAnalytics,
}: QuickAccountActionsProps) {
  const actions = [
    { name: "Connect Bank", icon: PlusCircle, color: "#FFF4F8", onClick: onConnect },
    { name: "Upload Statement", icon: FileUp, color: "#F9DCE7", onClick: onUpload },
    { name: "Refresh Accounts", icon: RefreshCw, color: "#FFF4F8", onClick: onRefresh },
    { name: "View Analytics", icon: BarChart2, color: "#F9DCE7", onClick: onViewAnalytics },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((act) => (
        <motion.button
          key={act.name}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.2 }}
          onClick={act.onClick}
          className="flex flex-col items-center justify-center p-4 bg-white/70 backdrop-blur-md border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:border-[#F6B7CF]/30 transition-all duration-300 group cursor-pointer h-[110px]"
        >
          <div
            className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-[#D46A96] group-hover:scale-110 transition-transform duration-300 mb-2.5"
            style={{ backgroundColor: act.color }}
          >
            <act.icon className="w-4.5 h-4.5" />
          </div>
          <span className="text-[12px] font-semibold text-[#18181B] tracking-tight">{act.name}</span>
        </motion.button>
      ))}
    </div>
  );
}
