import { AuthSignUpWithGoogleUseCase } from "@/backend/domain/use-cases";
import { PrismaService } from "@/backend/infra/database/prisma";
import { AccountPrismaRepository, UserPrismaRepository } from "@/backend/infra/database/prisma/repositories";
import { ExternalAuthPrismaRepository } from "@/backend/infra/database/prisma/repositories/external-auth-prisma.repository";
import { BcryptHasher } from "@/backend/infra/services";

export class AuthSignUpWithGoogleUseCaseFactory {
  static make(): AuthSignUpWithGoogleUseCase {
    const hashGenerator = new BcryptHasher();
    const accountRepository = new AccountPrismaRepository(PrismaService);
    const externalAuthPrismaRepository = new ExternalAuthPrismaRepository(PrismaService);
    const userRepository = new UserPrismaRepository(PrismaService);

    const useCase = new AuthSignUpWithGoogleUseCase(accountRepository, externalAuthPrismaRepository, userRepository, hashGenerator);

    return useCase;
  }
}
