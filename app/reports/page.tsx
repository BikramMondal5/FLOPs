import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <ReportsClient
      userName={session.user.name || "User"}
      userEmail={session.user.email || undefined}
      userImage={session.user.image}
    />
  );
}
