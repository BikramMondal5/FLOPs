"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  padding?: "compact" | "standard" | "large" | "none";
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  padding = "standard",
  hover = false,
  className = "",
  onClick,
}: CardProps) {
  const baseStyles =
    "bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] relative overflow-hidden";
  const hoverStyles = hover
    ? "hover:border-[#F6B7CF]/30 hover:shadow-[0_8px_24px_rgba(246,183,207,0.06)] transition-all duration-300 cursor-pointer"
    : "";
  const paddingStyles = {
    compact: "p-4",
    standard: "p-6",
    large: "p-8",
    none: "",
  };

  const Component = onClick ? "button" : "div";

  return (
    <Component
      className={`${baseStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}

// Card subcomponents for consistent structure
export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-base font-semibold text-[#18181B] m-0 ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[11px] text-[#6B7280] mt-0.5 m-0 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mt-4 pt-4 border-t border-[#F6B7CF]/10 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

// Stat card variant (for dashboard metrics)
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, className = "" }: StatCardProps) {
  return (
    <Card padding="standard" className={className}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide m-0">{title}</p>
        </div>
        {icon && <div className="text-[#D46A96]">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <h2 className="text-3xl font-bold text-[#18181B] m-0">{value}</h2>
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-[#6B7280] mt-1 m-0">{subtitle}</p>}
    </Card>
  );
}
