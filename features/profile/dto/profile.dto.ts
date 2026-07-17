import type { ProfileDTO, PreferencesDTO, ActivityDTO } from "../types/profile.types";

export interface ProfileStatsDTO {
  accountsCount: number;
  transactionsCount: number;
  budgetsCount: number;
  goalsCount: number;
  reportsCount: number;
  notificationsCount: number;
  aiChatsCount: number;
}

export interface FinancialSnapshotDTO {
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  financialScore: number | null;
  connectedBanks: number;
  riskProfile: "Conservative" | "Moderate" | "Aggressive";
}

export interface FullProfileDTO {
  profile: ProfileDTO;
  preferences: PreferencesDTO;
  stats: ProfileStatsDTO;
  financialSnapshot: FinancialSnapshotDTO;
  recentActivity: ActivityDTO[];
  joinedDate: string;
  lastLogin: string;
}

export interface UpdateProfileDTO {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  country?: string;
  city?: string;
  currency?: string;
  language?: string;
  timezone?: string;
  location?: string;
}

export interface UpdatePreferencesDTO {
  notifications?: {
    budgetAlerts?: boolean;
    goalAlerts?: boolean;
    reportAlerts?: boolean;
    aiAlerts?: boolean;
    securityAlerts?: boolean;
  };
  appearance?: {
    theme?: "light" | "dark" | "system";
    accentColor?: string;
  };
  privacy?: {
    analyticsEnabled?: boolean;
  };
}

// Re-export types
export type { ProfileDTO, PreferencesDTO, ActivityDTO };
