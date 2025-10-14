import { IRepository } from "@/backend/core/types";
import { Account } from "../entities";

export abstract class IAccountRepository extends IRepository<Account> {
  public abstract findByEmail(email: string): Promise<Account | null>
  public abstract findById(accountId: string): Promise<Account | null>
}