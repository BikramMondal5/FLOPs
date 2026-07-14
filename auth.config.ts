import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible Auth.js config.
 * ─────────────────────────────────────────────
 * This file contains NO database imports, NO bcrypt, NO Node.js-only modules.
 * It can safely run in the Next.js Edge runtime (used by proxy.ts).
 *
 * The full config (with MongoDB adapter + CredentialsProvider) lives in lib/auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  session: { strategy: "jwt" },

  callbacks: {
    /**
     * Called on every request by the proxy.
     * Returns true to allow access, false/redirect to block.
     */
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAuthenticated = !!auth?.user;

      const PROTECTED_ROUTES = [
        "/overview",
        "/accounts",
        "/transactions",
        "/budget",
        "/goals",
        "/ai-insights",
        "/profile",
      ];

      const AUTH_ROUTES = ["/auth/login", "/auth/signup"];

      const isProtectedRoute = PROTECTED_ROUTES.some(
        (r) => pathname === r || pathname.startsWith(r + "/")
      );
      const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

      if (isProtectedRoute && !isAuthenticated) return false; // triggers signIn redirect
      if (isAuthRoute && isAuthenticated) {
        return Response.redirect(new URL("/overview", request.nextUrl));
      }

      return true;
    },
  },

  providers: [], // providers are added in lib/auth.ts — not needed here
} satisfies NextAuthConfig;
