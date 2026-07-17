"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-semibold rounded-full transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-[#18181B] text-white hover:bg-zinc-800 shadow-sm hover:shadow-md",
    secondary:
      "bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] hover:border-[#F6B7CF]/50",
    danger: "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100",
    outline:
      "bg-transparent border border-[#F6B7CF]/30 text-[#18181B] hover:bg-[#FFF4F8] hover:border-[#F6B7CF]/50",
    ghost: "bg-transparent text-[#6B7280] hover:text-[#18181B] hover:bg-[#FFF4F8]/50",
  };

  const sizes = {
    sm: "py-2 px-3 text-xs",
    md: "py-2.5 px-6 text-[13px]",
    lg: "py-3 px-8 text-sm",
  };

  const disabledStyles = disabled || loading ? "opacity-40 cursor-not-allowed" : "";
  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

// Icon button variant for circular icon-only buttons
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string; // For accessibility
  variant?: "default" | "primary" | "danger";
  size?: "sm" | "md" | "lg";
}

export function IconButton({
  icon,
  label,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: IconButtonProps) {
  const baseStyles =
    "rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0";

  const variants = {
    default:
      "bg-white border border-[#F6B7CF]/15 text-[#18181B] hover:bg-[#FFF4F8] hover:border-[#F6B7CF]/30 shadow-sm",
    primary: "bg-[#D46A96] text-white hover:bg-[#d46a96]/90 shadow-sm",
    danger: "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100",
  };

  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </button>
  );
}
