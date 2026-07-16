import type { BudgetDTO } from '@/features/budget/types/budget.types';
import { mockUserId } from './transactions';

export const activeFoodBudget: BudgetDTO = {
  _id: 'budget-food',
  userId: mockUserId,
  name: 'Monthly Food & Dining',
  category: 'Food & Dining',
  budgetAmount: 10000,
  period: 'Monthly',
  startDate: '2026-07-01T00:00:00.000Z',
  endDate: '2026-07-31T23:59:59.000Z',
  alertThreshold: 80,
  color: '#ff9800',
  isActive: true,
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

export const activeHousingBudget: BudgetDTO = {
  _id: 'budget-housing',
  userId: mockUserId,
  name: 'Rent and Housing',
  category: 'Housing',
  budgetAmount: 50000,
  period: 'Monthly',
  startDate: '2026-07-01T00:00:00.000Z',
  endDate: '2026-07-31T23:59:59.000Z',
  alertThreshold: 90,
  color: '#2196f3',
  isActive: true,
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

export const inactiveBudget: BudgetDTO = {
  _id: 'budget-inactive',
  userId: mockUserId,
  name: 'Old Travel Budget',
  category: 'Travel',
  budgetAmount: 20000,
  period: 'Monthly',
  startDate: '2026-06-01T00:00:00.000Z',
  endDate: '2026-06-30T23:59:59.000Z',
  alertThreshold: 80,
  isActive: false,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
};

export const zeroLimitBudget: BudgetDTO = {
  _id: 'budget-zero',
  userId: mockUserId,
  name: 'Zero Limit Category',
  category: 'Shopping',
  budgetAmount: 0,
  period: 'Monthly',
  startDate: '2026-07-01T00:00:00.000Z',
  endDate: '2026-07-31T23:59:59.000Z',
  alertThreshold: 80,
  isActive: true,
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

export const budgetsFixture: BudgetDTO[] = [
  activeFoodBudget,
  activeHousingBudget,
  inactiveBudget,
  zeroLimitBudget,
];
