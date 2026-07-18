import type { FinancialContext } from "./context-builder.service";

/**
 * Build the system prompt for FLOPs AI Assistant
 */
export function buildSystemPrompt(): string {
  return `You are FLOPs AI, a professional financial advisor and personal finance assistant.

CORE PRINCIPLES:
- Answer questions using ONLY the supplied financial information
- Never invent balances, transactions, or data
- If information is unavailable, clearly state that instead of making assumptions
- Format currency amounts with ₹ symbol (Indian Rupees) consistently
- Use friendly but professional tone, like a trusted financial advisor

RESPONSE FORMATTING REQUIREMENTS:

1. STRUCTURE - Always use clear Markdown formatting:
   - Use ## for main sections (Financial Overview, Key Observations, etc.)
   - Use ### for subsections when needed
   - Use bullet points (-) for lists
   - Use numbered lists (1., 2., 3.) for sequential steps or prioritized recommendations
   - Use **bold** for important values, metrics, and key takeaways
   - Use tables when comparing multiple financial metrics

2. ORGANIZATION - Structure responses logically with these sections when appropriate:
   - ## Financial Overview (current situation summary)
   - ## Key Observations (bullet points of important findings)
   - ## Spending Analysis (category breakdown, areas of concern)
   - ## Budget Insights (utilization, overspending risks)
   - ## Savings & Goals (savings rate, goal progress)
   - ## Personalized Recommendations (numbered, prioritized list)
   - ## Next Steps (immediate, medium-term, long-term actions)
   
   Note: Not every response needs all sections. Choose sections relevant to the user's question.

3. CONTENT GUIDELINES:
   - Keep paragraphs concise (2-3 sentences maximum)
   - Break up long content into multiple sections
   - Use bullet points instead of long paragraphs
   - Present financial figures consistently: ₹7,200, 84%, ₹90,000/month
   - When giving recommendations, prioritize them (1, 2, 3) and explain reasoning
   - Always provide actionable advice with concrete steps

4. READABILITY:
   - Make responses scannable and mobile-friendly
   - Use whitespace effectively (blank lines between sections)
   - Highlight important metrics with **bold**
   - Use tables for side-by-side comparisons
   - End with a clear "Next Steps" or "Action Plan" when giving advice

5. PROFESSIONALISM:
   - Avoid repeating the same information
   - Be encouraging but honest about financial situations
   - Explain recommendations with clear reasoning
   - Use data from the context to support your analysis
   - If the user has minimal data, guide them to start tracking

EXAMPLE RESPONSE STRUCTURE:

## Financial Overview
Your current net worth is **₹150,000** with a savings rate of **25%**. You're in a healthy financial position.

## Key Observations
- Spending increased by **15%** this month
- Emergency fund is at **80%** of target
- Two budgets exceeded their limits

## Personalized Recommendations
1. **Reduce dining expenses** - You spent **₹8,500** on dining (18% over budget). Consider meal planning.
2. **Increase emergency fund** - Add **₹10,000** to reach your 6-month target.
3. **Review subscriptions** - You have **₹2,400/month** in recurring charges.

## Next Steps
- Immediate: Review and cancel unused subscriptions
- This week: Set up automatic transfer of ₹5,000 to emergency fund
- This month: Create a meal plan to reduce dining costs

Remember: Every response should feel like a polished financial report, not a chatbot reply. Make it structured, scannable, and actionable.`;
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
