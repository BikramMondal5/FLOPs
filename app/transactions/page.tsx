import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Suspense } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/common/Navbar";
import TransactionsClient from "@/components/transactions/TransactionsClient";

import { getAccountsService } from "@/features/accounts/services/account.service";
import { getTransactionsService } from "@/features/transactions/services/transaction.service";
import type { AccountDTO } from "@/features/accounts/types/account.types";
import type { PaginatedTransactions } from "@/features/transactions/types/transaction.types";

export const metadata = {
  title: "Ledger Transactions — FLOPs",
  description: "Unified ledger view of all cashflows and account statements.",
};

export default async function TransactionsPage() {
  const session = await auth();

  // Route protection
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Pre-fetch lists server-side
  let initialData: PaginatedTransactions = {
    transactions: [],
    pagination: {
      page: 1,
      limit: 20,
      totalCount: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
  };

  let accounts: AccountDTO[] = [];

  const [txRes, accRes] = await Promise.all([
    getTransactionsService(session.user.id, { page: "1", limit: "20" }),
    getAccountsService(session.user.id, { archived: "false" }),
  ]);

  if (txRes.success && txRes.data) {
    initialData = txRes.data;
  }
  if (accRes.success && accRes.data) {
    accounts = accRes.data;
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{
        backgroundColor: "#FCFCFD",
        backgroundImage: `
          linear-gradient(to right, rgba(246, 183, 207, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(246, 183, 207, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
      }}
    >
      {/* Background soft pink glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none z-0 bg-radial from-[#F6B7CF]/10 to-transparent filter blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full pointer-events-none z-0 bg-radial from-[#F9DCE7]/15 to-transparent filter blur-[140px]" />

      <Navbar
        userInfo={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
      />

      {/* Main Grid Layout Container with top padding for fixed navbar */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-12 pt-28 relative z-10">
        {/* Desktop Sidebar (Left) - Fixed */}
        <div className="hidden lg:block z-20 fixed left-6 md:left-8 xl:left-12 top-[88px] w-[280px] h-[calc(100vh-120px)]">
          <Sidebar />
        </div>

        {/* Main Content with left margin to account for fixed sidebar */}
        <div className="lg:ml-[304px] flex flex-col gap-6 md:gap-8 z-10">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1
                className="text-4xl md:text-5xl font-normal text-[#18181B] m-0 tracking-tight leading-none"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Transactions
              </h1>
              <p className="text-[13px] text-[#6B7280] mt-2 m-0 max-w-[480px] leading-relaxed">
                Log statements, edit transactions, and audit cashflows. Everything updates automatically in real-time.
              </p>
            </div>
          </header>

          <Suspense fallback={<LedgerLoadingSkeleton />}>
            <TransactionsClient initialData={initialData} accounts={accounts} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function LedgerLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 h-[120px]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-[24px] border border-[#F6B7CF]/15 h-full" />
        ))}
      </div>
      <div className="h-12 bg-white rounded-2xl border border-[#F6B7CF]/15" />
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-[24px] border border-[#F6B7CF]/15 h-20" />
        ))}
      </div>
    </div>
  );
}
