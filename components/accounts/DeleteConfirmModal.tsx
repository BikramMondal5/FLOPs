"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2, X } from "lucide-react";
import type { AccountDTO } from "@/features/accounts/types/account.types";

interface DeleteConfirmModalProps {
  account: AccountDTO | null;
  onClose: () => void;
  onArchived: (accountId: string) => void;
}

export default function DeleteConfirmModal({ account, onClose, onArchived }: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleArchive() {
    if (!account) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/accounts/${account._id}`, { method: "DELETE" });
      const data = await res.json();

      if (!data.success) {
        setError(data.message ?? "Failed to archive account.");
        setLoading(false);
        return;
      }

      onArchived(account._id);
      onClose();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {account && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-[24px] shadow-[0_32px_80px_rgba(0,0,0,0.18)] w-full max-w-sm p-7 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <div className="flex justify-end mb-2">
                <button
                  id="close-delete-modal"
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Icon */}
              <div className="flex items-center justify-center mb-5">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-amber-500" />
                </div>
              </div>

              {/* Copy */}
              <h2 className="text-[17px] font-semibold text-[#18181B] text-center m-0">
                Archive Account?
              </h2>
              <p className="text-[13px] text-[#6B7280] text-center mt-2 mb-2 leading-relaxed">
                <span className="font-semibold text-[#18181B]">{account?.name}</span> will be archived and hidden from your active accounts. Historical data is preserved.
              </p>
              <p className="text-[11px] text-[#9CA3AF] text-center mb-6 leading-relaxed">
                You can restore it later from the Archived view.
              </p>

              {error && (
                <p className="text-[12px] text-rose-500 text-center mb-4">{error}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  id="cancel-archive"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl border border-[#E4E4E7] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F4F4F5] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="confirm-archive"
                  onClick={handleArchive}
                  disabled={loading}
                  className="flex-1 py-3 rounded-2xl bg-amber-500 text-white text-[13px] font-semibold hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {loading ? "Archiving..." : "Archive"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
