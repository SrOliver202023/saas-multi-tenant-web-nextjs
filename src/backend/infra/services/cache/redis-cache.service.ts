import { Logger } from "@/shared";
import { getEnv } from "@/utils";
import Redis from "ioredis";

export class RedisService extends Redis {
  private readonly logger = Logger.withContext(RedisService.name);
  constructor() {
    super({
      host: getEnv("REDIS_HOST"),
      port: getEnv("REDIS_PORT"),
      db: getEnv("REDIS_DB"),
      reconnectOnError: (err) => {
        this.logger.error(`Redis connection error: ${err.message}`);
        return false; // Attempt to reconnect on error
      },
      maxRetriesPerRequest: 5, // Retry up to 5 times
      retryStrategy: (times) => {
        const delay = Math.min(times * 2000, 60000); // Exponential backoff with a max delay of 60 seconds
        this.logger.warn(`Redis retry strategy: Attempt ${times}, retrying in ${delay}ms`);
        return delay;
      },
      offlineQueue: true, // Queue commands while offline
      enableReadyCheck: true, // Enable readiness check
      connectTimeout: 10000, // 10 seconds timeout for connection attempts
    });
  }

  // async set(key: string, value: Record<string, unknown> | string | unknown[], ttl: number = 60 * 15): Promise<void> {
  //   if (!value) {
  //     return;
  //   }

  //   if (typeof value === "object") {
  //     try {
  //       value = JSON.stringify(value);
  //     } catch (error) {
  //       console.error("Error stringifying value for Redis cache:", error);

  //       return;
  //     }
  //   }

  //   await this.redis.set(key, value, "EX", ttl);
  // }

  // async get<T>(key: string): Promise<T | null> {
  //   const value = await this.redis.get(key);

  //   if (!value) {
  //     return null;
  //   }

  //   try {
  //     return JSON.parse(value) as T;
  //   } catch (error) {
  //     console.error("Error parsing value from Redis cache:", error);

  //     return null;
  //   }
  // }

  // async delete(key: string): Promise<void> {
  //   await this.redis.del(key);
  // }
}
