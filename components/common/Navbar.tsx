"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#faq", label: "FAQ" },
];

interface NavbarProps {
  userInfo?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  ctaText?: string;
  ctaHref?: string;
}

export default function Navbar({ userInfo, ctaText = "Get Started", ctaHref = "/plan" }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FCFCFD]/80 backdrop-blur-md border-b border-[#F6B7CF]/15 shadow-sm"
          : "bg-[#FCFCFD]/60 backdrop-blur-sm"
      }`}
      style={{ height: "72px" }}
    >
      <div
        className="mx-auto flex w-full h-full items-center justify-between px-6 xl:px-0"
        style={{ maxWidth: "1200px" }}
      >
        {/* Logo */}
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
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              letterSpacing: "-0.01em",
            }}
          >
            FLOPs
          </span>
        </Link>

        {/* Center Desktop nav links */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-8 pointer-events-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="no-underline transition-opacity duration-150 text-[15px] text-[#18181B] opacity-80 hover:opacity-100"
                style={{
                  fontFamily: "var(--font-body)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side - User info or CTA */}
        <div className="flex items-center gap-3 z-10 relative">
          {userInfo ? (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-semibold text-[#18181B] m-0 leading-none">
                  {userInfo.name}
                </p>
                {userInfo.email && (
                  <p className="text-[11px] text-[#9CA3AF] m-0 mt-0.5 leading-none">
                    {userInfo.email}
                  </p>
                )}
              </div>
              {userInfo.image ? (
                <img
                  src={userInfo.image}
                  alt={userInfo.name ?? "User"}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full border-2 border-[#F6B7CF]/30 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#FFF4F8] border-2 border-[#F6B7CF]/30 flex items-center justify-center text-[#D46A96] text-[14px] font-bold">
                  {userInfo.name?.charAt(0).toUpperCase() ?? "U"}
                </div>
              )}
            </>
          ) : (
            <Link
              href={ctaHref}
              className="no-underline text-[15px] font-medium text-white"
              style={{
                fontFamily: "var(--font-body)",
                background: "#18181B",
                borderRadius: "999px",
                padding: "10px 24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
              }}
            >
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
