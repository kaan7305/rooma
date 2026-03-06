import Redis from 'ioredis';
import config from './env';

let redis: Redis | null = null;
let isRedisAvailable = false;

/**
 * Get or create Redis connection.
 * Returns null if Redis is not configured or unavailable.
 */
export const getRedis = (): Redis | null => {
  if (redis) return redis;

  if (!config.redis.host) {
    console.log('Redis not configured, caching disabled');
    return null;
  }

  try {
    redis = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password || undefined,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          console.log('Redis connection failed after 3 retries, caching disabled');
          isRedisAvailable = false;
          return null; // Stop retrying
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    redis.on('connect', () => {
      isRedisAvailable = true;
      console.log('Redis connected');
    });

    redis.on('error', (err) => {
      isRedisAvailable = false;
      console.log('Redis error:', err.message);
    });

    redis.on('close', () => {
      isRedisAvailable = false;
    });

    // Attempt connection (non-blocking)
    redis.connect().catch(() => {
      isRedisAvailable = false;
    });

    return redis;
  } catch {
    console.log('Redis initialization failed, caching disabled');
    return null;
  }
};

/**
 * Cache utility - gracefully degrades if Redis is unavailable
 */
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (!isRedisAvailable) return null;
    try {
      const client = getRedis();
      if (!client) return null;
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds: number = 300): Promise<void> {
    if (!isRedisAvailable) return;
    try {
      const client = getRedis();
      if (!client) return;
      await client.setex(key, ttlSeconds, JSON.stringify(value));
    } catch {
      // Silently fail - caching is not critical
    }
  },

  async del(key: string): Promise<void> {
    if (!isRedisAvailable) return;
    try {
      const client = getRedis();
      if (!client) return;
      await client.del(key);
    } catch {
      // Silently fail
    }
  },

  async delPattern(pattern: string): Promise<void> {
    if (!isRedisAvailable) return;
    try {
      const client = getRedis();
      if (!client) return;
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } catch {
      // Silently fail
    }
  },
};

// TTL constants (in seconds)
export const CACHE_TTL = {
  PROPERTY_SEARCH: 5 * 60,     // 5 minutes
  PROPERTY_DETAIL: 10 * 60,    // 10 minutes
  USER_PROFILE: 15 * 60,       // 15 minutes
  UNIVERSITY_LIST: 24 * 60 * 60, // 24 hours
  AMENITY_LIST: 24 * 60 * 60,   // 24 hours
} as const;

export default getRedis;
