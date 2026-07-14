"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface TransactionPaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  onPageChange: (val: number) => void;
}

export default function TransactionPagination({
  page,
  totalPages,
  totalCount,
  limit,
  onPageChange,
}: TransactionPaginationProps) {
  if (totalPages <= 1) return null;

  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, totalCount);

  return (
    <div className="flex items-center justify-between border-t border-[#F6B7CF]/10 pt-4 px-2 mt-2">
      <span className="text-[11px] font-semibold text-zinc-500">
        Showing {startIdx}-{endIdx} of {totalCount} records
      </span>

      <div className="flex items-center gap-1.5">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="w-8 h-8 rounded-xl border border-zinc-200 flex items-center justify-center text-[#18181B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-[11.5px] font-bold text-zinc-700 px-2">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="w-8 h-8 rounded-xl border border-zinc-200 flex items-center justify-center text-[#18181B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
