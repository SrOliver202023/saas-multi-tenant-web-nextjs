import { User } from "@/backend/domain/entities";
import { User as UserPrisma, Prisma } from "@prisma/client";

export class UserPrismaMapper {
  public static toPrisma(raw: User): Prisma.UserUncheckedCreateInput {
    return {
      userId: raw.userId,
      email: raw.email,
      username: raw.username,
      passwordHash: raw.passwordHash,
      createdAt: raw.createdAt,
      deletedAt: raw.deletedAt,
    }
  }

  public static toDomain(raw: UserPrisma): User {
    return User.create({
      email: raw.email,
      username: raw.username,
      passwordHash: raw.passwordHash,
      deletedAt: raw?.deletedAt ?? undefined,
      createdAt: raw.createdAt,
    }, raw.userId)
  }
}