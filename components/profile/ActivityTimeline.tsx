"use client";

import { motion } from "framer-motion";
import { User, Landmark, PiggyBank, FileDown, Target, Bell, CreditCard, TrendingUp, Shield } from "lucide-react";
import type { ActivityDTO } from "@/features/profile/dto/profile.dto";

interface ActivityTimelineProps {
  activities: ActivityDTO[];
}

// Map activity types to icons
const iconMap = {
  transaction: CreditCard,
  budget: PiggyBank,
  goal: Target,
  report: FileDown,
  ai_chat: TrendingUp,
  notification: Bell,
  profile: User,
  login: Shield,
};

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div className="mb-5 shrink-0">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Recent Account Activity</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Chronological list of sync actions and updates</p>
      </div>

      <div className="flex-grow flex flex-col gap-4 pl-1">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 text-sm">
            No recent activity to display
          </div>
        ) : (
          activities.map((act, idx) => {
            const Icon = iconMap[act.type] || User;
            return (
              <motion.div
                key={act._id}
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
                  <span className="text-[12.5px] font-semibold text-[#18181B] leading-snug block">{act.action}</span>
                  <span className="text-[9.5px] text-[#6B7280] mt-1 block leading-none">
                    {formatRelativeTime(act.createdAt)}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
