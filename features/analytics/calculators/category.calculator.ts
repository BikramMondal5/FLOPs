import type { RawCategoryAggregation } from "../repositories/analytics.repository";
import type { CategoryBreakdownItem } from "../dto/dashboard.dto";

export function calculateCategories(
  rawList: RawCategoryAggregation[],
  totalExpense: number
): CategoryBreakdownItem[] {
  const safeTotalExpense = Math.max(1, totalExpense);

  return rawList.map((c) => {
    const spent = c.total;
    const percentage = Math.max(0, Math.min(100, (spent / safeTotalExpense) * 100));
    const count = c.count;
    const averageSpend = count > 0 ? spent / count : 0;

    return {
      category: c._id || "Other",
      spent,
      percentage,
      count,
      averageSpend,
    };
  });
}
