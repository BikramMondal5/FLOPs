import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Start MongoMemoryServer at top-level so MONGODB_URI is set before any other module imports
const mongod = await MongoMemoryServer.create();
process.env.MONGODB_URI = mongod.getUri();

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
  await mongod.stop();
});
