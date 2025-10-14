import { User } from "@/backend/domain/entities";
import { IUserRepository } from "@/backend/domain/repositories";
import { PrismaClient } from "@prisma/client";
import { UserPrismaMapper } from "../mappers";

export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) { }
  public async findByEmail(email: string): Promise<User | null> {
    const found = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!found) {
      return null
    }

    return UserPrismaMapper.toDomain(found)
  }

  public async findByUsername(username: string): Promise<User | null> {
    const found = await this.prisma.user.findUnique({
      where: {
        username
      }
    })

    if (!found) {
      return null
    }

    return UserPrismaMapper.toDomain(found)
  }

  public async findById(userId: string): Promise<User | null> {
    const found = await this.prisma.user.findUnique({
      where: {
        userId
      }
    })

    if (!found) {
      return null
    }

    return UserPrismaMapper.toDomain(found)
  }

  public async create(entity: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: UserPrismaMapper.toPrisma(entity)
    })
    return UserPrismaMapper.toDomain(created)
  }

  public async update(entity: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: {
        userId: entity.userId
      },
      data: UserPrismaMapper.toPrisma(entity)
    })

    return UserPrismaMapper.toDomain(updated)
  }

  public async delete(entity: User): Promise<User> {
    const deleted = await this.prisma.user.delete({
      where: {
        userId: entity.userId
      }
    })
    return UserPrismaMapper.toDomain(deleted)
  }
}