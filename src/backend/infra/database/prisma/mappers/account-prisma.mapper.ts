import { Account } from "@/backend/domain/entities";
import { Account as AccountPrisma, Prisma } from "@prisma/client";

export class AccountPrismaMapper {
  public static toPrisma(raw: Account): Prisma.AccountUncheckedCreateInput {
    return {
      accountId: raw.accountId,
      email: raw.email,
      name: raw.name,
      password: raw.password,
    };
  }

  public static toDomain(raw: AccountPrisma): Account {
    return Account.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
      },
      raw.accountId
    );
  }
}
