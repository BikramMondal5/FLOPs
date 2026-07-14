import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import AccountsClient from "@/components/accounts/AccountsClient";

import { getAccountsService } from "@/features/accounts/services/account.service";
import type { AccountDTO } from "@/features/accounts/types/account.types";

// ─────────────────────────────────────────────
// Page Metadata
// ─────────────────────────────────────────────
export const metadata = {
  title: "Accounts — FLOPs",
  description:
    "Manage your financial accounts — savings, current, wallets, credit cards, investments, and more.",
};

// ─────────────────────────────────────────────
// Server Component — fetches accounts server-side
// ─────────────────────────────────────────────
export default async function AccountsPage() {
  const session = await auth();

  // Redirect unauthenticated users to login
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Fetch accounts server-side (no extra round-trip on load)
  let initialAccounts: AccountDTO[] = [];
  const result = await getAccountsService(session.user.id, { archived: "false", sort: "createdAt_desc" });
  if (result.success) {
    initialAccounts = result.data;
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
      {/* Background radial glows */}
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

        {/* User info */}
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

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row p-6 md:p-8 gap-6 md:gap-8 relative z-10">
        {/* Desktop Sidebar — fixed */}
        <div className="hidden lg:block z-20 fixed left-6 md:left-8 top-[96px] w-[280px] h-[calc(100vh-128px)]">
          <Sidebar />
        </div>

        {/* Main workspace */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8 z-10 lg:pl-[304px]">
          {/* Page header */}
          <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1
                className="text-4xl md:text-5xl font-normal text-[#18181B] m-0 tracking-tight leading-none"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Accounts
              </h1>
              <p className="text-[13px] text-[#6B7280] mt-2 m-0 max-w-[480px] leading-relaxed">
                Your financial accounts are the foundation of FLOPs. Every transaction, budget, and goal is linked to an account.
              </p>
            </div>

            {/* Account count badge */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[12px] font-semibold text-[#9CA3AF] bg-white border border-[#F6B7CF]/20 px-3 py-1.5 rounded-full shadow-sm">
                {initialAccounts.length} account{initialAccounts.length !== 1 ? "s" : ""}
              </span>
            </div>
          </header>

          {/* Client-side interactive section */}
          <Suspense fallback={<AccountsLoadingSkeleton />}>
            <AccountsClient initialAccounts={initialAccounts} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Loading skeleton
// ─────────────────────────────────────────────
function AccountsLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-[20px] h-28 border border-[#F6B7CF]/15" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-[24px] h-52 border border-[#F6B7CF]/15" />
        ))}
      </div>
    </div>
  );
}
