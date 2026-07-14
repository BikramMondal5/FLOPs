import { handlers } from "@/lib/auth";

// Runtime-only — never pre-render at build time
export const dynamic = "force-dynamic";

/**
 * Auth.js v5 route handler.
 * Handles all /api/auth/* routes automatically:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/session
 * - /api/auth/csrf
 * - /api/auth/providers
 * - /api/auth/callback/*
 */
export const { GET, POST } = handlers;
