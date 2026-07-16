import { vi } from 'vitest';
import type { Db, ClientSession, Collection } from 'mongodb';

// Simple mock Session
export const mockSession = {
  startTransaction: vi.fn(),
  commitTransaction: vi.fn(),
  abortTransaction: vi.fn(),
  endSession: vi.fn(),
  inTransaction: vi.fn().mockReturnValue(true),
} as unknown as ClientSession;

// Mock database collection query chain
export function createMockCollection(docs: any[] = []) {
  const findToArray = vi.fn().mockResolvedValue(docs);
  const findSort = vi.fn().mockReturnValue({ project: () => ({ toArray: findToArray }), toArray: findToArray });
  const findMock = vi.fn().mockReturnValue({ sort: findSort, project: () => ({ toArray: findToArray }), toArray: findToArray });

  return {
    find: findMock,
    findOne: vi.fn().mockResolvedValue(docs[0] || null),
    insertOne: vi.fn().mockResolvedValue({ insertedId: 'new-id-123' }),
    updateOne: vi.fn().mockResolvedValue({ matchedCount: 1, modifiedCount: 1 }),
    updateMany: vi.fn().mockResolvedValue({ matchedCount: 1, modifiedCount: 1 }),
    deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 }),
    findOneAndUpdate: vi.fn().mockResolvedValue(docs[0] || null),
    aggregate: vi.fn().mockReturnValue({ toArray: vi.fn().mockResolvedValue([]) }),
  } as unknown as Collection;
}

export function createMockDb(collections: Record<string, any[]> = {}) {
  const collectionMocks: Record<string, any> = {};
  
  return {
    collection: vi.fn().mockImplementation((name: string) => {
      if (!collectionMocks[name]) {
        collectionMocks[name] = createMockCollection(collections[name] || []);
      }
      return collectionMocks[name];
    }),
  } as unknown as Db;
}
