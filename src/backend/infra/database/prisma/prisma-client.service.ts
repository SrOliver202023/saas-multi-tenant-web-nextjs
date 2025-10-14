import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const PrismaService = new PrismaClient().$extends(withAccelerate())

const globalForPrisma = global as unknown as { prisma: typeof PrismaService }

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = PrismaService

export { PrismaService }

