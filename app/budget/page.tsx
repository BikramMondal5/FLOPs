import { getBudgetDashboardService } from "@/features/budget/services/budget.service";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import BudgetClient from "./BudgetClient";

export default async function BudgetPlannerPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const response = await getBudgetDashboardService(session.user.id);

  if (!response.success || !response.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="bg-white p-8 rounded-2xl border border-[#F6B7CF]/10 shadow-sm text-center">
          <h2 className="text-xl font-bold text-zinc-800">Budget Setup Failure</h2>
          <p className="text-sm text-zinc-500 mt-2">Could not compute your smart budget engine metrics.</p>
        </div>
      </div>
    );
  }

  return (
    <BudgetClient
      initialData={response.data}
      userName={session.user.name || "Bikram"}
      userEmail={session.user.email || undefined}
      userImage={session.user.image || null}
    />
  );
}
