import { MailForgotPasswordService } from "@/backend/domain/services";
import { AuthForgotPasswordUseCase } from "@/backend/domain/use-cases";
import { PrismaService } from "@/backend/infra/database/prisma";
import { UserPrismaRepository } from "@/backend/infra/database/prisma/repositories";
import { RedisCacheRepository } from "@/backend/infra/database/redis/redis-cache.repository";
import { RedisService } from "@/backend/infra/services";
import { NodemailerService } from "@/backend/infra/services/mail/nodemailer-mail.service";

export class AuthForgotPasswordUseCaseFactory {
  static make(): AuthForgotPasswordUseCase {
    const userRepository = new UserPrismaRepository(PrismaService);

    const redisService = new RedisService();

    const mailRepository = new NodemailerService();

    const cacheRepository = new RedisCacheRepository(redisService);

    const mailForgotPasswordService = new MailForgotPasswordService(mailRepository, cacheRepository);

    const useCase = new AuthForgotPasswordUseCase(userRepository, mailForgotPasswordService);

    return useCase;
  }
}
