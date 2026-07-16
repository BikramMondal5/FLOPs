import type { TransactionDTO } from '@/features/transactions/types/transaction.types';

export const mockUserId = 'user-123';
export const mockAccountId1 = 'account-1';
export const mockAccountId2 = 'account-2';

export const incomeTx: TransactionDTO = {
  _id: 'tx-1',
  userId: mockUserId,
  accountId: mockAccountId1,
  accountName: 'Savings Account',
  type: 'Income',
  category: 'Salary',
  amount: 100000,
  merchant: 'Company Corp',
  paymentMethod: 'Net Banking',
  transactionDate: '2026-07-01T10:00:00.000Z',
  notes: 'Monthly salary credit',
  isArchived: false,
  createdAt: '2026-07-01T10:00:00.000Z',
  updatedAt: '2026-07-01T10:00:00.000Z',
};

export const expenseTx: TransactionDTO = {
  _id: 'tx-2',
  userId: mockUserId,
  accountId: mockAccountId1,
  accountName: 'Savings Account',
  type: 'Expense',
  category: 'Food & Dining',
  amount: 2500,
  merchant: 'Gourmet Restaurant',
  paymentMethod: 'Credit Card',
  transactionDate: '2026-07-02T19:30:00.000Z',
  notes: 'Dinner with friends',
  isArchived: false,
  createdAt: '2026-07-02T19:35:00.000Z',
  updatedAt: '2026-07-02T19:35:00.000Z',
};

export const refundTx: TransactionDTO = {
  _id: 'tx-3',
  userId: mockUserId,
  accountId: mockAccountId1,
  accountName: 'Savings Account',
  type: 'Income',
  category: 'Other',
  amount: 500,
  merchant: 'E-commerce Shop',
  paymentMethod: 'UPI',
  transactionDate: '2026-07-03T11:00:00.000Z',
  notes: 'Refund for returned item',
  isArchived: false,
  createdAt: '2026-07-03T11:00:00.000Z',
  updatedAt: '2026-07-03T11:00:00.000Z',
};

export const transferOutTx: TransactionDTO = {
  _id: 'tx-4',
  userId: mockUserId,
  accountId: mockAccountId1,
  accountName: 'Savings Account',
  type: 'Expense',
  category: 'Other',
  amount: 5000,
  merchant: 'Transfer to Account 2',
  paymentMethod: 'UPI',
  transactionDate: '2026-07-04T12:00:00.000Z',
  notes: 'Internal transfer out',
  isArchived: false,
  createdAt: '2026-07-04T12:00:00.000Z',
  updatedAt: '2026-07-04T12:00:00.000Z',
};

export const highValueExpenseTx: TransactionDTO = {
  _id: 'tx-5',
  userId: mockUserId,
  accountId: mockAccountId1,
  accountName: 'Savings Account',
  type: 'Expense',
  category: 'Housing',
  amount: 45000,
  merchant: 'Landlord Rent',
  paymentMethod: 'Net Banking',
  transactionDate: '2026-07-01T08:00:00.000Z',
  isArchived: false,
  createdAt: '2026-07-01T08:00:00.000Z',
  updatedAt: '2026-07-01T08:00:00.000Z',
};

export const archivedTx: TransactionDTO = {
  _id: 'tx-6',
  userId: mockUserId,
  accountId: mockAccountId1,
  type: 'Expense',
  category: 'Shopping',
  amount: 1500,
  merchant: 'Boutique Shop',
  paymentMethod: 'Cash',
  transactionDate: '2026-06-25T15:00:00.000Z',
  isArchived: true,
  createdAt: '2026-06-25T15:00:00.000Z',
  updatedAt: '2026-06-25T15:00:00.000Z',
};

export const zeroAmountTx: TransactionDTO = {
  _id: 'tx-7',
  userId: mockUserId,
  accountId: mockAccountId1,
  type: 'Expense',
  category: 'Entertainment',
  amount: 0,
  merchant: 'Free Event',
  paymentMethod: 'Other',
  transactionDate: '2026-07-05T18:00:00.000Z',
  isArchived: false,
  createdAt: '2026-07-05T18:00:00.000Z',
  updatedAt: '2026-07-05T18:00:00.000Z',
};

export const transactionsEmpty: TransactionDTO[] = [];

export const transactionsSmall: TransactionDTO[] = [
  incomeTx,
  expenseTx,
];

export const transactionsMedium: TransactionDTO[] = [
  incomeTx,
  expenseTx,
  refundTx,
  transferOutTx,
  highValueExpenseTx,
];

export const transactionsLarge: TransactionDTO[] = [
  ...transactionsMedium,
  {
    _id: 'tx-8',
    userId: mockUserId,
    accountId: mockAccountId2,
    accountName: 'Credit Card',
    type: 'Expense',
    category: 'Bills & Utilities',
    amount: 12000,
    merchant: 'Power Grid Corp',
    paymentMethod: 'Credit Card',
    transactionDate: '2026-07-06T10:00:00.000Z',
    isArchived: false,
    createdAt: '2026-07-06T10:00:00.000Z',
    updatedAt: '2026-07-06T10:00:00.000Z',
  },
  {
    _id: 'tx-9',
    userId: mockUserId,
    accountId: mockAccountId1,
    type: 'Income',
    category: 'Investments',
    amount: 8500,
    merchant: 'Mutual Fund Dividend',
    paymentMethod: 'Net Banking',
    transactionDate: '2026-07-08T10:00:00.000Z',
    isArchived: false,
    createdAt: '2026-07-08T10:00:00.000Z',
    updatedAt: '2026-07-08T10:00:00.000Z',
  },
  {
    _id: 'tx-10',
    userId: mockUserId,
    accountId: mockAccountId2,
    type: 'Expense',
    category: 'Transportation',
    amount: 3200,
    merchant: 'Fuel Station',
    paymentMethod: 'Debit Card',
    transactionDate: '2026-07-10T12:00:00.000Z',
    isArchived: false,
    createdAt: '2026-07-10T12:00:00.000Z',
    updatedAt: '2026-07-10T12:00:00.000Z',
  },
];

export const transactionsEdgeCases: TransactionDTO[] = [
  zeroAmountTx,
  archivedTx,
];
