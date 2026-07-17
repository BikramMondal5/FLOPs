export type GoalCategory =
  | "Emergency Fund"
  | "Vacation"
  | "Education"
  | "Electronics"
  | "Vehicle"
  | "Home"
  | "Investment"
  | "Retirement"
  | "Healthcare"
  | "Business"
  | "Wedding"
  | "Other";

export type GoalPriority = "High" | "Medium" | "Low";

export type GoalStatus = "Active" | "Completed" | "Paused" | "Cancelled";

export type GoalHealth = "Started" | "On Track" | "Almost There" | "Completed";

export interface IGoal {
  _id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentContribution: number;
  targetDate: string; // ISO String
  priority: GoalPriority;
  category: GoalCategory;
  icon?: string;
  color?: string;
  description?: string;
  status: GoalStatus;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoalDTO extends IGoal {}
