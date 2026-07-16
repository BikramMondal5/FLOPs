import { describe, it, expect, vi } from "vitest";
import { invalidateAnalyticsCache } from "@/features/analytics/services/analytics.service";
import { invalidateBudgetCache } from "@/features/budget/services/budget.service";
import { invalidateGoalsCache } from "@/features/goals/services/goal.service";
import { invalidateAICache } from "@/features/ai/services/ai.service";
import { invalidateReportsCache } from "@/features/reports/services/report.service";
import { invalidateNotificationsCache } from "@/features/notifications/services/notification.service";

describe("Cache Invalidation Tests", () => {
  it("should support independent invalidation without errors", () => {
    const userId = "test-user-123";

    expect(() => invalidateAnalyticsCache(userId)).not.toThrow();
    expect(() => invalidateBudgetCache(userId)).not.toThrow();
    expect(() => invalidateGoalsCache(userId)).not.toThrow();
    expect(() => invalidateAICache(userId)).not.toThrow();
    expect(() => invalidateReportsCache(userId)).not.toThrow();
    expect(() => invalidateNotificationsCache(userId)).not.toThrow();
  });
});
