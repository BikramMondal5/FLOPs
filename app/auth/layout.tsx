"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Brain, Landmark, Target, ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: -9999, y: -9999, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setMouse({ x: -9999, y: -9999, active: false });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen relative overflow-hidden flex"
      style={{
        backgroundColor: "#FCFCFD",
        backgroundImage: `
          linear-gradient(to right, rgba(246, 183, 207, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(246, 183, 207, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
        // @ts-ignore
        "--cx": `${mouse.x}px`,
        // @ts-ignore
        "--cy": `${mouse.y}px`,
      }}
    >
      {/* Masked Cursor Glow */}
      {mouse.active && (
        <div
          className="absolute inset-0 pointer-events-none z-[1] transition-opacity duration-300"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(246, 183, 207, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(246, 183, 207, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
            WebkitMaskImage: "radial-gradient(circle 240px at var(--cx) var(--cy), #000 0%, #000 40%, transparent 100%)",
            maskImage: "radial-gradient(circle 240px at var(--cx) var(--cy), #000 0%, #000 40%, transparent 100%)",
          }}
        />
      )}

      {/* Background radial soft pink glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none z-0 bg-radial from-[#F6B7CF]/10 to-transparent filter blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full pointer-events-none z-0 bg-radial from-[#F9DCE7]/15 to-transparent filter blur-[140px]" />

      {/* Main Split Layout Grid */}
      <div className="flex-1 flex w-full relative z-10">
        
        {/* LEFT PANEL: Branding (Hidden on Mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden md:flex md:w-[45%] lg:w-[40%] bg-white/40 border-r border-[#F6B7CF]/10 flex-col justify-center items-center text-center p-8 lg:p-12 shrink-0 relative overflow-hidden"
        >
          {/* Subtle design helper */}
          <div className="absolute top-[-50px] left-[-50px] w-48 h-48 rounded-full bg-[#F6B7CF]/10 blur-3xl pointer-events-none" />

          {/* Logo & Headline */}
          <div className="flex flex-col items-center text-center gap-4 relative z-10">
            <Link href="/" className="flex items-center justify-center gap-2 no-underline mb-4">
              <Image
                src="/logo.png"
                alt="FLOPs logo"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-contain"
                priority
              />
              <span className="font-semibold text-lg text-[#18181B] tracking-tight">FLOPs</span>
            </Link>

            <span className="text-[10px] font-bold text-[#D46A96] uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI-Powered Personal Finance</span>
            </span>

            <h1
              className="text-4xl lg:text-5xl font-normal text-[#18181B] m-0 tracking-tight leading-[1.1]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Take Control of Your{" "}
              <span className="text-[#E88AB3] font-medium block mt-1">Financial Future</span>
            </h1>

            <p className="text-xs text-[#6B7280] leading-relaxed max-w-[340px] m-0">
              Manage your spending, plan smarter budgets, achieve financial goals, and receive AI-powered financial guidance—all from one beautiful workspace.
            </p>
          </div>

        </motion.div>

        {/* RIGHT PANEL: Dynamic Authentication Form Container */}
        <div className="flex-grow flex items-center justify-center p-6 md:p-8 lg:p-12 relative overflow-y-auto">
          <div className="w-full max-w-[460px] relative z-10 flex flex-col gap-6">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}
