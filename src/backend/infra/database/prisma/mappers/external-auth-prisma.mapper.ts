import { ExternalAuth } from "@/backend/domain/entities";
import { Prisma, ExternalAuth as ExternalAuthPrisma } from "@prisma/client";

export class ExternalAuthPrismaMapper {
  public static toPrisma(raw: ExternalAuth): Prisma.ExternalAuthUncheckedCreateInput {
    return {
      userId: raw.userId,
      provider: raw.provider,
      providerUserId: raw.providerUserId,
      accessToken: raw.accessToken,
      expiresAt: raw.expiresAt,
      externalAuthId: raw.externalAuthId,
      refreshToken: raw.refreshToken,
    };
  }

  public static toDomain(raw: ExternalAuthPrisma): ExternalAuth {
    return ExternalAuth.create(
      {
        provider: raw.provider,
        providerUserId: raw.providerUserId,
        accessToken: raw?.accessToken ?? undefined,
        refreshToken: raw?.refreshToken ?? undefined,
        expiresAt: raw?.expiresAt ?? undefined,
        userId: raw.userId,
      },
      raw.externalAuthId
    );
  }
}
