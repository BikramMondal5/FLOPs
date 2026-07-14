import { getDashboardAnalyticsService } from "@/features/analytics/services/analytics.service";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import OverviewClient from "./OverviewClient";

export default async function OverviewDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const response = await getDashboardAnalyticsService(session.user.id, "This Month");
  
  if (!response.success || !response.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="bg-white p-8 rounded-2xl border border-[#F6B7CF]/10 shadow-sm text-center">
          <h2 className="text-xl font-bold text-zinc-800">Overview Setup Failure</h2>
          <p className="text-sm text-zinc-500 mt-2">Could not compute your analytics dashboard summary.</p>
        </div>
      </div>
    );
  }

  return (
    <OverviewClient
      initialData={response.data}
      userName={session.user.name || "Bikram"}
    />
  );
}
