"use client";

import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  variant?: "card" | "list" | "grid" | "stats";
  count?: number;
}

export default function LoadingSkeleton({ variant = "card", count = 3 }: LoadingSkeletonProps) {
  if (variant === "stats") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[24px] border border-[#F6B7CF]/15 h-[120px]" />
        ))}
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-[24px] border border-[#F6B7CF]/15 h-[200px]" />
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-[24px] border border-[#F6B7CF]/15 h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="bg-white rounded-[24px] border border-[#F6B7CF]/15 h-[200px]" />
      <div className="bg-white rounded-[24px] border border-[#F6B7CF]/15 h-[300px]" />
    </div>
  );
}

// Specialized loading states
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[24px] border border-[#F6B7CF]/15 h-[120px]" />
        ))}
      </div>
      {/* Chart */}
      <div className="bg-white rounded-[24px] border border-[#F6B7CF]/15 h-[400px]" />
      {/* Recent items */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[24px] border border-[#F6B7CF]/15 h-20" />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-[24px] border border-[#F6B7CF]/15 p-6 animate-pulse">
      <div className="h-8 bg-[#FFF4F8] rounded-lg mb-4 w-1/3" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-16 bg-[#FFF4F8] rounded-lg" />
        ))}
      </div>
    </div>
  );
}
