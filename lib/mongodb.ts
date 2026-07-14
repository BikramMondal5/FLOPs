import { MongoClient } from "mongodb";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

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

let _clientPromise: Promise<MongoClient> | undefined;

type LocalDocument = Record<string, unknown> & { _id: string };

type LocalStore = Record<string, LocalDocument[]>;

const localDbPath = path.join(process.cwd(), ".local-data", "flops-dev-db.json");

async function readLocalStore(): Promise<LocalStore> {
  try {
    const raw = await fs.readFile(localDbPath, "utf8");
    return JSON.parse(raw) as LocalStore;
  } catch {
    return {};
  }
}

async function writeLocalStore(store: LocalStore) {
  await fs.mkdir(path.dirname(localDbPath), { recursive: true });
  await fs.writeFile(localDbPath, JSON.stringify(store, null, 2), "utf8");
}

function createLocalDb() {
  return {
    collection(collectionName: string) {
      return {
        async findOne(filter: Record<string, unknown>) {
          const store = await readLocalStore();
          const documents = store[collectionName] ?? [];

          return (
            documents.find((document) =>
              Object.entries(filter).every(
                ([key, value]) => document[key as keyof LocalDocument] === value
              )
            ) ?? null
          );
        },

        async insertOne(document: Record<string, unknown>) {
          const store = await readLocalStore();
          const documents = store[collectionName] ?? [];
          const insertedDocument: LocalDocument = {
            ...document,
            _id: typeof document._id === "string" ? document._id : randomUUID(),
          } as LocalDocument;

          documents.push(insertedDocument);
          store[collectionName] = documents;
          await writeLocalStore(store);

          return {
            insertedId: insertedDocument._id,
          };
        },
      };
    },
  };
}

function createMongoClient() {
  if (!process.env.MONGODB_URI) {
    return new MongoClient("mongodb://127.0.0.1:27017", {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      family: 4,
    });
  }

  return new MongoClient(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
    family: 4,
    retryWrites: true,
    tls: true,
  });
}

function getClientPromise() {
  if (_clientPromise) {
    return _clientPromise;
  }

  const client = createMongoClient();
  _clientPromise = client.connect().catch((error) => {
    _clientPromise = undefined;
    throw error;
  });

  return _clientPromise;
}

if (process.env.MONGODB_URI) {
  // URI is available — create the singleton connection
  if (process.env.NODE_ENV === "development") {
    // In dev, preserve across HMR hot-reloads via a global
    if (!global._mongoClientPromise) {
      const client = createMongoClient();
      global._mongoClientPromise = client.connect().catch((error) => {
        global._mongoClientPromise = undefined;
        throw error;
      });
    }
    _clientPromise = global._mongoClientPromise;
  } else {
    _clientPromise = getClientPromise();
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
    if (process.env.NODE_ENV === "development") {
      return createLocalDb() as unknown as Awaited<ReturnType<MongoClient["db"]>>;
    }

    throw new Error(
      'Missing environment variable: "MONGODB_URI". Add it to .env.local'
    );
  }

  try {
    const client = await getClientPromise();
    return client.db(dbName);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[MongoDB] Falling back to local dev storage because Atlas connection failed: ${message}`
      );
      return createLocalDb() as unknown as Awaited<ReturnType<MongoClient["db"]>>;
    }

    throw new Error(
      `Failed to connect to MongoDB. Check MONGODB_URI, Atlas network access, and TLS settings. Original error: ${message}`
    );
  }
}
