import type { GoalDTO } from '@/features/goals/types/goal.types';
import { mockUserId } from './transactions';

export const activeEmergencyGoal: GoalDTO = {
  _id: 'goal-emergency',
  userId: mockUserId,
  name: 'Emergency Fund',
  targetAmount: 200000,
  currentContribution: 50000,
  targetDate: '2026-12-31T23:59:59.000Z',
  priority: 'High',
  category: 'Emergency Fund',
  status: 'Active',
  isArchived: false,
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

export const completedVacationGoal: GoalDTO = {
  _id: 'goal-vacation',
  userId: mockUserId,
  name: 'Summer Trip',
  targetAmount: 50000,
  currentContribution: 50000,
  targetDate: '2026-07-10T23:59:59.000Z',
  priority: 'Medium',
  category: 'Vacation',
  status: 'Completed',
  isArchived: false,
  createdAt: '2026-05-01T00:00:00.000Z',
  updatedAt: '2026-07-10T00:00:00.000Z',
};

export const expiredGoal: GoalDTO = {
  _id: 'goal-expired',
  userId: mockUserId,
  name: 'Old Laptop purchase',
  targetAmount: 80000,
  currentContribution: 30000,
  targetDate: '2026-06-30T23:59:59.000Z',
  priority: 'Low',
  category: 'Electronics',
  status: 'Active',
  isArchived: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-06-30T00:00:00.000Z',
};

export const futureRetirementGoal: GoalDTO = {
  _id: 'goal-retirement',
  userId: mockUserId,
  name: 'Retirement Fund',
  targetAmount: 5000000,
  currentContribution: 200000,
  targetDate: '2046-07-01T00:00:00.000Z',
  priority: 'High',
  category: 'Retirement',
  status: 'Active',
  isArchived: false,
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

export const pausedGoal: GoalDTO = {
  _id: 'goal-paused',
  userId: mockUserId,
  name: 'Buying a Tesla',
  targetAmount: 4000000,
  currentContribution: 1000000,
  targetDate: '2028-07-01T00:00:00.000Z',
  priority: 'Low',
  category: 'Vehicle',
  status: 'Paused',
  isArchived: false,
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

export const goalsFixture: GoalDTO[] = [
  activeEmergencyGoal,
  completedVacationGoal,
  expiredGoal,
  futureRetirementGoal,
  pausedGoal,
];
