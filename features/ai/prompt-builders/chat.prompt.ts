import type { FinancialDashboardDTO } from "@/features/analytics/dto/dashboard.dto";
import type { BudgetDashboardDTO } from "@/features/budget/dto/budget-dashboard.dto";
import type { GoalDashboardDTO } from "@/features/goals/dto/goal-dashboard.dto";
import { ChatMessage } from "../types/ai.types";

export function buildChatPrompt(
  analytics: FinancialDashboardDTO,
  budget: BudgetDashboardDTO,
  goals: GoalDashboardDTO,
  history: ChatMessage[],
  userMessage: string
): string {
  const historyString = history
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  return `
You are a helpful personal finance assistant integrated inside the FLOPs Financial Operating System.
Ground all your responses in the user's computed financial metrics. Do not invent balances or accounts.

## User's Financial Position
- Total Assets / Balance: ₹${analytics.summary.totalBalance}
- Monthly Income: ₹${analytics.summary.totalIncome}
- Monthly Expense: ₹${analytics.summary.totalExpenses}
- Net Savings: ₹${analytics.summary.netSavings}
- Savings Rate: ${analytics.summary.savingsRate}%

### Spending categories
${analytics.categories.map((c) => `- ${c.category}: ₹${c.spent}`).join("\n")}

### Budget statuses
${budget.budgets.map((b) => `- ${b.budget.name}: limit ₹${b.budget.budgetAmount}, spent ₹${b.spent}, status ${b.status}`).join("\n")}

### Goals
${goals.goals.map((g) => `- ${g.goal.name}: target ₹${g.goal.targetAmount}, saved ₹${g.saved}, probability ${g.successProbability}%`).join("\n")}

## Conversation History
${historyString}

## User Question:
${userMessage}

## Required Output Schema (JSON Only):
Provide exactly this JSON object structure. Do not wrap in backticks, output only valid JSON.
{
  "response": "Conversational assistant response string. Enforce friendly tone.",
  "suggestedPrompts": ["Short suggested follow-up question 1", "Short suggested follow-up question 2"]
}
`;
}
