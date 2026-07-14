"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import CountUp from "../dashboard/CountUp";

interface MetricCardProps {
  title: string;
  value: number;
  trend: string;
  isPositive: boolean;
  icon: React.ComponentType<{ className?: string }>;
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
  const width = 100;
  const height = 24;

  const points = sparklineData
    .map((val, index) => {
      const min = Math.min(...sparklineData);
      const max = Math.max(...sparklineData);
      const range = max - min || 1;
      const x = (index / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="p-5 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px] relative overflow-hidden group hover:border-[#F6B7CF]/30 transition-all duration-300"
    >
      <div className="flex justify-between items-start z-10">
        <div>
          <span className="text-[12.5px] font-medium text-[#6B7280] tracking-tight">{title}</span>
          <div className="text-xl font-bold text-[#18181B] mt-1.5 leading-none">
            <CountUp end={value} prefix={prefix} suffix={suffix} />
          </div>
        </div>
        <div className="w-[36px] h-[36px] bg-[#FFF4F8] rounded-xl flex items-center justify-center text-[#D46A96] group-hover:scale-105 transition-transform duration-300">
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>

      <div className="flex items-end justify-between mt-3 z-10">
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
            isPositive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
          }`}
        >
          {isPositive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
          {trend}
        </span>

        <div className="w-[100px] h-[24px]">
          <svg className="overflow-visible" width={width} height={height}>
            <defs>
              <linearGradient id={`grad-metric-${title.replace(/\s+/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D46A96" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#D46A96" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d={`M 0,${height} L ${points} L ${width},${height} Z`}
              fill={`url(#grad-metric-${title.replace(/\s+/g, "")})`}
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
}
