import { AuthRefreshUseCase } from "@/backend/domain/use-cases";
import { PrismaService } from "@/backend/infra/database/prisma";
import { AccountPrismaRepository, UserPrismaRepository } from "@/backend/infra/database/prisma/repositories";
import { JwtEncrypter } from "@/backend/infra/services";

export class AuthRefreshUseCaseFactory {
  static make(): AuthRefreshUseCase {
    const jwtEncrypter = new JwtEncrypter();

    const accountRepository = new AccountPrismaRepository(PrismaService);

    const userRepository = new UserPrismaRepository(PrismaService);

    const useCase = new AuthRefreshUseCase(accountRepository, userRepository, jwtEncrypter);

    return useCase;
  }
}
