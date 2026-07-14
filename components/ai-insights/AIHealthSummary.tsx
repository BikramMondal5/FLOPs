"use client";

import { motion } from "framer-motion";
import { Brain, PiggyBank, Target, TrendingUp } from "lucide-react";
import CountUp from "../dashboard/CountUp";

export default function AIHealthSummary() {
  const cards = [
    {
      title: "Financial Health Score",
      value: 92,
      trend: "Excellent standing",
      icon: Brain,
      prefix: "",
      suffix: " / 100",
    },
    {
      title: "Monthly Savings Potential",
      value: 12500,
      trend: "Based on surplus sweep",
      icon: PiggyBank,
      prefix: "₹",
      suffix: "",
    },
    {
      title: "Budget Efficiency",
      value: 88,
      trend: "+4% vs last month",
      icon: Target,
      prefix: "",
      suffix: "%",
    },
    {
      title: "Predicted Month-End Balance",
      value: 128450,
      trend: "Estimated settlement",
      icon: TrendingUp,
      prefix: "₹",
      suffix: "",
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
                  <CountUp end={card.value} prefix={card.prefix} suffix={card.suffix} />
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
