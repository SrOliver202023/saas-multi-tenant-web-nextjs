import { User } from "@/backend/domain/entities";
import { Prisma, User as UserPrisma } from "@prisma/client";

export class UserPrismaMapper {
  public static toPrisma(raw: User): Prisma.UserUncheckedCreateInput {
    return {
      userId: raw.userId,
      email: raw.email,
      username: raw.username,
      password: raw.password,
      createdAt: raw.createdAt,
      deletedAt: raw.deletedAt,
      name: raw.name,
      managerAccountId: raw.managerAccountId,
      ownedAccountId: raw.ownedAccountId,
    };
  }

  public static toDomain(raw: UserPrisma): User {
    return User.create(
      {
        email: raw.email,
        username: raw.username,
        password: raw.password,
        deletedAt: raw?.deletedAt ?? undefined,
        createdAt: raw.createdAt,
        name: raw.name,
        managerAccountId: raw.managerAccountId ?? undefined,
        ownedAccountId: raw.ownedAccountId ?? undefined,
      },
      raw.userId
    );
  }
}
