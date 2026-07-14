"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Sparkles, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email address is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return;
    }

    setError("");
    setSubmitted(true);
    alert(`Reset link sent successfully to: ${email}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-8 md:p-10 bg-white border border-[#F6B7CF]/15 rounded-[32px] shadow-[0_18px_60px_rgba(0,0,0,0.04)] flex flex-col justify-between w-full"
    >
      <div>
        {/* Card Header tag */}
        <span className="text-[10px] font-bold text-[#D46A96] bg-[#FFF4F8] px-2.5 py-1 rounded-full border border-[#F6B7CF]/15 inline-flex items-center gap-1 uppercase tracking-wide">
          <Sparkles className="w-3 h-3 text-[#D46A96]" />
          <span>Reset Password</span>
        </span>

        <h2
          className="text-3xl font-normal text-[#18181B] m-0 mt-3 tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Recover Password
        </h2>
        <p className="text-xs text-[#6B7280] leading-normal m-0 mt-1">
          Enter your email to receive a recovery link.
        </p>

        {submitted ? (
          <div className="mt-6 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col gap-2">
            <span className="text-xs font-bold text-emerald-600">Recovery Email Sent!</span>
            <p className="text-[11.5px] text-[#6B7280] leading-relaxed m-0">
              We have dispatched a reset token to <span className="font-semibold text-zinc-700">{email}</span>. Please verify your inbox and spam folders.
            </p>
          </div>
        ) : (
          /* Form Fields container */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
            
            {/* Email input field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className={`w-full text-xs text-[#18181B] bg-zinc-50/50 border rounded-2xl pl-11 pr-4 h-[56px] outline-none transition-all ${
                    error ? "border-rose-300 focus:border-rose-400" : "border-[#F6B7CF]/25 focus:border-[#F6B7CF]/50 focus:shadow-[0_0_12px_rgba(246,183,207,0.15)]"
                  }`}
                />
              </div>
              <div className="min-h-[16px] text-[10px] text-rose-500 font-medium px-1">
                {error}
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="w-full text-xs font-semibold h-[56px] bg-[#18181B] text-white hover:bg-zinc-800 rounded-2xl transition-all shadow-[0_16px_40px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 cursor-pointer mt-1"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>

      {/* Card Footer redirect links */}
      <div className="text-center text-xs text-[#6B7280] font-medium mt-8 pt-4 border-t border-zinc-50 shrink-0">
        <Link href="/auth/login" className="text-zinc-500 hover:text-[#D46A96] font-semibold inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>

    </motion.div>
  );
}
