/* eslint-disable @typescript-eslint/ban-types */
import { Redis } from "ioredis";
import { BaseCacheStorage } from "../../domain/base/cache-storage";

export default class RedisCacheStorage extends BaseCacheStorage {
  constructor(private redis: Redis) {
    super("cache");
  }

  async removeCacheValue(key: string): Promise<void> {
    await this.redis.del(key);
  }

  /**
   * Get a value from Cache by key.
   * @param key Cache key
   */
  async getCacheValue<T = {}>(key: string) {
    const value = await this.redis.get(key);
    if (typeof value !== "string") return undefined;

    return JSON.parse(value) as T;
  }

  async setCacheValue<T>(key: string, value: T, ttlSeconds: number) {
    if (value === undefined) return;
    await this.redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  }
}
