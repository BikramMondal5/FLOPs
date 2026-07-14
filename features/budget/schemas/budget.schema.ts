import { z } from "zod";
import { TRANSACTION_CATEGORIES } from "@/features/transactions/types/transaction.types";

const categoryEnum = TRANSACTION_CATEGORIES as readonly [string, ...string[]];

export const createBudgetSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters")
    .trim(),

  category: z.enum(categoryEnum, {
    error: "Invalid transaction category selected",
  }),

  budgetAmount: z
    .number({ error: "Amount must be a number" })
    .positive("Amount must be greater than zero"),

  period: z.enum(["Weekly", "Monthly", "Quarterly", "Yearly", "Custom"]).default("Monthly"),

  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start date format",
    }),

  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end date format",
    }),

  alertThreshold: z
    .number()
    .min(50, "Threshold must be at least 50%")
    .max(100, "Threshold cannot exceed 100%")
    .default(80),

  color: z.string().optional().default("#F6B7CF"),
  icon: z.string().optional().default("utensils"),
  description: z.string().max(200, "Description too long").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const updateBudgetSchema = createBudgetSchema.partial();
