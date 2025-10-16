import { ICacheRepository } from "@/backend/domain/repositories";
import { RedisService } from "../../services";

export class RedisCacheRepository implements ICacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: Record<string, unknown> | string | unknown[], ttl: number = 60 * 15): Promise<void> {
    if (!value) {
      return;
    }

    if (typeof value === "object") {
      try {
        value = JSON.stringify(value);
      } catch (error) {
        console.error("Error stringifying value for Redis cache:", error);

        return;
      }
    }

    await this.redis.set(key, value, "EX", ttl);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error("Error parsing value from Redis cache:", error);

      return null;
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
