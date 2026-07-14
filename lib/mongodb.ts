import { MongoClient } from "mongodb";

// Global type augmentation for HMR-safe caching in development
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// ─────────────────────────────────────────────
// Build-safe lazy initialization
// ─────────────────────────────────────────────
// IMPORTANT: Never throw at module-level — Turbopack evaluates modules
// at build time to introspect exports, even for dynamic routes.
// All validation happens inside functions, never at the top level.
// ─────────────────────────────────────────────

let _clientPromise: Promise<MongoClient>;

if (process.env.MONGODB_URI) {
  // URI is available — create the singleton connection
  if (process.env.NODE_ENV === "development") {
    // In dev, preserve across HMR hot-reloads via a global
    if (!global._mongoClientPromise) {
      const client = new MongoClient(process.env.MONGODB_URI);
      global._mongoClientPromise = client.connect();
    }
    _clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(process.env.MONGODB_URI);
    _clientPromise = client.connect();
  }
} else {
  // URI missing — provide a deferred rejection (safe at build time).
  // This will only fail when actually awaited at request time.
  _clientPromise = new Promise((_, reject) => {
    // Deferred so no synchronous throw escapes module initialization
    reject(new Error('Missing environment variable: "MONGODB_URI". Add it to .env.local'));
  });
  // Attach a no-op catch so Node.js does not emit unhandledRejection warnings.
  // The rejection is handled when callers await this promise.
  _clientPromise.catch(() => undefined);
}

/**
 * Singleton MongoDB client promise — used by Auth.js MongoDB adapter.
 * Safe to import from any module including those with `force-dynamic`.
 */
export default _clientPromise;

/**
 * Returns the named database.
 * Throws a clear error at request-time if MONGODB_URI is missing.
 */
export async function connectDB(dbName = "flops") {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      'Missing environment variable: "MONGODB_URI". Add it to .env.local'
    );
  }
  const client = await _clientPromise;
  return client.db(dbName);
}
