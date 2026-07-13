"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import CountUp from "./CountUp";

interface MetricCardProps {
  title: string;
  value: number;
  trend: string;
  isPositive: boolean;
  icon: LucideIcon;
  sparklineData: number[];
  prefix?: string;
  suffix?: string;
}

export default function MetricCard({
  title,
  value,
  trend,
  isPositive,
  icon: Icon,
  sparklineData,
  prefix = "",
  suffix = "",
}: MetricCardProps) {
  
  // Calculate SVG path for the sparkline chart
  const width = 120;
  const height = 36;
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  
  const points = sparklineData.map((val, index) => {
    const x = (index / (sparklineData.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3; // padding 3px top/bottom
    return `${x},${y}`;
  }).join(" ");

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[160px] relative overflow-hidden group hover:border-[#F6B7CF]/30 transition-all duration-300"
    >
      <div className="flex justify-between items-start z-10">
        <div>
          <span className="text-[13px] font-medium text-[#6B7280] tracking-tight">{title}</span>
          <div className="text-2xl font-bold text-[#18181B] mt-1.5 leading-none">
            <CountUp end={value} prefix={prefix} suffix={suffix} decimals={decimalsForTitle(title)} />
          </div>
        </div>
        <div className="w-[38px] h-[38px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-[#D46A96] group-hover:scale-105 transition-transform duration-300">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-end justify-between mt-4 z-10">
        {/* Trend Indicator */}
        <span
          className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${
            isPositive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600"
          }`}
        >
          {trend}
        </span>

        {/* Mini Sparkline SVG */}
        <div className="w-[120px] h-[36px]">
          <svg className="overflow-visible" width={width} height={height}>
            {/* Area gradient */}
            <defs>
              <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.15" />
                <stop offset="100%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Sparkline Area path */}
            <path
              d={`M 0,${height} L ${points} L ${width},${height} Z`}
              fill={`url(#grad-${title})`}
            />
            {/* Sparkline Line path */}
            <polyline
              fill="none"
              stroke={isPositive ? "#10B981" : "#EF4444"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

function decimalsForTitle(title: string) {
  if (title.includes("Growth")) return 1;
  return 0;
}
