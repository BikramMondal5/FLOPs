import { describe, test, expect } from "vitest";
import { calculateTrends } from "@/features/analytics/calculators/trends.calculator";

// Reference date: Friday July 17, 2026 (same day as the current dataset)
const REF_DATE = new Date("2026-07-17T12:00:00Z");

// Helper to build a minimal raw transaction object (as returned by MongoDB)
function makeTx(overrides: {
  amount: number;
  type?: "Expense" | "Income";
  isArchived?: boolean;
  transactionDate: Date | string;
}) {
  return {
    amount: overrides.amount,
    type: overrides.type ?? "Expense",
    isArchived: overrides.isArchived ?? false,
    transactionDate:
      overrides.transactionDate instanceof Date
        ? overrides.transactionDate
        : new Date(overrides.transactionDate),
  };
}

describe("Overview Interactive Spending — Trends Calculator (same calculator as Transactions)", () => {

  // ─────────────────────────────────────────
  // 1. Empty dataset
  // ─────────────────────────────────────────
  describe("Empty dataset", () => {
    test("Weekly: all 7 days are zero", () => {
      const result = calculateTrends([], REF_DATE);
      expect(result.weekly).toHaveLength(7);
      result.weekly.forEach((d) => expect(d.Expense).toBe(0));
      expect(result.weekly.map((d) => d.name)).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    });

    test("Monthly: all days of July up to the 17th are zero", () => {
      const result = calculateTrends([], REF_DATE);
      expect(result.monthly).toHaveLength(17);
      result.monthly.forEach((d) => expect(d.Expense).toBe(0));
    });

    test("Yearly: all 12 months are zero", () => {
      const result = calculateTrends([], REF_DATE);
      expect(result.yearly).toHaveLength(12);
      result.yearly.forEach((m) => expect(m.Expense).toBe(0));
    });
  });

  // ─────────────────────────────────────────
  // 2. Current real dataset — all 3 expenses on Friday July 17, 2026
  // ─────────────────────────────────────────
  describe("Current real dataset: 3 expenses all on Friday 17 Jul 2026", () => {
    const transactions = [
      makeTx({ amount: 3200, transactionDate: "2026-07-17T09:00:00Z" }), // Shopping
      makeTx({ amount: 2000, transactionDate: "2026-07-17T11:00:00Z" }), // Transportation
      makeTx({ amount: 2500, transactionDate: "2026-07-17T14:00:00Z" }), // Health & Fitness
    ];
    const total = 3200 + 2000 + 2500; // 7700

    test("Weekly: only Friday (index 4) has ₹7,700, all other days are 0", () => {
      const result = calculateTrends(transactions, REF_DATE);
      expect(result.weekly[4].name).toBe("Fri");
      expect(result.weekly[4].Expense).toBe(total);
      result.weekly.forEach((d, i) => {
        if (i !== 4) expect(d.Expense).toBe(0);
      });
    });

    test("Monthly: only day 17 (index 16) has ₹7,700, all other days are 0", () => {
      const result = calculateTrends(transactions, REF_DATE);
      expect(result.monthly[16].name).toBe("17");
      expect(result.monthly[16].Expense).toBe(total);
      result.monthly.forEach((d, i) => {
        if (i !== 16) expect(d.Expense).toBe(0);
      });
    });

    test("Yearly: only July (index 6) has ₹7,700, all other months are 0", () => {
      const result = calculateTrends(transactions, REF_DATE);
      expect(result.yearly[6].name).toBe("Jul");
      expect(result.yearly[6].Expense).toBe(total);
      result.yearly.forEach((m, i) => {
        if (i !== 6) expect(m.Expense).toBe(0);
      });
    });
  });

  // ─────────────────────────────────────────
  // 3. One expense on a different weekday
  // ─────────────────────────────────────────
  describe("One expense on Tuesday July 14, 2026", () => {
    const transactions = [
      makeTx({ amount: 1500, transactionDate: "2026-07-14T10:00:00Z" }),
    ];

    test("Weekly: only Tuesday (index 1) has ₹1,500", () => {
      const result = calculateTrends(transactions, REF_DATE);
      expect(result.weekly[1].name).toBe("Tue");
      expect(result.weekly[1].Expense).toBe(1500);
      result.weekly.forEach((d, i) => {
        if (i !== 1) expect(d.Expense).toBe(0);
      });
    });

    test("Monthly: day 14 (index 13) has ₹1,500", () => {
      const result = calculateTrends(transactions, REF_DATE);
      expect(result.monthly[13].name).toBe("14");
      expect(result.monthly[13].Expense).toBe(1500);
    });

    test("Yearly: July (index 6) has ₹1,500", () => {
      const result = calculateTrends(transactions, REF_DATE);
      expect(result.yearly[6].Expense).toBe(1500);
    });
  });

  // ─────────────────────────────────────────
  // 4. Multiple expenses across multiple weekdays this week
  // ─────────────────────────────────────────
  describe("Multiple weekdays in the same week", () => {
    const transactions = [
      makeTx({ amount: 500,  transactionDate: "2026-07-13T08:00:00Z" }), // Mon
      makeTx({ amount: 800,  transactionDate: "2026-07-15T10:00:00Z" }), // Wed
      makeTx({ amount: 1200, transactionDate: "2026-07-17T15:00:00Z" }), // Fri
    ];

    test("Weekly: Mon=500, Wed=800, Fri=1200, others=0", () => {
      const result = calculateTrends(transactions, REF_DATE);
      expect(result.weekly[0].Expense).toBe(500);  // Mon
      expect(result.weekly[2].Expense).toBe(800);  // Wed
      expect(result.weekly[4].Expense).toBe(1200); // Fri
      expect(result.weekly[1].Expense).toBe(0);    // Tue
      expect(result.weekly[3].Expense).toBe(0);    // Thu
    });

    test("Yearly: July accumulates 500 + 800 + 1200 = 2500", () => {
      const result = calculateTrends(transactions, REF_DATE);
      expect(result.yearly[6].Expense).toBe(2500);
    });
  });

  // ─────────────────────────────────────────
  // 5. Multiple months in the same year
  // ─────────────────────────────────────────
  describe("Expenses spread across multiple months", () => {
    const transactions = [
      makeTx({ amount: 3000, transactionDate: "2026-03-15T10:00:00Z" }), // March
      makeTx({ amount: 5000, transactionDate: "2026-06-20T10:00:00Z" }), // June
      makeTx({ amount: 7700, transactionDate: "2026-07-17T10:00:00Z" }), // July
    ];

    test("Yearly: Mar=3000, Jun=5000, Jul=7700, all others=0", () => {
      const result = calculateTrends(transactions, REF_DATE);
      expect(result.yearly[2].name).toBe("Mar");
      expect(result.yearly[2].Expense).toBe(3000);
      expect(result.yearly[5].name).toBe("Jun");
      expect(result.yearly[5].Expense).toBe(5000);
      expect(result.yearly[6].name).toBe("Jul");
      expect(result.yearly[6].Expense).toBe(7700);
      // Other months should be 0
      [0, 1, 3, 4, 7, 8, 9, 10, 11].forEach((i) => {
        expect(result.yearly[i].Expense).toBe(0);
      });
    });
  });

  // ─────────────────────────────────────────
  // 6. Income and archived transactions are ignored
  // ─────────────────────────────────────────
  describe("Non-expense and archived transactions are excluded", () => {
    const transactions = [
      makeTx({ amount: 7700, type: "Expense",  isArchived: false, transactionDate: "2026-07-17T10:00:00Z" }), // included
      makeTx({ amount: 5000, type: "Income",   isArchived: false, transactionDate: "2026-07-17T10:00:00Z" }), // excluded
      makeTx({ amount: 2000, type: "Expense",  isArchived: true,  transactionDate: "2026-07-17T10:00:00Z" }), // excluded
    ];

    test("Only the active expense of ₹7,700 appears in Friday slot", () => {
      const result = calculateTrends(transactions, REF_DATE);
      expect(result.weekly[4].Expense).toBe(7700); // Fri only
    });

    test("Yearly July total is exactly ₹7,700", () => {
      const result = calculateTrends(transactions, REF_DATE);
      expect(result.yearly[6].Expense).toBe(7700);
    });
  });

  // ─────────────────────────────────────────
  // 7. Overview and Transactions share identical output
  // ─────────────────────────────────────────
  describe("Overview and Transactions produce identical aggregated values", () => {
    const sharedTransactions = [
      makeTx({ amount: 3200, transactionDate: "2026-07-17T09:00:00Z" }),
      makeTx({ amount: 2000, transactionDate: "2026-07-17T11:00:00Z" }),
      makeTx({ amount: 2500, transactionDate: "2026-07-17T14:00:00Z" }),
    ];

    test("Both calls return the same weekly array", () => {
      const overviewResult = calculateTrends(sharedTransactions, REF_DATE);
      const txResult      = calculateTrends(sharedTransactions, REF_DATE);
      expect(overviewResult.weekly).toEqual(txResult.weekly);
    });

    test("Both calls return the same monthly array", () => {
      const overviewResult = calculateTrends(sharedTransactions, REF_DATE);
      const txResult      = calculateTrends(sharedTransactions, REF_DATE);
      expect(overviewResult.monthly).toEqual(txResult.monthly);
    });

    test("Both calls return the same yearly array", () => {
      const overviewResult = calculateTrends(sharedTransactions, REF_DATE);
      const txResult      = calculateTrends(sharedTransactions, REF_DATE);
      expect(overviewResult.yearly).toEqual(txResult.yearly);
    });
  });
});
