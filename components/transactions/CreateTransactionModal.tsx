"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  TRANSACTION_CATEGORIES,
  PAYMENT_METHODS,
} from "@/features/transactions/types/transaction.types";
import type { AccountDTO } from "@/features/accounts/types/account.types";
import type { TransactionDTO } from "@/features/transactions/types/transaction.types";

interface CreateTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (tx: TransactionDTO) => void;
  accounts: AccountDTO[];
}

const defaultForm = {
  accountId: "",
  type: "Expense" as const,
  category: "Food & Dining" as const,
  amount: "",
  merchant: "",
  paymentMethod: "UPI" as const,
  transactionDate: "",
  notes: "",
  location: "",
};

type FormState = {
  accountId: string;
  type: "Income" | "Expense";
  category: "Housing" | "Bills & Utilities" | "Food & Dining" | "Shopping" | "Transportation" | "Travel" | "Entertainment" | "Health & Fitness" | "Education" | "Personal Care" | "Salary" | "Business Income" | "Investments" | "Gifts & Donations" | "Insurance" | "Taxes" | "Fees & Charges" | "Other";
  amount: string;
  merchant: string;
  paymentMethod: "Cash" | "Credit Card" | "Debit Card" | "UPI" | "Net Banking" | "Wallet" | "Cheque" | "Direct Debit" | "Other";
  transactionDate: string;
  notes: string;
  location: string;
};
type FieldErrors = Partial<Record<keyof FormState, string>>;

