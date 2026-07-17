import { z } from "zod";
import { ACCOUNT_TYPES, ACCOUNT_ICONS, CURRENCIES } from "../types/account.types";

const accountTypeEnum = ACCOUNT_TYPES as readonly [string, ...string[]];
const accountIconEnum = ACCOUNT_ICONS as readonly [string, ...string[]];
const currencyEnum = CURRENCIES.map((c) => c.code) as [string, ...string[]];

// ─────────────────────────────────────────────
// Hex Color Validation
// ─────────────────────────────────────────────
const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

// ─────────────────────────────────────────────
// Create Account Schema
// ─────────────────────────────────────────────
export const createAccountSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters")
    .trim(),

  institution: z
    .string()
    .max(80, "Institution name must be under 80 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  type: z.enum(accountTypeEnum as [string, ...string[]], {
    error: `Type must be one of: ${ACCOUNT_TYPES.join(", ")}`,
  }),

  currency: z
    .enum(currencyEnum as [string, ...string[]])
    .default("INR")
    .optional(),

  balance: z
    .number({ error: "Balance must be a number" })
    .min(-999_999_999, "Balance cannot be less than -999,999,999")
    .max(999_999_999, "Balance exceeds maximum limit"),

  color: z
    .string()
    .regex(hexColorRegex, "Color must be a valid HEX code (e.g. #F6B7CF)")
    .optional()
    .or(z.literal("")),

  icon: z
    .enum(accountIconEnum as [string, ...string[]])
    .optional(),

  description: z
    .string()
    .max(250, "Description must be under 250 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

// ─────────────────────────────────────────────
// Update Account Schema (all fields optional)
// ─────────────────────────────────────────────
export const updateAccountSchema = createAccountSchema.partial();

// ─────────────────────────────────────────────
// Query Params Schema
// ─────────────────────────────────────────────
export const accountQuerySchema = z.object({
  search: z.string().trim().optional(),
  type: z
    .enum([...accountTypeEnum, "all"] as [string, ...string[]])
    .optional()
    .default("all"),
  archived: z.enum(["true", "false", "all"]).optional().default("false"),
  sort: z
    .enum(["createdAt_desc", "createdAt_asc", "balance_desc", "balance_asc", "name_asc"])
    .optional()
    .default("createdAt_desc"),
});

// ─────────────────────────────────────────────
// Inferred Types
// ─────────────────────────────────────────────
export type CreateAccountSchema = z.infer<typeof createAccountSchema>;
export type UpdateAccountSchema = z.infer<typeof updateAccountSchema>;
export type AccountQuerySchema = z.infer<typeof accountQuerySchema>;
