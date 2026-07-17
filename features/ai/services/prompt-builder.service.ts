import type { FinancialContext } from "./context-builder.service";

/**
 * Build the system prompt for FLOPs AI Assistant
 */
export function buildSystemPrompt(): string {
  return `You are FLOPs AI, a helpful personal finance assistant.

Your role:
- Answer questions using ONLY the supplied financial information
- Never invent balances, transactions, or data
- If information is unavailable, clearly state that
- Always explain your recommendations with reasoning
- Prefer practical and actionable advice
- Keep answers concise unless asked for detailed explanations
- Use friendly, conversational language
- Format currency amounts with ₹ symbol (Indian Rupees)

Guidelines:
- When discussing spending, reference specific categories and amounts
- When suggesting savings, provide concrete steps
- When analyzing trends, use the data provided
- Be encouraging but honest about financial situations
- If the user has no data, guide them to start tracking their finances`;
}

/**
 * Format financial context into a structured prompt
 */
export function formatFinancialContext(context: FinancialContext): string {
  const sections: string[] = [];

  // Context metadata
  sections.push(`Financial Data Version: ${context.version}
Generated: ${new Date(context.generatedAt).toLocaleString("en-IN")}`);

  // Profile
  sections.push(`\nUser Profile:
- Name: ${context.profile.name}`);

  // Accounts
  if (context.accounts.totalAccounts > 0) {
    sections.push(`\nAccounts Summary:
- Total Accounts: ${context.accounts.totalAccounts}
- Net Worth: ₹${context.accounts.totalBalance.toLocaleString("en-IN")}
- Accounts:
${context.accounts.accountsList
  .map(
    (acc) =>
      `  - ${acc.name} (${acc.type}): ₹${acc.balance.toLocaleString("en-IN")}`
  )
  .join("\n")}`);
  } else {
    sections.push(`\nAccounts: No accounts created yet`);
  }

  // Transactions
  if (context.transactions.recentCount > 0) {
    sections.push(`\nRecent Financial Activity:
- Total Income: ₹${context.transactions.totalIncome.toLocaleString("en-IN")}
- Total Expenses: ₹${context.transactions.totalExpenses.toLocaleString("en-IN")}
- Net: ₹${(context.transactions.totalIncome - context.transactions.totalExpenses).toLocaleString("en-IN")}
- Recent Transactions (last ${context.transactions.recentTransactions.length}):
${context.transactions.recentTransactions
  .map(
    (t) =>
      `  - ${t.date}: ${t.merchant} - ${t.type === "Income" ? "+" : "-"}₹${t.amount.toLocaleString("en-IN")} (${t.category})`
  )
  .join("\n")}`);
  } else {
    sections.push(`\nTransactions: No transactions recorded yet`);
  }

  // Analytics
  if (context.analytics.monthlySpending > 0) {
    sections.push(`\nSpending Analytics:
- Monthly Spending: ₹${context.analytics.monthlySpending.toLocaleString("en-IN")}
- Savings Rate: ${context.analytics.savingsRate.toFixed(1)}%
- Average Daily Spending: ₹${context.analytics.avgDailySpending.toLocaleString("en-IN")}
${
  context.analytics.topCategories.length > 0
    ? `- Top Spending Categories:
${context.analytics.topCategories
  .map((cat) => `  - ${cat.category}: ₹${cat.spent.toLocaleString("en-IN")} (${cat.percentage.toFixed(1)}%)`)
  .join("\n")}`
    : ""
}`);
  }

  // Budgets
  if (context.budgets.length > 0) {
    sections.push(`\nBudgets:
${context.budgets
  .map(
    (b) =>
      `- ${b.name} (${b.category}): ₹${b.spent.toLocaleString("en-IN")} / ₹${b.budgetAmount.toLocaleString("en-IN")} (${b.utilization.toFixed(1)}% used, ₹${b.remaining.toLocaleString("en-IN")} remaining)`
  )
  .join("\n")}`);
  } else {
    sections.push(`\nBudgets: No budgets created yet`);
  }

  // Goals
  if (context.goals.length > 0) {
    sections.push(`\nFinancial Goals:
${context.goals
  .map(
    (g) =>
      `- ${g.title}: ₹${g.saved.toLocaleString("en-IN")} / ₹${g.targetAmount.toLocaleString("en-IN")} (${g.progress.toFixed(1)}% complete, ${g.etaMonths} months remaining, status: ${g.status})`
  )
  .join("\n")}`);
  } else {
    sections.push(`\nGoals: No financial goals set yet`);
  }

  return sections.join("\n");
}

/**
 * Build complete prompt for user query
 */
export function buildChatPrompt(
  context: FinancialContext,
  userMessage: string
): string {
  const systemPrompt = buildSystemPrompt();
  const contextData = formatFinancialContext(context);

  return `${systemPrompt}

${contextData}

User Question: ${userMessage}

Provide a helpful, accurate response based on the above financial information.`;
}

/**
 * Generate suggested follow-up questions based on context
 */
export function generateSuggestedQuestions(context: FinancialContext): string[] {
  const suggestions: string[] = [];

  // Default suggestions
  if (context.transactions.recentCount > 0) {
    suggestions.push("How can I save more money?");
  }

  if (context.budgets.length > 0) {
    const overBudget = context.budgets.find((b) => b.utilization > 100);
    if (overBudget) {
      suggestions.push(`Why did I overspend on ${overBudget.category}?`);
    } else {
      suggestions.push("How is my budget looking this month?");
    }
  }

  if (context.goals.length > 0) {
    const firstGoal = context.goals[0];
    suggestions.push(`Am I on track for my ${firstGoal.title} goal?`);
  }

  if (context.analytics.topCategories.length > 0) {
    const topCategory = context.analytics.topCategories[0];
    suggestions.push(`Why am I spending so much on ${topCategory.category}?`);
  }

  // Fallback suggestions
  if (suggestions.length === 0) {
    suggestions.push("How can I start tracking my finances?");
    suggestions.push("What should I do first?");
    suggestions.push("How do I create a budget?");
  }

  return suggestions.slice(0, 3); // Return max 3 suggestions
}
