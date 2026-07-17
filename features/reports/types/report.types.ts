import type { FullReportDTO } from "../dto/report-dashboard.dto";

export type ReportType = "Monthly" | "Annual" | "Custom";

export type ReportFormat = "PDF" | "CSV";

export interface IReport {
  _id: string;
  userId: string;
  reportType: ReportType;
  startDate: string;
  endDate: string;
  generatedAt: string;
  fileName: string;
  summary: {
    netWorth: number;
    totalIncome: number;
    totalExpenses: number;
    savingsRate: number;
    financialHealthScore: number | null;
  };
  aiSummary?: string;
  fullData?: FullReportDTO; // Store complete report data for downloads
  createdAt: string;
  updatedAt: string;
}

export interface ReportDTO extends IReport {}
