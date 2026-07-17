import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const STATE_FILE = path.join(process.cwd(), "tests/e2e/.e2e-state.json");
const SEED_USER = {
  _id: crypto.randomUUID(),
  name: "Test User",
  email: "testuser@example.com",
  password: "", // set below
  role: "user",
  currency: "INR",
  country: "India",
  language: "English",
  timezone: "Asia/Kolkata",
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function hashPassword(password) {
  const { createHash } = await import("crypto");
  const { default: bcrypt } = await import("bcryptjs");
  return bcrypt.hash(password, 12);
}

async function seedData(db) {
  const hashedPassword = await hashPassword("Test@12345");
  SEED_USER.password = hashedPassword;

  const usersCol = db.collection("users");
  const accountsCol = db.collection("financial_accounts");
  const transactionsCol = db.collection("transactions");
  const budgetsCol = db.collection("budgets");
  const goalsCol = db.collection("goals");
  const notificationsCol = db.collection("notifications");

  await usersCol.insertOne({ ...SEED_USER });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const account1Id = crypto.randomUUID();
  const account2Id = crypto.randomUUID();

  await accountsCol.insertMany([
    {
      _id: account1Id,
      userId: SEED_USER._id,
      name: "Main Savings",
      institution: "HDFC Bank",
      type: "Savings",
      currency: "INR",
      balance: 50000,
      color: "#D46A96",
      icon: "bank",
      description: "Primary savings account",
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: account2Id,
      userId: SEED_USER._id,
      name: "Daily Wallet",
      institution: "Paytm",
      type: "Wallet",
      currency: "INR",
      balance: 25000,
      color: "#6B7280",
      icon: "wallet",
      description: "Daily spending wallet",
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  await transactionsCol.insertMany([
    {
      userId: SEED_USER._id,
      accountId: account1Id,
      type: "Income",
      category: "Salary",
      amount: 75000,
      merchant: "Employer Corp",
      paymentMethod: "Bank Transfer",
      transactionDate: startOfMonth.toISOString(),
      notes: "Monthly salary",
      location: "Mumbai",
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId: SEED_USER._id,
      accountId: account2Id,
      type: "Expense",
      category: "Food & Dining",
      amount: 1200,
      merchant: "Local Restaurant",
      paymentMethod: "UPI",
      transactionDate: new Date(now.getTime() - 86400000 * 2).toISOString(),
      notes: "Team lunch",
      location: "Bangalore",
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId: SEED_USER._id,
      accountId: account2Id,
      type: "Expense",
      category: "Shopping",
      amount: 3500,
      merchant: "Amazon",
      paymentMethod: "Credit Card",
      transactionDate: new Date(now.getTime() - 86400000 * 5).toISOString(),
      notes: "Weekly groceries",
      location: "Online",
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId: SEED_USER._id,
      accountId: account1Id,
      type: "Income",
      category: "Freelance",
      amount: 15000,
      merchant: "Freelance Client",
      paymentMethod: "Bank Transfer",
      transactionDate: new Date(now.getTime() - 86400000 * 10).toISOString(),
      notes: "Project payment",
      location: "Remote",
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId: SEED_USER._id,
      accountId: account2Id,
      type: "Expense",
      category: "Bills & Utilities",
      amount: 2500,
      merchant: "Electricity Board",
      paymentMethod: "Auto Debit",
      transactionDate: new Date(now.getTime() - 86400000 * 7).toISOString(),
      notes: "Monthly electricity bill",
      location: "Home",
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  await budgetsCol.insertMany([
    {
      userId: SEED_USER._id,
      name: "Monthly Food Budget",
      category: "Food & Dining",
      budgetAmount: 15000,
      period: "Monthly",
      startDate: startOfMonth,
      endDate: endOfMonth,
      alertThreshold: 80,
      createdAt: now,
      updatedAt: now,
    },
    {
      userId: SEED_USER._id,
      name: "Utility Bills",
      category: "Bills & Utilities",
      budgetAmount: 8000,
      period: "Monthly",
      startDate: startOfMonth,
      endDate: endOfMonth,
      alertThreshold: 80,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  await goalsCol.insertMany([
    {
      userId: SEED_USER._id,
      name: "Emergency Fund",
      category: "Emergency Fund",
      targetAmount: 100000,
      currentContribution: 25000,
      targetDate: new Date(now.getFullYear() + 1, 11, 31),
      priority: "High",
      status: "Active",
      color: "#D46A96",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId: SEED_USER._id,
      name: "New Laptop",
      category: "Electronics",
      targetAmount: 50000,
      currentContribution: 15000,
      targetDate: new Date(now.getFullYear(), 11, 31),
      priority: "Medium",
      status: "Active",
      color: "#6B7280",
      createdAt: now,
      updatedAt: now,
    },
  ]);

  await notificationsCol.insertMany([
    {
      userId: SEED_USER._id,
      type: "budget_alert",
      title: "Budget Alert",
      message: "You have used 85% of your Food & Dining budget",
      priority: "high",
      read: false,
      createdAt: now,
    },
    {
      userId: SEED_USER._id,
      type: "goal_milestone",
      title: "Goal Progress",
      message: "Emergency Fund is 25% complete. Keep saving!",
      priority: "medium",
      read: false,
      createdAt: now,
    },
    {
      userId: SEED_USER._id,
      type: "ai_recommendation",
      title: "AI Insight",
      message: "Consider reducing Shopping expenses to meet your Laptop goal faster.",
      priority: "low",
      read: true,
      createdAt: now,
    },
  ]);
}

async function main() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("flops");

  await seedData(db);
  await client.close();

  fs.writeFileSync(STATE_FILE, JSON.stringify({ uri, pid: process.pid }));

  const nextProcess = spawn("npx", ["next", "dev", "-p", "3000"], {
    stdio: "inherit",
    env: {
      ...process.env,
      MONGODB_URI: uri,
      AUTH_SECRET: "e2e-test-secret-flops-2024",
      NEXTAUTH_URL: "http://localhost:3000",
      NODE_ENV: "development",
    },
    shell: false,
  });

  const cleanup = () => {
    try { fs.unlinkSync(STATE_FILE); } catch {}
    try { mongod.stop({ force: true }); } catch {}
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("exit", cleanup);

  nextProcess.on("exit", (code) => {
    cleanup();
    process.exit(code ?? 0);
  });
}

main().catch((err) => {
  console.error("E2E setup failed:", err);
  process.exit(1);
});
