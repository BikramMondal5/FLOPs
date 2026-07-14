export type AnalyticsDateRange =
  | "Today"
  | "Yesterday"
  | "This Week"
  | "Last Week"
  | "This Month"
  | "Last Month"
  | "Last 3 Months"
  | "Last 6 Months"
  | "This Year"
  | "Custom";

export interface DateRangeResult {
  startDate: Date;
  endDate: Date;
}

export function parseDateRange(range: AnalyticsDateRange, customStart?: string, customEnd?: string): DateRangeResult {
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  let startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  switch (range) {
    case "Today":
      // defaults to today
      break;
    case "Yesterday":
      startDate.setDate(startDate.getDate() - 1);
      endDate.setDate(endDate.getDate() - 1);
      break;
    case "This Week": {
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // start monday
      startDate = new Date(startDate.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
      break;
    }
    case "Last Week": {
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1) - 7;
      startDate = new Date(startDate.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
      const endDiff = new Date(startDate);
      endDiff.setDate(startDate.getDate() + 6);
      endDiff.setHours(23, 59, 59, 999);
      return { startDate, endDate: endDiff };
    }
    case "This Month":
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1, 0, 0, 0, 0);
      break;
    case "Last Month":
      startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1, 0, 0, 0, 0);
      const lastMonthEnd = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999);
      return { startDate, endDate: lastMonthEnd };
    case "Last 3 Months":
      startDate.setMonth(startDate.getMonth() - 3);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "Last 6 Months":
      startDate.setMonth(startDate.getMonth() - 6);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "This Year":
      startDate = new Date(startDate.getFullYear(), 0, 1, 0, 0, 0, 0);
      break;
    case "Custom":
      if (customStart) startDate = new Date(customStart);
      if (customEnd) {
        const customEndDate = new Date(customEnd);
        customEndDate.setHours(23, 59, 59, 999);
        return { startDate, endDate: customEndDate };
      }
      break;
  }

  return { startDate, endDate };
}
