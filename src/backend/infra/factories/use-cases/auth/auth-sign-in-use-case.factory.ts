import { AuthSignInUseCase } from "@/backend/domain/use-cases";
import { PrismaService } from "@/backend/infra/database/prisma";
import { AccountPrismaRepository } from "@/backend/infra/database/prisma/repositories";
import { BcryptHasher, JwtEncrypter } from "@/backend/infra/services";

export class AuthSignInUseCaseFactory {
  static make(): AuthSignInUseCase {
    const hashGenerator = new BcryptHasher();

    const jwtEncrypter = new JwtEncrypter();

    const accountRepository = new AccountPrismaRepository(PrismaService);

    const useCase = new AuthSignInUseCase(accountRepository, hashGenerator, jwtEncrypter);

    return useCase;
  }
}
