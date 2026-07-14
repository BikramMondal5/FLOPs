import type { FinancialDashboardDTO } from "@/features/analytics/dto/dashboard.dto";
import type { BudgetDashboardDTO } from "@/features/budget/dto/budget-dashboard.dto";
import type { GoalDashboardDTO } from "@/features/goals/dto/goal-dashboard.dto";

export function buildDashboardPrompt(
  analytics: FinancialDashboardDTO,
  budget: BudgetDashboardDTO,
  goals: GoalDashboardDTO
): string {
  return `
You are an expert financial planning advisor. Analyze the following user financial data and output a structured JSON response matching the expected schema.

## Financial Context

### 1. Analytics Summary
- Total Assets / Balance: ₹${analytics.summary.totalBalance}
- Monthly Income: ₹${analytics.summary.totalIncome}
- Monthly Expense: ₹${analytics.summary.totalExpenses}
- Net Savings: ₹${analytics.summary.netSavings}
- Savings Rate: ${analytics.summary.savingsRate}%
- Average Daily Spending: ₹${analytics.summary.avgDailySpending}

### 2. Category Breakdown
${analytics.categories.map((c) => `- ${c.category}: spent ₹${c.spent} (${c.percentage.toFixed(0)}%)`).join("\n")}

### 3. Active Budgets
- Overall utilization progress: ${budget.summary.overallHealthProgress}%
${budget.budgets.map((b) => `- Budget Name: ${b.budget.name}, Limit: ₹${b.budget.budgetAmount}, Spent: ₹${b.spent}, Status: ${b.status}`).join("\n")}

### 4. Active Savings Goals
- Goal progress average: ${goals.summary.averageProgressPercentage}%
${goals.goals.map((g) => `- Goal Name: ${g.goal.name}, Target: ₹${g.goal.targetAmount}, Saved: ₹${g.saved}, Health: ${g.health}, Success Probability: ${g.successProbability}%`).join("\n")}

## Required Output Schema (JSON Only):
Provide exactly this JSON object structure. Do not wrap in backticks or markdown, output only valid JSON.
{
  "financialSummary": {
    "overallStance": "String summarizing general health, e.g., Stable, Deficit Risk",
    "achievements": ["achievement bullet 1", "achievement bullet 2"],
    "primaryConcerns": ["concern bullet 1"],
    "actionableStep": "single primary action string"
  },
  "monthlyReview": {
    "summaryParagraph": "Natural language summary paragraph of the user's month.",
    "topExpenseCategory": "Category name",
    "topIncomeSource": "Salary/Investment etc",
    "budgetPerformanceNotice": "Summary sentence of budget status",
    "goalHealthNotice": "Summary sentence of goals status"
  },
  "recommendations": [
    { "category": "String", "type": "positive/warning/neutral", "message": "Short warning or positive note" }
  ],
  "risks": [
    { "level": "High/Medium/Low", "trigger": "Risk trigger", "message": "Expected impact text" }
  ],
  "opportunities": [
    { "category": "String", "suggestion": "String", "projectedSavings": 1500 }
  ],
  "financialHealthExplanation": "Natural language review explaining details of the health score"
}
`;
}
