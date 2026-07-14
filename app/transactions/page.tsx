import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import Sidebar from "@/components/dashboard/Sidebar";
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

      {/* Top Navbar */}
      <nav
        className="sticky top-0 z-30 mx-auto flex w-full items-center justify-between px-6 md:px-8 border-b border-[#F6B7CF]/10 bg-[#FCFCFD]/80 backdrop-blur-md shrink-0"
        style={{ height: "72px" }}
      >
        <Link href="/" className="flex items-center gap-2 no-underline z-10 relative">
          <Image
            src="/logo.png"
            alt="FLOPs logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-contain"
            priority
          />
          <span
            className="font-medium text-[#18181B]"
            style={{ fontFamily: "var(--font-body)", fontSize: "18px", letterSpacing: "-0.01em" }}
          >
            FLOPs
          </span>
        </Link>

        {/* User Info profile */}
        <div className="flex items-center gap-3 z-10 relative">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-semibold text-[#18181B] m-0 leading-none">
              {session.user.name}
            </p>
            <p className="text-[11px] text-[#9CA3AF] m-0 mt-0.5 leading-none">
              {session.user.email}
            </p>
          </div>
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User"}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full border-2 border-[#F6B7CF]/30 object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#FFF4F8] border-2 border-[#F6B7CF]/30 flex items-center justify-center text-[#D46A96] text-[14px] font-bold">
              {session.user.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
          )}
        </div>
      </nav>

      {/* Grid workspace */}
      <div className="flex-1 flex flex-col lg:flex-row p-6 md:p-8 gap-6 md:gap-8 relative z-10">
        {/* Fixed left sidebar */}
        <div className="hidden lg:block z-20 fixed left-6 md:left-8 top-[96px] w-[280px] h-[calc(100vh-128px)]">
          <Sidebar />
        </div>

        {/* Dynamic content column */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8 z-10 lg:pl-[304px]">
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
