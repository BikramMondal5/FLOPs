import { TransactionCategory } from "@/features/transactions/types/transaction.types";

export type BudgetPeriod = "Weekly" | "Monthly" | "Quarterly" | "Yearly" | "Custom";

export type BudgetStatus = "On Track" | "Near Limit" | "Exceeded";

export interface IBudget {
  _id: string;
  userId: string;
  name: string;
  category: TransactionCategory;
  budgetAmount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  alertThreshold: number; // e.g. 80 for 80%
  color?: string;
  icon?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetDTO extends IBudget {}
