export interface IUserProfile {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  country?: string;
  city?: string;
  currency: string;
  language: string;
  timezone?: string;
  location?: string;
  profileImage?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUserPreferences {
  _id: string;
  userId: string;
  notifications: {
    budgetAlerts: boolean;
    goalAlerts: boolean;
    reportAlerts: boolean;
    aiAlerts: boolean;
    securityAlerts: boolean;
  };
  appearance: {
    theme: "light" | "dark" | "system";
    accentColor: string;
  };
  privacy: {
    analyticsEnabled: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IActivityLog {
  _id: string;
  userId: string;
  type: "transaction" | "budget" | "goal" | "report" | "ai_chat" | "notification" | "profile" | "login";
  action: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ProfileDTO extends IUserProfile {}
export interface PreferencesDTO extends IUserPreferences {}
export interface ActivityDTO extends IActivityLog {}
