import { ExternalAuth } from "@/backend/domain/entities";
import { IExternalAuthRepository } from "@/backend/domain/repositories";
import { ExternalAuthPrismaMapper } from "../mappers";
import { PrismaService } from "../prisma-client.service";
import { IExternalAuthProviderEnumType } from "@/backend/domain/enums";

export class ExternalAuthPrismaRepository implements IExternalAuthRepository {
  constructor(private readonly prisma: typeof PrismaService) {}

  public async findByExternalId(providerUserId: string, provider: IExternalAuthProviderEnumType): Promise<ExternalAuth | null> {
    const found = await this.prisma.externalAuth.findUnique({
      where: {
        uniqueProviderWithProviderUserId: {
          providerUserId,
          provider,
        },
      },
    });

    if (!found) {
      return null;
    }

    return ExternalAuthPrismaMapper.toDomain(found);
  }

  public async findById(externalAuthId: string): Promise<ExternalAuth | null> {
    const found = await this.prisma.externalAuth.findUnique({
      where: {
        externalAuthId,
      },
    });

    if (!found) {
      return null;
    }

    return ExternalAuthPrismaMapper.toDomain(found);
  }

  public async create(entity: ExternalAuth): Promise<ExternalAuth> {
    const created = await this.prisma.externalAuth.create({
      data: ExternalAuthPrismaMapper.toPrisma(entity),
    });
    return ExternalAuthPrismaMapper.toDomain(created);
  }

  public async update(entity: ExternalAuth): Promise<ExternalAuth> {
    const updated = await this.prisma.externalAuth.update({
      where: {
        externalAuthId: entity.externalAuthId,
      },
      data: ExternalAuthPrismaMapper.toPrisma(entity),
    });

    return ExternalAuthPrismaMapper.toDomain(updated);
  }

  public async delete(entity: ExternalAuth): Promise<ExternalAuth> {
    const deleted = await this.prisma.externalAuth.delete({
      where: {
        externalAuthId: entity.externalAuthId,
      },
    });
    return ExternalAuthPrismaMapper.toDomain(deleted);
  }
}
