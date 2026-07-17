export interface TrendDataPoint {
  name: string;
  Expense: number;
}

export interface TrendsData {
  weekly: TrendDataPoint[];
  monthly: TrendDataPoint[];
  yearly: TrendDataPoint[];
}

function toLocalDateString(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const getTxDate = (tx: any): Date | null => {
  if (!tx.transactionDate) return null;
  const date = tx.transactionDate instanceof Date ? tx.transactionDate : new Date(tx.transactionDate);
  return isNaN(date.getTime()) ? null : date;
};

const isExpense = (tx: any): boolean => {
  return tx.type === "Expense" && !tx.isArchived;
};

export function calculateTrends(transactions: any[], refDate: Date = new Date()): TrendsData {
  // 1. Weekly Calculation: Monday to Sunday of the reference date's week
  const day = refDate.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(refDate);
  monday.setDate(refDate.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const daysOfWeek: { dateStr: string; name: string; Expense: number }[] = [];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    daysOfWeek.push({
      dateStr: toLocalDateString(dayDate),
      name: dayNames[i],
      Expense: 0,
    });
  }

  // 2. Monthly Calculation: 1st of the month to the reference date
  const monthStart = new Date(refDate);
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const daysOfMonth: { dateStr: string; name: string; Expense: number }[] = [];
  const totalDays = refDate.getDate();
  for (let i = 1; i <= totalDays; i++) {
    const dayDate = new Date(monthStart);
    dayDate.setDate(i);
    daysOfMonth.push({
      dateStr: toLocalDateString(dayDate),
      name: String(i).padStart(2, "0"),
      Expense: 0,
    });
  }

  // 3. Yearly Calculation: Jan to Dec of the reference date year
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthsOfYear = monthNames.map((name, index) => ({
    year: refDate.getFullYear(),
    monthIndex: index,
    name,
    Expense: 0,
  }));

  // Aggregate transactions
  transactions.forEach((tx) => {
    if (!isExpense(tx)) return;
    const txDate = getTxDate(tx);
    if (!txDate) return;

    // Accumulate Weekly
    const txDateStr = toLocalDateString(txDate);
    const weeklyMatch = daysOfWeek.find((d) => d.dateStr === txDateStr);
    if (weeklyMatch) {
      weeklyMatch.Expense += tx.amount;
    }

    // Accumulate Monthly
    const monthlyMatch = daysOfMonth.find((d) => d.dateStr === txDateStr);
    if (monthlyMatch) {
      monthlyMatch.Expense += tx.amount;
    }

    // Accumulate Yearly
    if (txDate.getFullYear() === refDate.getFullYear()) {
      const yearlyMatch = monthsOfYear.find((m) => m.monthIndex === txDate.getMonth());
      if (yearlyMatch) {
        yearlyMatch.Expense += tx.amount;
      }
    }
  });

  return {
    weekly: daysOfWeek.map((d) => ({ name: d.name, Expense: d.Expense })),
    monthly: daysOfMonth.map((d) => ({ name: d.name, Expense: d.Expense })),
    yearly: monthsOfYear.map((m) => ({ name: m.name, Expense: m.Expense })),
  };
}
