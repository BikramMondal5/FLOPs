"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, CheckCircle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "success" | "default";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: {
      icon: <AlertTriangle className="w-6 h-6 text-rose-600" />,
      iconBg: "bg-rose-100",
      confirmBtn: "bg-rose-600 hover:bg-rose-700 text-white",
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
      iconBg: "bg-orange-100",
      confirmBtn: "bg-orange-600 hover:bg-orange-700 text-white",
    },
    success: {
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
      iconBg: "bg-emerald-100",
      confirmBtn: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    default: {
      icon: <Info className="w-6 h-6 text-blue-600" />,
      iconBg: "bg-blue-100",
      confirmBtn: "bg-[#18181B] hover:bg-zinc-800 text-white",
    },
  };

  const style = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-zinc-100 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center mb-4`}>
                {style.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">{title}</h3>
              {description && <p className="text-sm text-zinc-600 mb-6">{description}</p>}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 border border-zinc-200 text-zinc-700 font-medium rounded-xl hover:bg-zinc-50 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 py-2.5 px-4 font-medium rounded-xl transition-colors ${style.confirmBtn}`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
