import type { AccountDTO } from '@/features/accounts/types/account.types';
import { mockUserId, mockAccountId1, mockAccountId2 } from './transactions';

export const activeSavingsAccount: AccountDTO = {
  _id: mockAccountId1,
  userId: mockUserId,
  name: 'Savings Account',
  institution: 'State Bank',
  type: 'Savings',
  currency: 'INR',
  balance: 150000,
  color: '#4caf50',
  icon: 'landmark',
  isArchived: false,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

export const activeCreditCardAccount: AccountDTO = {
  _id: mockAccountId2,
  userId: mockUserId,
  name: 'Credit Card',
  institution: 'HDFC',
  type: 'Credit Card',
  currency: 'INR',
  balance: -12500, // negative represents due amount
  color: '#f44336',
  icon: 'credit-card',
  isArchived: false,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

export const zeroBalanceAccount: AccountDTO = {
  _id: 'account-zero',
  userId: mockUserId,
  name: 'Empty Wallet',
  type: 'Wallet',
  currency: 'INR',
  balance: 0,
  isArchived: false,
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

export const archivedAccount: AccountDTO = {
  _id: 'account-archived',
  userId: mockUserId,
  name: 'Old Current Account',
  type: 'Current',
  currency: 'INR',
  balance: 2000,
  isArchived: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z',
};

export const accountsFixture: AccountDTO[] = [
  activeSavingsAccount,
  activeCreditCardAccount,
  zeroBalanceAccount,
];
