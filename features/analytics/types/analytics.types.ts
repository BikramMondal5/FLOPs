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
  
  // Use UTC methods to ensure timezone-agnostic boundaries matching DB records
  const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
  let startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));

  switch (range) {
    case "Today":
      // defaults to today
      break;
    case "Yesterday":
      startDate.setUTCDate(startDate.getUTCDate() - 1);
      endDate.setUTCDate(endDate.getUTCDate() - 1);
      break;
    case "This Week": {
      const day = startDate.getUTCDay();
      const diff = startDate.getUTCDate() - day + (day === 0 ? -6 : 1); // start monday
      startDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), diff, 0, 0, 0, 0));
      const endDiff = new Date(startDate);
      endDiff.setUTCDate(startDate.getUTCDate() + 6);
      endDiff.setUTCHours(23, 59, 59, 999);
      return { startDate, endDate: endDiff };
    }
    case "Last Week": {
      const day = startDate.getUTCDay();
      const diff = startDate.getUTCDate() - day + (day === 0 ? -6 : 1) - 7;
      startDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), diff, 0, 0, 0, 0));
      const endDiff = new Date(startDate);
      endDiff.setUTCDate(startDate.getUTCDate() + 6);
      endDiff.setUTCHours(23, 59, 59, 999);
      return { startDate, endDate: endDiff };
    }
    case "This Month": {
      startDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1, 0, 0, 0, 0));
      const endDiff = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));
      return { startDate, endDate: endDiff };
    }
    case "Last Month": {
      startDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth() - 1, 1, 0, 0, 0, 0));
      const lastMonthEnd = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth() + 1, 0, 23, 59, 59, 999));
      return { startDate, endDate: lastMonthEnd };
    }
    case "Last 3 Months":
      startDate.setUTCMonth(startDate.getUTCMonth() - 3);
      startDate.setUTCHours(0, 0, 0, 0);
      break;
    case "Last 6 Months":
      startDate.setUTCMonth(startDate.getUTCMonth() - 6);
      startDate.setUTCHours(0, 0, 0, 0);
      break;
    case "This Year": {
      startDate = new Date(Date.UTC(startDate.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
      const endDiff = new Date(Date.UTC(now.getUTCFullYear(), 11, 31, 23, 59, 59, 999));
      return { startDate, endDate: endDiff };
    }
    case "Custom":
      if (customStart) startDate = new Date(customStart);
      if (customEnd) {
        const customEndDate = new Date(customEnd);
        customEndDate.setUTCHours(23, 59, 59, 999);
        return { startDate, endDate: customEndDate };
      }
      break;
  }

  return { startDate, endDate };
}
