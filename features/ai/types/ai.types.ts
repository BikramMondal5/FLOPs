export type MessageRole = "user" | "model" | "system";

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface AIRecDTO {
  category: string;
  type: "positive" | "warning" | "neutral";
  message: string;
}

export interface AIRiskDTO {
  level: "High" | "Medium" | "Low";
  trigger: string;
  impact: string;
}

export interface AIOpportunityDTO {
  category: string;
  suggestion: string;
  projectedSavings: number;
}
