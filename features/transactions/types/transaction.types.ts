import { ObjectId } from "mongodb";

// ─────────────────────────────────────────────
// Transaction Type Enum
// ─────────────────────────────────────────────
export const TRANSACTION_TYPES = ["Income", "Expense"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

// ─────────────────────────────────────────────
// Predefined Categories
// ─────────────────────────────────────────────
export const TRANSACTION_CATEGORIES = [
  "Housing",
  "Bills & Utilities",
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Travel",
  "Entertainment",
  "Health & Fitness",
  "Education",
  "Personal Care",
  "Salary",
  "Business Income",
  "Investments",
  "Gifts & Donations",
  "Insurance",
  "Taxes",
  "Fees & Charges",
  "Other",
] as const;
export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

// ─────────────────────────────────────────────
// Payment Methods
// ─────────────────────────────────────────────
export const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Net Banking",
  "Wallet",
  "Cheque",
  "Direct Debit",
  "Other",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

// ─────────────────────────────────────────────
// Category visual mapping helper
// ─────────────────────────────────────────────
export const CATEGORY_METADATA: Record<TransactionCategory, { emoji: string; color: string; border: string }> = {
  Housing: { emoji: "🏠", color: "bg-blue-50", border: "border-blue-100" },
  "Bills & Utilities": { emoji: "⚡", color: "bg-amber-50", border: "border-amber-100" },
  "Food & Dining": { emoji: "🍔", color: "bg-[#FFF4F8]", border: "border-[#F6B7CF]/20" },
  Shopping: { emoji: "🛍️", color: "bg-purple-50", border: "border-purple-100" },
  Transportation: { emoji: "🚗", color: "bg-orange-50", border: "border-orange-100" },
  Travel: { emoji: "✈️", color: "bg-indigo-50", border: "border-indigo-100" },
  Entertainment: { emoji: "🎬", color: "bg-pink-50", border: "border-pink-100" },
  "Health & Fitness": { emoji: "❤️", color: "bg-rose-50", border: "border-rose-100" },
  Education: { emoji: "📚", color: "bg-violet-50", border: "border-violet-100" },
  "Personal Care": { emoji: "💅", color: "bg-teal-50", border: "border-teal-100" },
  Salary: { emoji: "💼", color: "bg-emerald-50", border: "border-emerald-100" },
  "Business Income": { emoji: "🏢", color: "bg-green-50", border: "border-green-100" },
  Investments: { emoji: "📈", color: "bg-sky-50", border: "border-sky-100" },
  "Gifts & Donations": { emoji: "🎁", color: "bg-lime-50", border: "border-lime-100" },
  Insurance: { emoji: "🛡️", color: "bg-cyan-50", border: "border-cyan-100" },
  Taxes: { emoji: "📝", color: "bg-red-50", border: "border-red-100" },
  "Fees & Charges": { emoji: "💸", color: "bg-yellow-50", border: "border-yellow-100" },
  Other: { emoji: "🪙", color: "bg-zinc-50", border: "border-zinc-100" },
};

// ─────────────────────────────────────────────
// MongoDB Document Shape
// ─────────────────────────────────────────────
export interface ITransaction {
  _id: ObjectId;
  userId: ObjectId;
  accountId: ObjectId;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  merchant: string;
  paymentMethod: PaymentMethod;
  transactionDate: Date;
  notes?: string;
  location?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Serializable version for API / Client
export interface TransactionDTO {
  _id: string;
  userId: string;
  accountId: string;
  accountName?: string; // virtual field joined from account lookup
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  merchant: string;
  paymentMethod: PaymentMethod;
  transactionDate: string;
  notes?: string;
  location?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// Input Types
export interface CreateTransactionInput {
  accountId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  merchant: string;
  paymentMethod: PaymentMethod;
  transactionDate: string; // ISO string
  notes?: string;
  location?: string;
}

export interface UpdateTransactionInput {
  accountId?: string;
  type?: TransactionType;
  category?: TransactionCategory;
  amount?: number;
  merchant?: string;
  paymentMethod?: PaymentMethod;
  transactionDate?: string;
  notes?: string;
  location?: string;
}

export interface TransactionQueryParams {
  search?: string;
  type?: TransactionType | "all";
  category?: TransactionCategory | "all";
  paymentMethod?: PaymentMethod | "all";
  accountId?: string | "all";
  dateFrom?: string;
  dateTo?: string;
  archived?: "true" | "false" | "all";
  sort?: "date_desc" | "date_asc" | "amount_desc" | "amount_asc" | "merchant_asc";
  page?: string;
  limit?: string;
}

export interface PaginatedTransactions {
  transactions: TransactionDTO[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
