import { AuthRegisterUseCase } from "@/backend/domain/use-cases";
import { PrismaService } from "@/backend/infra/database/prisma";
import { AccountPrismaRepository, UserPrismaRepository } from "@/backend/infra/database/prisma/repositories";
import { BcryptHasher } from "@/backend/infra/services";

export class AuthRegisterUseCaseFactory {
  static make(): AuthRegisterUseCase {
    const hashGenerator = new BcryptHasher();
    const accountRepository = new AccountPrismaRepository(PrismaService);
    const userRepository = new UserPrismaRepository(PrismaService);

    const useCase = new AuthRegisterUseCase(accountRepository, userRepository, hashGenerator);

    return useCase;
  }
}
