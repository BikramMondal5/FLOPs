"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { ACCOUNT_TYPES, ACCOUNT_ICONS, CURRENCIES } from "@/features/accounts/types/account.types";
import type { AccountDTO } from "@/features/accounts/types/account.types";

const PRESET_COLORS = [
  "#F6B7CF", "#D46A96", "#93C5FD", "#6EE7B7",
  "#FCD34D", "#F9A8D4", "#A5B4FC", "#86EFAC",
  "#FB923C", "#67E8F9", "#C4B5FD", "#FCA5A5",
];

interface CreateAccountModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (account: AccountDTO) => void;
}

const defaultForm = {
  name: "",
  institution: "",
  type: "Savings",
  currency: "INR",
  balance: "",
  color: "#F6B7CF",
  icon: "landmark",
  description: "",
};

type FormState = typeof defaultForm;
type FieldErrors = Partial<Record<keyof FormState, string>>;

export default function CreateAccountModal({ open, onClose, onCreated }: CreateAccountModalProps) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  // Reset on open
  useEffect(() => {
    if (open) {
      setForm(defaultForm);
      setErrors({});
      setStatus("idle");
      setServerError("");
    }
  }, [open]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      next.name = "Account name must be at least 2 characters.";
    if (form.name.trim().length > 50)
      next.name = "Account name must be under 50 characters.";
    if (form.institution.length > 80)
      next.institution = "Institution name must be under 80 characters.";
    const bal = Number(form.balance);
    if (form.balance === "" || isNaN(bal))
      next.balance = "Balance is required.";
    else if (bal < 0)
      next.balance = "Balance cannot be negative.";
    else if (bal > 999_999_999)
      next.balance = "Balance exceeds maximum limit.";
    if (form.description.length > 250)
      next.description = "Description must be under 250 characters.";
    if (form.color && !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(form.color))
      next.color = "Must be a valid HEX color.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setServerError("");

    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          institution: form.institution.trim() || undefined,
          type: form.type,
          currency: form.currency,
          balance: Number(form.balance),
          color: form.color || undefined,
          icon: form.icon || undefined,
          description: form.description.trim() || undefined,
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
          setServerError(data.message ?? "Something went wrong.");
        }
        setStatus("error");
        return;
      }

      setStatus("success");
      setTimeout(() => {
        onCreated(data.data as AccountDTO);
        onClose();
      }, 800);
    } catch {
      setServerError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
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
                  <h2
                    className="text-xl font-semibold text-[#18181B] m-0"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Create Account
                  </h2>
                  <p className="text-[12px] text-[#9CA3AF] mt-0.5 m-0">
                    Add a new financial account to track your money
                  </p>
                </div>
                <button
                  id="close-create-modal"
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Success state */}
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 gap-3"
                >
                  <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                  <p className="text-[15px] font-semibold text-[#18181B]">Account Created!</p>
                </motion.div>
              )}

              {status !== "success" && (
                <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-5">
                  {/* Server error banner */}
                  {serverError && (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-[12px] px-4 py-3 rounded-xl">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {serverError}
                    </div>
                  )}

                  {/* Name */}
                  <Field label="Account Name" required error={errors.name}>
                    <input
                      id="create-account-name"
                      type="text"
                      placeholder="e.g. HDFC Savings"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      className={inputClass(!!errors.name)}
                    />
                  </Field>

                  {/* Institution */}
                  <Field label="Institution / Bank" error={errors.institution}>
                    <input
                      id="create-account-institution"
                      type="text"
                      placeholder="e.g. HDFC Bank (optional)"
                      value={form.institution}
                      onChange={(e) => set("institution", e.target.value)}
                      className={inputClass(!!errors.institution)}
                    />
                  </Field>

                  {/* Type + Currency row */}
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Account Type" required error={errors.type}>
                      <select
                        id="create-account-type"
                        value={form.type}
                        onChange={(e) => set("type", e.target.value)}
                        className={inputClass(!!errors.type)}
                      >
                        {ACCOUNT_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Currency" error={errors.currency}>
                      <select
                        id="create-account-currency"
                        value={form.currency}
                        onChange={(e) => set("currency", e.target.value)}
                        className={inputClass(false)}
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} ({c.symbol})
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {/* Balance */}
                  <Field label="Opening Balance" required error={errors.balance}>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#6B7280] font-medium">
                        {CURRENCIES.find((c) => c.code === form.currency)?.symbol ?? "₹"}
                      </span>
                      <input
                        id="create-account-balance"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={form.balance}
                        onChange={(e) => set("balance", e.target.value)}
                        className={`${inputClass(!!errors.balance)} pl-8`}
                      />
                    </div>
                  </Field>

                  {/* Icon */}
                  <Field label="Icon">
                    <div className="flex flex-wrap gap-2">
                      {ACCOUNT_ICONS.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => set("icon", icon)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center border text-[13px] transition-all cursor-pointer ${
                            form.icon === icon
                              ? "bg-[#18181B] text-white border-[#18181B]"
                              : "bg-white border-[#E4E4E7] text-[#6B7280] hover:border-[#D46A96] hover:text-[#D46A96]"
                          }`}
                          title={icon}
                        >
                          {icon.charAt(0).toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </Field>

                  {/* Color */}
                  <Field label="Accent Color" error={errors.color}>
                    <div className="flex flex-wrap gap-2 items-center">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => set("color", c)}
                          style={{ backgroundColor: c }}
                          className={`w-7 h-7 rounded-lg border-2 transition-all cursor-pointer shrink-0 ${
                            form.color === c ? "border-[#18181B] scale-110" : "border-transparent hover:scale-105"
                          }`}
                          title={c}
                        />
                      ))}
                      <input
                        id="create-account-color"
                        type="text"
                        value={form.color}
                        onChange={(e) => set("color", e.target.value)}
                        placeholder="#F6B7CF"
                        className="text-[12px] border border-[#E4E4E7] rounded-lg px-2.5 py-1.5 w-24 outline-none focus:border-[#D46A96] transition-colors"
                      />
                    </div>
                  </Field>

                  {/* Description */}
                  <Field label="Description" error={errors.description}>
                    <textarea
                      id="create-account-description"
                      placeholder="Optional notes about this account..."
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      rows={2}
                      className={`${inputClass(!!errors.description)} resize-none`}
                    />
                  </Field>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 rounded-2xl border border-[#E4E4E7] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F4F4F5] transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      id="submit-create-account"
                      type="submit"
                      disabled={status === "loading"}
                      className="flex-1 py-3 rounded-2xl bg-[#18181B] text-white text-[13px] font-semibold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                      {status === "loading" ? "Creating..." : "Create Account"}
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

// ─────────────────────────────────────────────
// Reusable field wrapper
// ─────────────────────────────────────────────
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-[#374151]">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-rose-500">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full text-[13px] text-[#18181B] bg-white border rounded-xl px-3.5 py-2.5 outline-none transition-colors placeholder-[#9CA3AF] ${
    hasError
      ? "border-rose-400 focus:border-rose-500"
      : "border-[#E4E4E7] focus:border-[#D46A96]"
  }`;
}
