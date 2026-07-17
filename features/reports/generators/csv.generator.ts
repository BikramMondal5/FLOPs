import type { FullReportDTO } from "../dto/report-dashboard.dto";

export function generateFinancialReportCSV(report: FullReportDTO): string {
  const lines: string[] = [];

  // ────────────────────────────────────────────
  // Summary Section
  // ────────────────────────────────────────────
  lines.push("Financial Report Summary");
  lines.push(`Generated,${new Date(report.generatedAt).toLocaleDateString("en-IN")}`);
  lines.push(`Report Type,${report.reportType}`);
  lines.push(`Period,${new Date(report.startDate).toLocaleDateString("en-IN")} - ${new Date(report.endDate).toLocaleDateString("en-IN")}`);
  lines.push("");
  lines.push("Metric,Value");
  lines.push(`Net Worth,₹${report.summary.netWorth.toLocaleString("en-IN")}`);
  lines.push(`Income,₹${report.summary.totalIncome.toLocaleString("en-IN")}`);
  lines.push(`Expenses,₹${report.summary.totalExpenses.toLocaleString("en-IN")}`);
  lines.push(`Savings Rate,${report.summary.savingsRate.toFixed(1)}%`);
  lines.push(`Daily Avg Spending,₹${report.summary.dailyAverageSpending.toLocaleString("en-IN")}`);
  lines.push(`Health Score,${report.summary.financialHealthScore || "N/A"}`);
  lines.push(`Budget Utilization,${report.summary.budgetUtilization.toFixed(1)}%`);
  lines.push(`Goal Progress,${report.summary.goalProgress.toFixed(1)}%`);
  lines.push("");

  // ────────────────────────────────────────────
  // Accounts Section
  // ────────────────────────────────────────────
  lines.push("Accounts");
  if (report.accounts.accountsList.length > 0) {
    lines.push("Account,Type,Balance");
    report.accounts.accountsList.forEach((acc) => {
      lines.push(`${acc.name},${acc.type},₹${acc.balance.toLocaleString("en-IN")}`);
    });
    lines.push(`Total Accounts,${report.accounts.totalAccounts},₹${report.accounts.totalBalance.toLocaleString("en-IN")}`);
    lines.push(`Largest Account,${report.accounts.largestAccount},`);
  } else {
    lines.push("No accounts found");
  }
  lines.push("");

  // ────────────────────────────────────────────
  // Budgets Section
  // ────────────────────────────────────────────
  lines.push("Budgets");
  if (report.budgets.budgets.length > 0) {
    lines.push("Category,Limit,Spent,Remaining,Utilization,Status");
    report.budgets.budgets.forEach((b) => {
      lines.push(
        `${b.category},₹${b.limit.toLocaleString("en-IN")},₹${b.spent.toLocaleString("en-IN")},₹${b.remaining.toLocaleString("en-IN")},${b.utilization.toFixed(1)}%,${b.status}`
      );
    });
    lines.push(
      `Total,₹${report.budgets.totalBudgetLimit.toLocaleString("en-IN")},₹${report.budgets.totalSpent.toLocaleString("en-IN")},₹${report.budgets.totalRemaining.toLocaleString("en-IN")},${report.budgets.overallUtilization.toFixed(1)}%,`
    );
  } else {
    lines.push("No budgets found");
  }
  lines.push("");

  // ────────────────────────────────────────────
  // Goals Section
  // ────────────────────────────────────────────
  lines.push("Goals");
  if (report.goals.goals.length > 0) {
    lines.push("Goal,Target,Saved,Remaining,Progress,ETA (months),Status");
    report.goals.goals.forEach((g) => {
      lines.push(
        `${g.name},₹${g.target.toLocaleString("en-IN")},₹${g.saved.toLocaleString("en-IN")},₹${g.remaining.toLocaleString("en-IN")},${g.progress.toFixed(1)}%,${g.etaMonths},${g.status}`
      );
    });
    lines.push(
      `Total,₹${report.goals.totalTargetAmount.toLocaleString("en-IN")},₹${report.goals.totalSaved.toLocaleString("en-IN")},₹${report.goals.totalRemaining.toLocaleString("en-IN")},${report.goals.averageProgress.toFixed(1)}%,,`
    );
  } else {
    lines.push("No goals found");
  }
  lines.push("");

  // ────────────────────────────────────────────
  // Analytics Section
  // ────────────────────────────────────────────
  lines.push("Top Spending Categories");
  if (report.analytics.topCategories.length > 0) {
    lines.push("Category,Amount,Percentage");
    report.analytics.topCategories.forEach((cat) => {
      lines.push(`${cat.category},₹${cat.spent.toLocaleString("en-IN")},${cat.percentage.toFixed(1)}%`);
    });
  } else {
    lines.push("No spending data available");
  }
  lines.push("");

  // ────────────────────────────────────────────
  // AI Summary Section
  // ────────────────────────────────────────────
  lines.push("AI Executive Summary");
  // Escape quotes and newlines for CSV
  const escapedSummary = report.aiSummary.replace(/"/g, '""').replace(/\n/g, " ");
  lines.push(`"${escapedSummary}"`);

  return lines.join("\n");
}
