"use client";

import { Suspense } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/lib/schemas/auth";

// ─────────────────────────────────────────────
// Inner form — uses useSearchParams so must be inside <Suspense>
// ─────────────────────────────────────────────
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/overview";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0] ?? "",
        password: fieldErrors.password?.[0] ?? "",
      });
      return;
    }

    setErrors({ email: "", password: "" });
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      if (result?.error) {
        const msg =
          result.error === "CredentialsSignin"
            ? "Invalid email or password. Please try again."
            : result.error;
        setServerError(msg);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-6 md:p-8 bg-white border border-[#F6B7CF]/15 rounded-[28px] shadow-[0_18px_60px_rgba(0,0,0,0.04)] flex flex-col justify-between w-full"
    >
      <div>
        <span className="text-[9px] font-bold text-[#D46A96] bg-[#FFF4F8] px-2 py-0.5 rounded-full border border-[#F6B7CF]/15 inline-flex items-center gap-1 uppercase tracking-wide">
          <Sparkles className="w-2.5 h-2.5 text-[#D46A96]" />
          <span>Welcome Back</span>
        </span>

        <h2
          className="text-3xl font-normal text-[#18181B] m-0 mt-2 tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Sign In to FLOPs
        </h2>
        <p className="text-xs text-[#6B7280] leading-normal m-0 mt-0.5">
          Continue managing your finances with AI-powered insights.
        </p>

        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium"
          >
            {serverError}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-3 mt-4" noValidate>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="login-email" className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                disabled={isLoading}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: "" })); }}
                className={`w-full text-xs text-[#18181B] bg-zinc-50/50 border rounded-xl pl-11 pr-4 h-[46px] outline-none transition-all disabled:opacity-50 ${errors.email ? "border-rose-300 focus:border-rose-400" : "border-[#F6B7CF]/25 focus:border-[#F6B7CF]/50 focus:shadow-[0_0_10px_rgba(246,183,207,0.1)]"}`}
              />
            </div>
            <div className="min-h-[14px] text-[10px] text-rose-500 font-medium px-1">{errors.email}</div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label htmlFor="login-password" className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-[11px] font-semibold text-[#D46A96] hover:underline leading-none">
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                autoComplete="current-password"
                value={password}
                disabled={isLoading}
                onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: "" })); }}
                className={`w-full text-xs text-[#18181B] bg-zinc-50/50 border rounded-xl pl-11 pr-11 h-[46px] outline-none transition-all disabled:opacity-50 ${errors.password ? "border-rose-300 focus:border-rose-400" : "border-[#F6B7CF]/25 focus:border-[#F6B7CF]/50 focus:shadow-[0_0_10px_rgba(246,183,207,0.1)]"}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 text-zinc-400 hover:text-zinc-600 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="min-h-[14px] text-[10px] text-rose-500 font-medium px-1">{errors.password}</div>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2 select-none -mt-2">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-zinc-300 text-[#D46A96] focus:ring-[#D46A96] cursor-pointer"
            />
            <label htmlFor="remember" className="text-[11px] text-[#6B7280] font-medium cursor-pointer">
              Remember me
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold h-[46px] bg-[#18181B] text-white hover:bg-zinc-800 rounded-xl transition-all shadow-[0_12px_30px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer mt-1"
          >
            {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in…</span></>) : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-zinc-100" />
          <span className="text-[9px] font-bold text-zinc-400 mx-3 uppercase tracking-wider">or</span>
          <div className="flex-grow border-t border-zinc-100" />
        </div>

        {/* OAuth */}
        <button type="button" disabled={isLoading} onClick={() => signIn("google", { callbackUrl: "/overview" })} className="w-full flex items-center justify-center gap-2 h-[46px] bg-white border border-[#F6B7CF]/20 rounded-xl text-xs font-bold text-zinc-700 hover:bg-[#FFF4F8]/30 transition-all cursor-pointer hover:-translate-y-0.5 disabled:opacity-50">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[#6B7280] font-medium mt-6 pt-3 border-t border-zinc-50 shrink-0">
        <span>Don&apos;t have an account? </span>
        <Link href="/auth/signup" className="text-[#D46A96] hover:underline font-semibold">
          Create Account
        </Link>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Page — wraps LoginForm in Suspense (required by useSearchParams)
// ─────────────────────────────────────────────
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="p-6 md:p-8 bg-white border border-[#F6B7CF]/15 rounded-[28px] shadow-[0_18px_60px_rgba(0,0,0,0.04)] flex items-center justify-center min-h-[400px] w-full">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-[#D46A96] animate-spin" />
          <p className="text-xs text-zinc-400">Loading…</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
