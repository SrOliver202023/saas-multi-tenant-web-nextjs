import { IRepository } from "@/backend/core/types";
import { User } from "../entities";

export abstract class IUserRepository extends IRepository<User> {
  public abstract findByEmail(email: string): Promise<User | null>
  public abstract findById(accountId: string): Promise<User | null>
  public abstract findByUsername(username: string): Promise<User | null>
} 