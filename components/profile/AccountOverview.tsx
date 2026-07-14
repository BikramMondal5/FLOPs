"use client";

import { motion } from "framer-motion";
import { Building2, Target, Brain, Calendar } from "lucide-react";
import CountUp from "../dashboard/CountUp";

export default function AccountOverview() {
  const cards = [
    {
      title: "Connected Accounts",
      value: 6,
      trend: "ICICI, Groww, HDFC",
      icon: Building2,
      prefix: "",
      suffix: "",
    },
    {
      title: "Financial Goals",
      value: 8,
      trend: "5 active, 3 completed",
      icon: Target,
      prefix: "",
      suffix: "",
    },
    {
      title: "AI Conversations",
      value: 142,
      trend: "Assistant sweeps",
      icon: Brain,
      prefix: "",
      suffix: "",
    },
    {
      title: "Member Since",
      value: 2026,
      trend: "Registered Jan 05",
      icon: Calendar,
      prefix: "",
      suffix: "",
      isYear: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[130px] relative overflow-hidden group hover:border-[#F6B7CF]/30 transition-all duration-300"
          >
            <div className="flex justify-between items-start z-10">
              <div>
                <span className="text-[12.5px] font-medium text-[#6B7280] tracking-tight">{card.title}</span>
                <div className="text-xl font-bold text-[#18181B] mt-1.5 leading-none">
                  {card.isYear ? (
                    <span>Jan {card.value}</span>
                  ) : (
                    <CountUp end={card.value} prefix={card.prefix} suffix={card.suffix} />
                  )}
                </div>
              </div>
              <div className="w-[36px] h-[36px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-[#D46A96] group-hover:scale-105 transition-transform duration-300">
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="flex items-end justify-between mt-2.5 z-10 leading-none">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-emerald-600 bg-emerald-50">
                {card.trend}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
