import { Redis } from "ioredis";

const globalForRedis = globalThis as unknown as { redis: Redis | undefined };

function createRedis() {
  if (!process.env.REDIS_URL) return null;
  try {
    return new Redis(process.env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
  } catch {
    return null;
  }
}

export const redis = globalForRedis.redis ?? createRedis();
if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis ?? undefined;

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttl = 3600) {
  if (!redis) return;
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch {
    // Redis unavailable — degrade gracefully
  }
}

export async function cacheDel(key: string) {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch {}
}
