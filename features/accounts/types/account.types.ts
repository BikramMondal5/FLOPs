import { ObjectId } from "mongodb";

// ─────────────────────────────────────────────
// Account Type Enum
// ─────────────────────────────────────────────
export const ACCOUNT_TYPES = [
  "Savings",
  "Current",
  "Cash",
  "Wallet",
  "Credit Card",
  "Investment",
  "Business",
  "Other",
] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];

// ─────────────────────────────────────────────
// Account Icon Options
// ─────────────────────────────────────────────
export const ACCOUNT_ICONS = [
  "landmark",
  "wallet",
  "credit-card",
  "piggy-bank",
  "trending-up",
  "building-2",
  "banknote",
  "coins",
] as const;

export type AccountIcon = (typeof ACCOUNT_ICONS)[number];

// ─────────────────────────────────────────────
// Currency Options
// ─────────────────────────────────────────────
export const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

// ─────────────────────────────────────────────
// MongoDB Document Shape
// ─────────────────────────────────────────────
export interface IAccount {
  _id: ObjectId;
  userId: ObjectId;
  name: string;
  institution?: string;
  type: AccountType;
  currency: CurrencyCode;
  balance: number;
  color?: string;
  icon?: AccountIcon;
  description?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Serializable version for API responses (ObjectId → string)
export interface AccountDTO {
  _id: string;
  userId: string;
  name: string;
  institution?: string;
  type: AccountType;
  currency: CurrencyCode;
  balance: number;
  color?: string;
  icon?: AccountIcon;
  description?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// Input Types
// ─────────────────────────────────────────────
export interface CreateAccountInput {
  name: string;
  institution?: string;
  type: AccountType;
  currency?: CurrencyCode;
  balance: number;
  color?: string;
  icon?: AccountIcon;
  description?: string;
}

export interface UpdateAccountInput {
  name?: string;
  institution?: string;
  type?: AccountType;
  currency?: CurrencyCode;
  balance?: number;
  color?: string;
  icon?: AccountIcon;
  description?: string;
}

// ─────────────────────────────────────────────
// Query Parameters
// ─────────────────────────────────────────────
export type SortField =
  | "createdAt_desc"
  | "createdAt_asc"
  | "balance_desc"
  | "balance_asc"
  | "name_asc";

export interface AccountQueryParams {
  search?: string;
  type?: AccountType | "all";
  archived?: "true" | "false" | "all";
  sort?: SortField;
}

// ─────────────────────────────────────────────
// API Response Format
// ─────────────────────────────────────────────
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ path: string; message: string }>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
