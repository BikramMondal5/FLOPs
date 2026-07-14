import type { HealthScoreDTO } from "../dto/dashboard.dto";

export function calculateHealthScore(
  totalIncome: number,
  totalExpense: number,
  savingsRate: number,
  accountsCount: number
): HealthScoreDTO {
  let score = 50; // base score

  // 1. Savings Rate weight (max 30 points)
  if (savingsRate >= 30) score += 30;
  else if (savingsRate > 0) score += Math.round(savingsRate);

  // 2. Income-to-Expense ratio weight (max 30 points)
  const ratio = totalIncome > 0 ? totalIncome / Math.max(1, totalExpense) : 0;
  if (ratio >= 2) score += 30;
  else if (ratio > 1) score += Math.round((ratio - 1) * 30);
  else score -= Math.round((1 - ratio) * 20); // penalty for deficit

  // 3. Diversification weight (max 10 points)
  if (accountsCount >= 3) score += 10;
  else if (accountsCount > 0) score += accountsCount * 3;

  // Enforce boundary limits
  score = Math.max(0, Math.min(100, score));

  // Rate categorization
  let rating: HealthScoreDTO["rating"] = "Average";
  if (score >= 80) rating = "Excellent";
  else if (score >= 65) rating = "Good";
  else if (score < 40) rating = "Needs Attention";

  // Formulate textual insights
  const healthInsights: string[] = [];
  if (savingsRate < 10) {
    healthInsights.push("Your savings rate is low. Try trimming shopping or entertainment expenses.");
  } else if (savingsRate >= 25) {
    healthInsights.push("Excellent savings pattern! You are building assets stable and fast.");
  }

  if (ratio < 1 && totalIncome > 0) {
    healthInsights.push("Alert: You spent more than you earned this month. Review your subscription bills.");
  } else if (ratio >= 1.5) {
    healthInsights.push("Healthy flow: Your earnings cleanly cover active expenses.");
  }

  if (accountsCount < 2) {
    healthInsights.push("Tip: Create a separate cash wallet or savings account for better tracking.");
  }

  return {
    score,
    rating,
    savingsRate,
    incomeExpenseRatio: ratio,
    burnRate: totalExpense,
    healthInsights,
  };
}
