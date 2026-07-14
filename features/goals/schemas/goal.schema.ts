import { z } from "zod";

const categories = [
  "Emergency Fund",
  "Vacation",
  "Education",
  "Electronics",
  "Vehicle",
  "Home",
  "Investment",
  "Retirement",
  "Healthcare",
  "Business",
  "Wedding",
  "Other",
] as const;

export const createGoalSchema = z.object({
  name: z
    .string()
    .min(2, "Goal Name must be at least 2 characters")
    .max(60, "Goal Name must be under 60 characters")
    .trim(),

  targetAmount: z
    .number({ error: "Target Amount must be a number" })
    .positive("Target Amount must be greater than zero"),

  currentContribution: z
    .number()
    .min(0, "Current Contribution cannot be negative")
    .default(0),

  targetDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)) && new Date(val) > new Date(), {
      message: "Target Date must be a future date",
    }),

  priority: z.enum(["High", "Medium", "Low"]).default("Medium"),

  category: z.enum(categories, {
    error: "Invalid goal category selected",
  }),

  icon: z.string().optional().default("target"),
  color: z.string().optional().default("#F6B7CF"),
  description: z.string().max(250, "Description must be under 250 characters").optional().or(z.literal("")),
  status: z.enum(["Active", "Completed", "Paused", "Cancelled"]).default("Active"),
  isArchived: z.boolean().default(false),
});

export const updateGoalSchema = createGoalSchema.partial();
