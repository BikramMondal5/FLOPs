import { getGoalsDashboardService } from "@/features/goals/services/goal.service";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import GoalsClient from "./GoalsClient";

export default async function FinancialGoalsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const response = await getGoalsDashboardService(session.user.id);

  if (!response.success || !response.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="bg-white p-8 rounded-2xl border border-[#F6B7CF]/10 shadow-sm text-center">
          <h2 className="text-xl font-bold text-zinc-800">Goals Setup Failure</h2>
          <p className="text-sm text-zinc-500 mt-2">Could not compute your smart savings engine metrics.</p>
        </div>
      </div>
    );
  }

  return (
    <GoalsClient
      initialData={response.data}
      userName={session.user.name || "Bikram"}
      userEmail={session.user.email || undefined}
      userImage={session.user.image || null}
    />
  );
}
