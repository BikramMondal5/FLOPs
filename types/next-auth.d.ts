import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// ─────────────────────────────────────────────
// Extend the built-in session user type
// ─────────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      currency: string;
      country: string;
      language: string;
      timezone: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: string;
    currency?: string;
    country?: string;
    language?: string;
    timezone?: string;
  }
}

// ─────────────────────────────────────────────
// Extend the JWT type
// ─────────────────────────────────────────────
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    currency?: string;
    country?: string;
    language?: string;
    timezone?: string;
  }
}
