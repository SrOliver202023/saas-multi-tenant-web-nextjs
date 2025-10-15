import { Account } from "@/backend/domain/entities";
import { Account as AccountPrisma, Prisma } from "@prisma/client";

export class AccountPrismaMapper {
  public static toPrisma(raw: Account): Prisma.AccountUncheckedCreateInput {
    return {
      accountId: raw.accountId,
      email: raw.email,
      ownerUserId: raw.ownerUserId,
    };
  }

  public static toDomain(raw: AccountPrisma): Account {
    return Account.create(
      {
        email: raw.email,
        ownerUserId: raw.ownerUserId ?? undefined,
      },
      raw.accountId
    );
  }
}
