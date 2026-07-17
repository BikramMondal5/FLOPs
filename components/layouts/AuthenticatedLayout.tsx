"use client";

import { useState, useRef, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  userName?: string;
  userEmail?: string;
  userImage?: string;
  greeting?: string;
  title: string;
  description?: string;
  rightPanel?: ReactNode;
  headerActions?: ReactNode;
}

export default function AuthenticatedLayout({
  children,
  userName = "User",
  userEmail = "",
  userImage,
  greeting,
  title,
  description,
  rightPanel,
  headerActions,
}: AuthenticatedLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{
        backgroundColor: "#FCFCFD",
        backgroundImage: `
          linear-gradient(to right, rgba(246, 183, 207, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(246, 183, 207, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
        // @ts-ignore
        "--cx": `${mouse.x}px`,
        "--cy": `${mouse.y}px`,
      }}
    >
      {/* Masked Cursor Glow */}
      {mouse.active && (
        <div
          className="absolute inset-0 pointer-events-none z-[1] transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 200px at var(--cx) var(--cy), rgba(246, 183, 207, 0.08), transparent 80%)`,
          }}
        />
      )}

      {/* Background radial glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none z-0 bg-radial from-[#F6B7CF]/10 to-transparent filter blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full pointer-events-none z-0 bg-radial from-[#F9DCE7]/15 to-transparent filter blur-[140px]" />

      {/* Fixed Top Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-30 flex w-full items-center justify-between px-6 md:px-8 border-b border-[#F6B7CF]/10 bg-[#FCFCFD]/80 backdrop-blur-md shrink-0"
        style={{ height: "72px" }}
      >
        <Link href="/" className="flex items-center gap-2 no-underline z-10 relative">
          <Image
            src="/logo.png"
            alt="FLOPs logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-contain"
            priority
          />
          <span
            className="font-medium text-[#18181B]"
            style={{ fontFamily: "var(--font-body)", fontSize: "18px", letterSpacing: "-0.01em" }}
          >
            FLOPs
          </span>
        </Link>

        {/* User info */}
        <div className="flex items-center gap-3 z-10 relative">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-semibold text-[#18181B] m-0 leading-none">
              {userName}
            </p>
            {userEmail && (
              <p className="text-[11px] text-[#9CA3AF] m-0 mt-0.5 leading-none">
                {userEmail}
              </p>
            )}
          </div>
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full border-2 border-[#F6B7CF]/30 object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#FFF4F8] border-2 border-[#F6B7CF]/30 flex items-center justify-center text-[#D46A96] text-[14px] font-bold">
              {userName?.charAt(0).toUpperCase() ?? "U"}
            </div>
          )}
        </div>
      </nav>

      {/* Main Layout Grid with top padding for fixed navbar */}
      <div className="flex-1 flex flex-col lg:flex-row p-6 md:p-8 gap-6 md:gap-8 relative z-10 pt-28">
        {/* Desktop Sidebar — fixed */}
        <div className="hidden lg:block z-20 fixed left-6 md:left-8 top-[96px] w-[280px] h-[calc(100vh-128px)]">
          <Sidebar />
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="fixed left-0 top-0 bottom-0 z-50 w-[280px] lg:hidden"
              >
                <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main workspace content with left offset for sidebar */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 md:gap-8 z-10 lg:pl-[304px]">
          {/* Content Column */}
          <div className="flex-1 flex flex-col gap-6 md:gap-8">
            {/* Page header */}
            <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden w-10 h-10 bg-white border border-[#F6B7CF]/15 rounded-xl flex items-center justify-center text-[#18181B] shadow-sm hover:bg-[#FFF4F8] transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <div>
                  {greeting && (
                    <span className="text-[15px] font-medium text-[#6B7280] block mb-1">
                      {greeting}
                    </span>
                  )}
                  <h1
                    className="text-4xl md:text-5xl font-normal text-[#18181B] m-0 tracking-tight leading-none"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {title}
                  </h1>
                  {description && (
                    <p className="text-[13px] text-[#6B7280] mt-2 m-0 max-w-[480px] leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
              </div>
              {headerActions && <div className="flex items-center gap-3">{headerActions}</div>}
            </header>

            {/* Page content */}
            {children}
          </div>

          {/* Right Panel (optional) */}
          {rightPanel && (
            <div className="w-full lg:w-[360px] shrink-0 z-10 flex flex-col gap-6 md:gap-8">
              {rightPanel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
