import { beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

// Start MongoMemoryReplSet so multi-document transactions (sessions) work in integration tests
const replSet = await MongoMemoryReplSet.create({
  replSet: { count: 1, storageEngine: 'wiredTiger' }
});
process.env.MONGODB_URI = replSet.getUri();

// Clear all mock call history before each test.
// NOTE: vi.resetModules() is intentionally NOT called here — it would destroy
// module-level mocks (vi.mock()) and the MongoDB connection singleton,
// which integration test suites rely on across multiple tests.
beforeEach(() => {
  vi.clearAllMocks();
});

// Setting default timezone to UTC for deterministic date-based testing
process.env.TZ = 'UTC';
process.env.NEXTAUTH_SECRET = 'test-secret';

afterAll(async () => {
  await replSet.stop();
});
