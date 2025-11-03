import { AuthSignInWithGoogleUseCase } from "@/backend/domain/use-cases";
import { PrismaService } from "@/backend/infra/database/prisma";
import { AccountPrismaRepository, UserPrismaRepository } from "@/backend/infra/database/prisma/repositories";
import { ExternalAuthPrismaRepository } from "@/backend/infra/database/prisma/repositories/external-auth-prisma.repository";
import { JwtEncrypter } from "@/backend/infra/services";

export class AuthSignInWithGoogleUseCaseFactory {
  static make(): AuthSignInWithGoogleUseCase {
    const jwtEncrypter = new JwtEncrypter();

    const accountRepository = new AccountPrismaRepository(PrismaService);

    const externalAuthPrismaRepository = new ExternalAuthPrismaRepository(PrismaService);

    const userRepository = new UserPrismaRepository(PrismaService);

    const useCase = new AuthSignInWithGoogleUseCase(accountRepository, externalAuthPrismaRepository, userRepository, jwtEncrypter);

    return useCase;
  }
}
