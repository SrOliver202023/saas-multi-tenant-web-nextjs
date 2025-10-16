export abstract class ICacheRepository {
  abstract set(key: string, value: Record<string, unknown> | string | unknown[], ttl?: number): Promise<void>;
  abstract get<T = string>(key: string): Promise<T | null>;
  abstract delete(key: string): Promise<void>;
}
