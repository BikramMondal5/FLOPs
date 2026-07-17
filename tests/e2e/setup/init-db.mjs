import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import crypto from "crypto";

const stateFile = process.argv[2] || "tests/e2e/.e2e-state.json";

async function main() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("flops");

  const { default: bcrypt } = await import("bcryptjs");
  const hashedPassword = await bcrypt.hash("Test@12345", 12);
  const userId = crypto.randomUUID();

  await db.collection("users").insertOne({
    _id: userId, name: "Test User", email: "testuser@example.com",
    password: hashedPassword, role: "user", currency: "INR", country: "India",
    language: "English", timezone: "Asia/Kolkata", createdAt: new Date(), updatedAt: new Date(),
  });

  const now = new Date();
  const sMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const eMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const a1 = crypto.randomUUID(), a2 = crypto.randomUUID();

  await db.collection("financial_accounts").insertMany([
    { _id: a1, userId, name: "Main Savings", institution: "HDFC Bank", type: "Savings", currency: "INR", balance: 50000, color: "#D46A96", icon: "bank", description: "Primary savings account", isArchived: false, createdAt: now, updatedAt: now },
    { _id: a2, userId, name: "Daily Wallet", institution: "Paytm", type: "Wallet", currency: "INR", balance: 25000, color: "#6B7280", icon: "wallet", description: "Daily spending wallet", isArchived: false, createdAt: now, updatedAt: now },
  ]);

  await db.collection("transactions").insertMany([
    { userId, accountId: a1, type: "Income", category: "Salary", amount: 75000, merchant: "Employer Corp", paymentMethod: "Bank Transfer", transactionDate: sMonth.toISOString(), notes: "Monthly salary", location: "Mumbai", isArchived: false, createdAt: now, updatedAt: now },
    { userId, accountId: a2, type: "Expense", category: "Food & Dining", amount: 1200, merchant: "Local Restaurant", paymentMethod: "UPI", transactionDate: new Date(now.getTime() - 864e5 * 2).toISOString(), notes: "Team lunch", location: "Bangalore", isArchived: false, createdAt: now, updatedAt: now },
    { userId, accountId: a2, type: "Expense", category: "Shopping", amount: 3500, merchant: "Amazon", paymentMethod: "Credit Card", transactionDate: new Date(now.getTime() - 864e5 * 5).toISOString(), notes: "Weekly groceries", location: "Online", isArchived: false, createdAt: now, updatedAt: now },
    { userId, accountId: a1, type: "Income", category: "Freelance", amount: 15000, merchant: "Freelance Client", paymentMethod: "Bank Transfer", transactionDate: new Date(now.getTime() - 864e5 * 10).toISOString(), notes: "Project payment", location: "Remote", isArchived: false, createdAt: now, updatedAt: now },
    { userId, accountId: a2, type: "Expense", category: "Bills & Utilities", amount: 2500, merchant: "Electricity Board", paymentMethod: "Auto Debit", transactionDate: new Date(now.getTime() - 864e5 * 7).toISOString(), notes: "Monthly electricity bill", location: "Home", isArchived: false, createdAt: now, updatedAt: now },
  ]);

  await db.collection("budgets").insertMany([
    { userId, name: "Monthly Food Budget", category: "Food & Dining", budgetAmount: 15000, period: "Monthly", startDate: sMonth, endDate: eMonth, alertThreshold: 80, createdAt: now, updatedAt: now },
    { userId, name: "Utility Bills", category: "Bills & Utilities", budgetAmount: 8000, period: "Monthly", startDate: sMonth, endDate: eMonth, alertThreshold: 80, createdAt: now, updatedAt: now },
  ]);

  await db.collection("goals").insertMany([
    { userId, name: "Emergency Fund", category: "Emergency Fund", targetAmount: 100000, currentContribution: 25000, targetDate: new Date(now.getFullYear() + 1, 11, 31), priority: "High", status: "Active", color: "#D46A96", createdAt: now, updatedAt: now },
    { userId, name: "New Laptop", category: "Electronics", targetAmount: 50000, currentContribution: 15000, targetDate: new Date(now.getFullYear(), 11, 31), priority: "Medium", status: "Active", color: "#6B7280", createdAt: now, updatedAt: now },
  ]);

  await db.collection("notifications").insertMany([
    { userId, type: "budget_alert", title: "Budget Alert", message: "You have used 85% of your Food & Dining budget", priority: "high", read: false, createdAt: now },
    { userId, type: "goal_milestone", title: "Goal Progress", message: "Emergency Fund is 25% complete. Keep saving!", priority: "medium", read: false, createdAt: now },
    { userId, type: "ai_recommendation", title: "AI Insight", message: "Consider reducing Shopping expenses to meet your Laptop goal faster.", priority: "low", read: true, createdAt: now },
  ]);

  await client.close();

  const { writeFileSync, unlinkSync } = await import("fs");
  const { join } = await import("path");
  const sf = join(process.cwd(), stateFile);
  writeFileSync(sf, JSON.stringify({ uri, pid: process.pid }));

  console.log("DB_READY " + uri);

  const cleanup = async () => {
    try { unlinkSync(sf); } catch {}
    await mongod.stop({ force: true });
    process.exit(0);
  };

  process.on("SIGTERM", cleanup);
  process.on("SIGINT", cleanup);

  await new Promise(() => {});
}

main().catch((err) => {
  console.error("DB INIT FAILED:", err);
  process.exit(1);
});
