"use client";

import { motion } from "framer-motion";
import { User, Landmark, PiggyBank, FileDown, Target } from "lucide-react";

interface Activity {
  id: string;
  icon: any;
  desc: string;
  timestamp: string;
}

export default function ActivityTimeline() {
  const activities: Activity[] = [
    { id: "act1", icon: User, desc: "Updated phone number settings in profile panel", timestamp: "1 hour ago" },
    { id: "act2", icon: Landmark, desc: "Connected new SBI Savings feed source", timestamp: "Yesterday" },
    { id: "act3", icon: PiggyBank, desc: "Deposited ₹5,000 to New MacBook Pro goal", timestamp: "2 days ago" },
    { id: "act4", icon: FileDown, desc: "Generated Monthly Financial Report PDF summary", timestamp: "Jul 12, 2026" },
    { id: "act5", icon: Target, desc: "Completed 100% Emergency Reserve fund target", timestamp: "Jul 05, 2026" },
  ];

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div className="mb-5 shrink-0">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Recent Account Activity</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Chronological list of sync actions and updates</p>
      </div>

      <div className="flex-grow flex flex-col gap-4 pl-1">
        {activities.map((act, idx) => {
          const Icon = act.icon;
          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="flex gap-3.5 items-start relative group"
            >
              {/* Connector line */}
              {idx !== activities.length - 1 && (
                <div className="absolute left-[17px] top-[34px] bottom-[-20px] w-0.5 bg-[#F6B7CF]/10" />
              )}

              <div className="w-[34px] h-[34px] bg-[#FFF4F8] rounded-full border border-[#F6B7CF]/20 flex items-center justify-center text-[#D46A96] shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-grow">
                <span className="text-[12.5px] font-semibold text-[#18181B] leading-snug block">{act.desc}</span>
                <span className="text-[9.5px] text-[#6B7280] mt-1 block leading-none">{act.timestamp}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
