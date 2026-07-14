import { AIRecDTO, AIRiskDTO, AIOpportunityDTO, ChatMessage } from "../types/ai.types";

export interface AIFinSummaryDTO {
  overallStance: string; // e.g. "Stable" or "Deficit Risk"
  achievements: string[];
  primaryConcerns: string[];
  actionableStep: string;
}

export interface AIMonthlyReviewDTO {
  summaryParagraph: string;
  topExpenseCategory: string;
  topIncomeSource: string;
  budgetPerformanceNotice: string;
  goalHealthNotice: string;
}

export interface AIInsightsDashboardDTO {
  financialSummary: AIFinSummaryDTO;
  monthlyReview: AIMonthlyReviewDTO;
  recommendations: AIRecDTO[];
  risks: AIRiskDTO[];
  opportunities: AIOpportunityDTO[];
  financialHealthExplanation: string;
}

export interface ChatResponseDTO {
  response: string;
  suggestedPrompts: string[];
}
