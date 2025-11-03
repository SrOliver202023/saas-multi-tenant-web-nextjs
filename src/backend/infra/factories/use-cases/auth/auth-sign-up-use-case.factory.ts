import { AuthSignUpUseCase } from "@/backend/domain/use-cases";
import { PrismaService } from "@/backend/infra/database/prisma";
import { AccountPrismaRepository, UserPrismaRepository } from "@/backend/infra/database/prisma/repositories";
import { ExternalAuthPrismaRepository } from "@/backend/infra/database/prisma/repositories/external-auth-prisma.repository";
import { BcryptHasher } from "@/backend/infra/services";

export class AuthSignUpUseCaseFactory {
  static make(): AuthSignUpUseCase {
    const hashGenerator = new BcryptHasher();
    const accountRepository = new AccountPrismaRepository(PrismaService);
    const userRepository = new UserPrismaRepository(PrismaService);
    const externalAuthRepository = new ExternalAuthPrismaRepository(PrismaService);

    const useCase = new AuthSignUpUseCase(accountRepository, userRepository, externalAuthRepository, hashGenerator);

    return useCase;
  }
}
