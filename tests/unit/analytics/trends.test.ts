import { describe, test, expect } from "vitest";
import { calculateTrends } from "@/features/analytics/calculators/trends.calculator";

describe("Trends Calculator", () => {
  const refDate = new Date("2026-07-17T12:00:00Z"); // Friday, July 17, 2026

  test("Empty dataset: All periods remain zero", () => {
    const result = calculateTrends([], refDate);

    // Weekly: 7 days, all should be 0 Expense
    expect(result.weekly).toHaveLength(7);
    result.weekly.forEach((day) => {
      expect(day.Expense).toBe(0);
    });
    expect(result.weekly.map((d) => d.name)).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);

    // Monthly: 17 days (July 1st to July 17th), all should be 0 Expense
    expect(result.monthly).toHaveLength(17);
    result.monthly.forEach((day) => {
      expect(day.Expense).toBe(0);
    });
    expect(result.monthly[0].name).toBe("01");
    expect(result.monthly[16].name).toBe("17");

    // Yearly: 12 months, all should be 0 Expense
    expect(result.yearly).toHaveLength(12);
    result.yearly.forEach((month) => {
      expect(month.Expense).toBe(0);
    });
    expect(result.yearly.map((m) => m.name)).toEqual([
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]);
  });

  test("1 transaction: Ensure a single non-zero point is mapped correctly to its day", () => {
    const transactions = [
      {
        transactionDate: new Date("2026-07-17T10:00:00Z"), // Friday
        amount: 500,
        type: "Expense",
        isArchived: false,
      },
    ];

    const result = calculateTrends(transactions, refDate);

    // Weekly: Monday (Jul 13) to Sunday (Jul 19). Friday (index 4) should have 500.
    expect(result.weekly[4].name).toBe("Fri");
    expect(result.weekly[4].Expense).toBe(500);
    result.weekly.forEach((day, idx) => {
      if (idx !== 4) expect(day.Expense).toBe(0);
    });

    // Monthly: July 1 to 17. July 17 (index 16) should have 500.
    expect(result.monthly[16].name).toBe("17");
    expect(result.monthly[16].Expense).toBe(500);
    result.monthly.forEach((day, idx) => {
      if (idx !== 16) expect(day.Expense).toBe(0);
    });

    // Yearly: July (index 6) should have 500.
    expect(result.yearly[6].name).toBe("Jul");
    expect(result.yearly[6].Expense).toBe(500);
    result.yearly.forEach((month, idx) => {
      if (idx !== 6) expect(month.Expense).toBe(0);
    });
  });

  test("2 transactions: Ensure correct mapping for two separate transaction days", () => {
    const transactions = [
      {
        transactionDate: new Date("2026-07-15T08:00:00Z"), // Wednesday
        amount: 200,
        type: "Expense",
        isArchived: false,
      },
      {
        transactionDate: new Date("2026-07-17T15:00:00Z"), // Friday
        amount: 300,
        type: "Expense",
        isArchived: false,
      },
    ];

    const result = calculateTrends(transactions, refDate);

    // Weekly: Wednesday (index 2) = 200, Friday (index 4) = 300.
    expect(result.weekly[2].name).toBe("Wed");
    expect(result.weekly[2].Expense).toBe(200);
    expect(result.weekly[4].name).toBe("Fri");
    expect(result.weekly[4].Expense).toBe(300);

    // Monthly: July 15 (index 14) = 200, July 17 (index 16) = 300.
    expect(result.monthly[14].name).toBe("15");
    expect(result.monthly[14].Expense).toBe(200);
    expect(result.monthly[16].name).toBe("17");
    expect(result.monthly[16].Expense).toBe(300);

    // Yearly: July (index 6) should sum to 500.
    expect(result.yearly[6].name).toBe("Jul");
    expect(result.yearly[6].Expense).toBe(500);
  });

  test("Multiple transactions: Ensure correct accumulation of expenses on the same day", () => {
    const transactions = [
      {
        transactionDate: new Date("2026-07-17T09:00:00Z"),
        amount: 150,
        type: "Expense",
        isArchived: false,
      },
      {
        transactionDate: new Date("2026-07-17T18:00:00Z"),
        amount: 250,
        type: "Expense",
        isArchived: false,
      },
      {
        transactionDate: new Date("2026-07-17T22:30:00Z"),
        amount: 100,
        type: "Expense",
        isArchived: false,
      },
      {
        transactionDate: new Date("2026-07-17T12:00:00Z"),
        amount: 500,
        type: "Income", // should be ignored
        isArchived: false,
      },
      {
        transactionDate: new Date("2026-07-17T12:00:00Z"),
        amount: 1000,
        type: "Expense",
        isArchived: true, // should be ignored
      },
    ];

    const result = calculateTrends(transactions, refDate);

    // Sum should be 150 + 250 + 100 = 500
    expect(result.weekly[4].Expense).toBe(500);
    expect(result.monthly[16].Expense).toBe(500);
    expect(result.yearly[6].Expense).toBe(500);
  });
});
