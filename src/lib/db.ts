import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/nacl";

/**
 * Global Mongoose cache definition for serverless environments.
 * Prevents multiple connections across hot-reloads in Next.js development.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
  lastFailure: number | null;
}

// @ts-expect-error - NodeJS Global augmentation
let cached: MongooseCache = global.mongoose;

if (!cached) {
  // @ts-expect-error - NodeJS Global augmentation
  cached = global.mongoose = { conn: null, promise: null, lastFailure: null };
}

// Fast-fail cooling period (30 seconds) if database connection fails
const FAILURE_COOLDOWN_MS = 30000;

export async function dbConnect(): Promise<typeof mongoose | null> {
  // Return active cached connection if ready
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  // Fast-fail check: If connection failed recently, don't block requests
  if (cached.lastFailure && Date.now() - cached.lastFailure < FAILURE_COOLDOWN_MS) {
    return null;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000, // 3-second max timeout (prevents 30s hanging!)
      connectTimeoutMS: 3000,
      socketTimeoutMS: 5000,
      family: 4, // Use IPv4 first to eliminate IPv6 ::1 timeout delays on Windows
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        cached.lastFailure = null;
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        cached.lastFailure = Date.now();
        console.warn("MongoDB connection unavailable (fast-fail mode active):", err.message || err);
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.lastFailure = Date.now();
    return null;
  }

  return cached.conn;
}

export default dbConnect;
