import type { Request, Response, NextFunction } from 'express';

export interface CacheOptions {
  ttl: number;
  enabled: boolean;
}

export interface CacheEntry<T> {
  data: T;
  expires: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

export function createCacheMiddleware(options: CacheOptions = { ttl: 60000, enabled: true }) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!options.enabled || req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl;
    const cached = memoryCache.get(key);

    if (cached && cached.expires > Date.now()) {
      return res.json(cached.data);
    }

    const originalJson = res.json.bind(res);
    res.json = function (body: unknown) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        memoryCache.set(key, {
          data: body,
          expires: Date.now() + options.ttl,
        });
      }
      return originalJson(body);
    };

    next();
  };
}

export function clearCache(pattern?: string): void {
  if (!pattern) {
    memoryCache.clear();
    return;
  }

  const regex = new RegExp(pattern);
  for (const key of memoryCache.keys()) {
    if (regex.test(key)) {
      memoryCache.delete(key);
    }
  }
}

export function getCacheStats() {
  const now = Date.now();
  let active = 0;
  let expired = 0;

  for (const entry of memoryCache.values()) {
    if (entry.expires > now) {
      active++;
    } else {
      expired++;
    }
  }

  return {
    total: Number(memoryCache.size),
    active,
    expired,
  };
}

export const cache = {
  middleware: createCacheMiddleware,
  clear: clearCache,
  stats: getCacheStats,
};

export default cache;
