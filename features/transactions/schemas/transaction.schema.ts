import { z } from "zod";
import {
  TRANSACTION_TYPES,
  TRANSACTION_CATEGORIES,
  PAYMENT_METHODS,
} from "../types/transaction.types";

const transactionTypeEnum = TRANSACTION_TYPES as readonly [string, ...string[]];
const categoryEnum = TRANSACTION_CATEGORIES as readonly [string, ...string[]];
const paymentMethodEnum = PAYMENT_METHODS as readonly [string, ...string[]];

// ─────────────────────────────────────────────
// MongoDB ObjectId Validation regex helper
// ─────────────────────────────────────────────
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// ─────────────────────────────────────────────
// Create Transaction Validation Schema
// ─────────────────────────────────────────────
export const createTransactionSchema = z.object({
  accountId: z
    .string()
    .regex(objectIdRegex, "Invalid account selection"),

  type: z.enum(transactionTypeEnum, {
    error: "Transaction type must be Income or Expense",
  }),

  category: z.enum(categoryEnum, {
    error: "Invalid category selection",
  }),

  amount: z
    .number({ error: "Amount must be a number" })
    .positive("Amount must be greater than zero")
    .max(999_999_999, "Amount exceeds limits"),

  merchant: z
    .string()
    .min(2, "Merchant name must be at least 2 characters")
    .max(100, "Merchant name must be under 100 characters")
    .trim(),

  paymentMethod: z.enum(paymentMethodEnum, {
    error: "Invalid payment method",
  }),

  transactionDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid transaction date format",
    }),

  notes: z
    .string()
    .max(250, "Notes must be under 250 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  location: z
    .string()
    .max(100, "Location description must be under 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

// ─────────────────────────────────────────────
// Update Transaction Validation Schema
// ─────────────────────────────────────────────
export const updateTransactionSchema = createTransactionSchema.partial();

// ─────────────────────────────────────────────
// Query Parameters Validation Schema
// ─────────────────────────────────────────────
export const transactionQuerySchema = z.object({
  search: z.string().trim().optional(),
  type: z.enum([...transactionTypeEnum, "all"]).optional().default("all"),
  category: z.enum([...categoryEnum, "all"]).optional().default("all"),
  paymentMethod: z.enum([...paymentMethodEnum, "all"]).optional().default("all"),
  accountId: z.string().optional().default("all"),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  archived: z.enum(["true", "false", "all"]).optional().default("false"),
  sort: z
    .enum(["date_desc", "date_asc", "amount_desc", "amount_asc", "merchant_asc"])
    .optional()
    .default("date_desc"),
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("20"),
});
