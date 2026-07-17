import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import OverviewClient from "./OverviewClient";

export const metadata = {
  title: "Overview — FLOPs",
  description: "Your financial overview dashboard.",
};

export default async function OverviewDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return (
    <OverviewClient
      userName={session.user.name || ""}
      userEmail={session.user.email || undefined}
      userImage={session.user.image || null}
    />
  );
}
