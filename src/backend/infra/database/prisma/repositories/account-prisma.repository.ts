import { Account } from "@/backend/domain/entities";
import { IAccountRepository } from "@/backend/domain/repositories";
import { AccountPrismaMapper } from "../mappers";
import { PrismaService } from '../prisma-client.service'

export class AccountPrismaRepository implements IAccountRepository {
  constructor(private readonly prisma: typeof PrismaService) { }

  public async findByEmail(email: string): Promise<Account | null> {
    const found = await this.prisma.account.findUnique({
      where: {
        email
      }
    })

    if (!found) {
      return null
    }

    return AccountPrismaMapper.toDomain(found)
  }

  public async findById(accountId: string): Promise<Account | null> {
    const found = await this.prisma.account.findUnique({
      where: {
        accountId
      }
    })

    if (!found) {
      return null
    }

    return AccountPrismaMapper.toDomain(found)
  }

  public async create(entity: Account): Promise<Account> {
    const created = await this.prisma.account.create({
      data: AccountPrismaMapper.toPrisma(entity)
    })
    return AccountPrismaMapper.toDomain(created)
  }

  public async update(entity: Account): Promise<Account> {
    const updated = await this.prisma.account.update({
      where: {
        accountId: entity.accountId
      },
      data: AccountPrismaMapper.toPrisma(entity)
    })

    return AccountPrismaMapper.toDomain(updated)
  }

  public async delete(entity: Account): Promise<Account> {
    const deleted = await this.prisma.account.delete({
      where: {
        accountId: entity.accountId
      }
    })
    return AccountPrismaMapper.toDomain(deleted)
  }
}