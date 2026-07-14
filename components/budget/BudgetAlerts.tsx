"use client";

import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

interface Alert {
  text: string;
  type: "warning" | "danger" | "success";
}

export default function BudgetAlerts() {
  const alerts: Alert[] = [
    { text: "Dining expenses are close to your monthly limit.", type: "warning" },
    { text: "Shopping exceeded the planned budget by ₹2,400.", type: "danger" },
    { text: "Transportation spending is 15% below budget.", type: "success" },
  ];

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden h-full">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Budget Alerts</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Dynamic AI alert logs matching thresholds</p>
      </div>

      <div className="flex flex-col gap-3">
        {alerts.map((al, idx) => {
          const Icon = al.type === "success" ? CheckCircle2 : al.type === "danger" ? AlertCircle : AlertTriangle;
          const bg = al.type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                    al.type === "danger" ? "bg-rose-50 text-rose-600 border-rose-100" :
                    "bg-amber-50 text-amber-600 border-amber-100";
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className={`p-3.5 border rounded-[20px] flex gap-3 items-center ${bg}`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span className="text-[12px] font-semibold leading-normal">{al.text}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
