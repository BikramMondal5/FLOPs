"use client";

import { motion } from "framer-motion";
import { Landmark, Wallet, ArrowUpRight, Building2 } from "lucide-react";
import CountUp from "../dashboard/CountUp";

interface AccountSummaryProps {
  totalBalance: number;
  cashFlow: number;
}

export default function AccountSummary({ totalBalance, cashFlow }: AccountSummaryProps) {
  const cards = [
    {
      title: "Total Accounts",
      value: 6,
      trend: "Active Connections",
      isPositive: true,
      icon: Landmark,
      sparkline: [6, 6, 6, 6, 6, 6, 6],
      prefix: "",
      suffix: "",
    },
    {
      title: "Total Balance",
      value: totalBalance,
      trend: "+12.4% vs last mo",
      isPositive: true,
      icon: Wallet,
      sparkline: [740000, 765000, 780000, 792000, 810000, 825000, totalBalance],
      prefix: "₹",
      suffix: "",
    },
    {
      title: "Monthly Cash Flow",
      value: cashFlow,
      trend: "+8.2% vs last mo",
      isPositive: true,
      icon: ArrowUpRight,
      sparkline: [12000, 14200, 11500, 15000, 16800, 17200, cashFlow],
      prefix: "₹",
      suffix: "",
    },
    {
      title: "Connected Institutions",
      value: 4,
      trend: "HDFC, ICICI, Axis, SBI",
      isPositive: true,
      icon: Building2,
      sparkline: [3, 4, 4, 4, 4, 4, 4],
      prefix: "",
      suffix: " Banks",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        
        // Calculate SVG path for the sparkline chart
        const width = 100;
        const height = 24;
        const min = Math.min(...card.sparkline);
        const max = Math.max(...card.sparkline);
        const range = max - min || 1;
        
        const points = card.sparkline.map((val, index) => {
          const x = (index / (card.sparkline.length - 1)) * width;
          const y = height - ((val - min) / range) * (height - 4) - 2;
          return `${x},${y}`;
        }).join(" ");

        return (
          <motion.div
            key={card.title}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px] relative overflow-hidden group hover:border-[#F6B7CF]/30 transition-all duration-300"
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

            <div className="flex items-end justify-between mt-3 z-10">
              <span className="text-[11px] font-semibold text-[#6B7280]">{card.trend}</span>
              
              {/* Mini Sparkline SVG */}
              <div className="w-[100px] h-[24px]">
                <svg className="overflow-visible" width={width} height={height}>
                  <defs>
                    <linearGradient id={`grad-${card.title.replace(/\s+/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D46A96" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#D46A96" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M 0,${height} L ${points} L ${width},${height} Z`}
                    fill={`url(#grad-${card.title.replace(/\s+/g, "")})`}
                  />
                  <polyline
                    fill="none"
                    stroke="#D46A96"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