export default function CreateTransactionModal({
  open,
  onClose,
  onCreated,
  accounts,
}: CreateTransactionModalProps) {
  const [form, setForm] = useState<FormState>({ ...defaultForm, accountId: accounts[0]?._id || "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  // Keep form updated with default account selection when open shifts
  useEffect(() => {
    if (open) {
      setForm({
        ...defaultForm,
        accountId: accounts[0]?._id || "",
        transactionDate: new Date().toISOString().split("T")[0],
      });
      setErrors({});
      setStatus("idle");
      setServerError("");
    }
  }, [open, accounts]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!form.accountId) next.accountId = "Account selection is required.";
    if (!form.merchant.trim() || form.merchant.trim().length < 2)
      next.merchant = "Merchant description must be at least 2 characters.";
    if (form.merchant.trim().length > 100)
      next.merchant = "Merchant description must be under 100 characters.";
    const amt = Number(form.amount);
    if (form.amount === "" || isNaN(amt)) next.amount = "Transaction amount is required.";
    else if (amt <= 0) next.amount = "Amount must be greater than zero.";
    else if (amt > 999_999_999) next.amount = "Amount exceeds limits.";
    if (!form.transactionDate) next.transactionDate = "Date is required.";
    if (form.notes.length > 250) next.notes = "Notes must be under 250 characters.";
    if (form.location.length > 100) next.location = "Location description must be under 100 characters.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setServerError("");

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: form.accountId,
          type: form.type,
          category: form.category,
          amount: Number(form.amount),
          merchant: form.merchant.trim(),
          paymentMethod: form.paymentMethod,
          transactionDate: new Date(form.transactionDate).toISOString(),
          notes: form.notes.trim() || undefined,
          location: form.location.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        if (data.errors) {
          const fieldErrors: FieldErrors = {};
          for (const err of data.errors) {
            fieldErrors[err.path as keyof FormState] = err.message;
          }
          setErrors(fieldErrors);
        } else {
          setServerError(data.message ?? "Failed to save record.");
        }
        setStatus("error");
        return;
      }

      setStatus("success");
      setTimeout(() => {
        onCreated(data.data as TransactionDTO);
        onClose();
      }, 700);
    } catch {
      setServerError("Network error logging transaction.");
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-[28px] shadow-[0_32px_80px_rgba(0,0,0,0.16)] w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-[#F6B7CF]/15">
                <div>
                  <h2 className="text-xl font-semibold text-[#18181B] m-0">Add Transaction</h2>
                  <p className="text-[12px] text-[#9CA3AF] mt-0.5 m-0">
                    Manually log incomes or expenses to your financial account
                  </p>
                </div>
                <button
                  id="close-create-tx-modal"
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 gap-3"
                >
                  <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                  <p className="text-[15px] font-semibold text-[#18181B]">Transaction Logged!</p>
                </motion.div>
              )}

              {status !== "success" && (
                <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-4">
                  {serverError && (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-[12px] px-4 py-3 rounded-xl">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {serverError}
                    </div>
                  )}

                  {/* Flow selection */}
                  <div className="flex gap-2 p-1 bg-zinc-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => set("type", "Expense")}
                      className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                        form.type === "Expense"
                          ? "bg-[#18181B] text-white"
                          : "bg-transparent text-zinc-600 hover:text-zinc-800"
                      }`}
                    >
                      Expense (-)
                    </button>
                    <button
                      type="button"
                      onClick={() => set("type", "Income")}
                      className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                        form.type === "Income"
                          ? "bg-emerald-600 text-white"
                          : "bg-transparent text-zinc-600 hover:text-emerald-600"
                      }`}
                    >
                      Income (+)
                    </button>
                  </div>

                  {/* Account selection */}
                  <Field label="Financial Account" required error={errors.accountId}>
                    <select
                      id="create-tx-account"
                      value={form.accountId}
                      onChange={(e) => set("accountId", e.target.value)}
                      className={inputClass(!!errors.accountId)}
                    >
                      <option value="" disabled>Select account</option>
                      {accounts.map((acc) => (
                        <option key={acc._id} value={acc._id}>
                          {acc.name} ({acc.type} - {acc.currency})
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Merchant description */}
                  <Field label="Merchant / Payee" required error={errors.merchant}>
                    <input
                      id="create-tx-merchant"
                      type="text"
                      placeholder="e.g. McDonald's or Salary credit"
                      value={form.merchant}
                      onChange={(e) => set("merchant", e.target.value)}
                      className={inputClass(!!errors.merchant)}
                    />
                  </Field>

                  {/* Category & Payment Method row */}
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Category" required error={errors.category}>
                      <select
                        id="create-tx-category"
                        value={form.category}
                        onChange={(e) => set("category", e.target.value as any)}
                        className={inputClass(!!errors.category)}
                      >
                        {TRANSACTION_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Payment Method" required error={errors.paymentMethod}>
                      <select
                        id="create-tx-payment"
                        value={form.paymentMethod}
                        onChange={(e) => set("paymentMethod", e.target.value as any)}
                        className={inputClass(!!errors.paymentMethod)}
                      >
                        {PAYMENT_METHODS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {/* Amount & Date row */}
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Amount" required error={errors.amount}>
                      <input
                        id="create-tx-amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        value={form.amount}
                        onChange={(e) => set("amount", e.target.value)}
                        className={inputClass(!!errors.amount)}
                      />
                    </Field>

                    <Field label="Transaction Date" required error={errors.transactionDate}>
                      <input
                        id="create-tx-date"
                        type="date"
                        value={form.transactionDate}
                        onChange={(e) => set("transactionDate", e.target.value)}
                        className={inputClass(!!errors.transactionDate)}
                      />
                    </Field>
                  </div>

                  {/* Notes & Location */}
                  <div className="grid grid-cols-1 gap-4">
                    <Field label="Notes" error={errors.notes}>
                      <input
                        id="create-tx-notes"
                        type="text"
                        placeholder="Memo notes (optional)"
                        value={form.notes}
                        onChange={(e) => set("notes", e.target.value)}
                        className={inputClass(!!errors.notes)}
                      />
                    </Field>

                    <Field label="Location" error={errors.location}>
                      <input
                        id="create-tx-location"
                        type="text"
                        placeholder="e.g. Mumbai, India (optional)"
                        value={form.location}
                        onChange={(e) => set("location", e.target.value)}
                        className={inputClass(!!errors.location)}
                      />
                    </Field>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 rounded-2xl border border-zinc-200 text-[13px] font-semibold text-zinc-500 hover:bg-zinc-50 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      id="submit-create-tx"
                      type="submit"
                      disabled={status === "loading"}
                      className="flex-1 py-3 rounded-2xl bg-[#18181B] text-white text-[13px] font-semibold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                      {status === "loading" ? "Saving..." : "Save Record"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11.5px] font-bold text-zinc-600">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[10px] text-rose-500 m-0">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full text-[12.5px] text-[#18181B] bg-white border rounded-xl px-3 py-2 outline-none transition-colors placeholder-[#9CA3AF] ${
    hasError ? "border-rose-400 focus:border-rose-500" : "border-[#E4E4E7] focus:border-[#D46A96]"
  }`;
}
