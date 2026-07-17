import { z } from "zod";

export const generateReportSchema = z.object({
  reportType: z.enum(["Monthly", "Annual", "Custom"]),
  
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start date format",
    })
    .optional(),

  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end date format",
    })
    .optional(),
});
