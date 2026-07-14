import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Next.js 16 Proxy (replaces middleware.ts).
 *
 * Uses the edge-compatible authConfig ONLY — no MongoDB, no bcrypt,
 * no Node.js-only modules. Runs on every request in the Edge runtime.
 *
 * Route protection logic is in authConfig.callbacks.authorized().
 */
const { auth } = NextAuth(authConfig);

// Next.js 16 requires a named "proxy" export (or default export)
export const proxy = auth;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
