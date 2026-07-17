import type { NotificationDTO } from "../dto/notification.dto";
import type { SmartGoalDetailsDTO } from "@/features/goals/dto/goal-dashboard.dto";

export function generateGoalNotifications(goals: SmartGoalDetailsDTO[]): NotificationDTO[] {
  const notifications: NotificationDTO[] = [];
  const now = new Date();

  goals.forEach((goal) => {
    const { goal: goalData, progressPercentage, health, daysRemaining } = goal;

    if (health === "Completed") {
      notifications.push({
        id: `goal-completed-${goalData._id}`,
        type: "goal",
        severity: "success",
        title: "Goal Completed! 🎉",
        message: `${goalData.name} completed.`,
        actionLabel: "View Goals",
        actionUrl: "/goals",
        createdAt: now,
        read: false,
      });
    } else if (health === "Almost There" && progressPercentage >= 80) {
      notifications.push({
        id: `goal-almost-${goalData._id}`,
        type: "goal",
        severity: "success",
        title: "Goal Progress",
        message: `${goalData.name} reached ${progressPercentage.toFixed(0)}%.`,
        actionLabel: "View Goals",
        actionUrl: "/goals",
        createdAt: now,
        read: false,
      });
    } else if (health === "Started" && daysRemaining < 90 && progressPercentage < 40) {
      // Goal falling behind
      const monthlyIncrease = Math.ceil((goalData.targetAmount - goal.saved) / 3); // Rough estimate
      notifications.push({
        id: `goal-behind-${goalData._id}`,
        type: "goal",
        severity: "warning",
        title: "Goal Falling Behind",
        message: `${goalData.name} is falling behind. Consider increasing contribution by ₹${monthlyIncrease.toLocaleString("en-IN")}/month.`,
        actionLabel: "View Goals",
        actionUrl: "/goals",
        createdAt: now,
        read: false,
      });
    }
  });

  return notifications;
}
