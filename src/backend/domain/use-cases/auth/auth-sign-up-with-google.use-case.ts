import { Either, left, right } from "@/backend/core/either";
import { HashGenerator } from "../../cryptography";
import { Account, ExternalAuth, User } from "../../entities";
import { EmailAlreadyExistsAuthRegisterError, PasswordsMustBeTheSameAccountError } from "../../errors";
import { IAccountRepository, IExternalAuthRepository, IUserRepository } from "../../repositories";

interface IRequestAuthSignUpWihGoogle {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  googleId: string;
  refreshToken?: string;
  accessToken?: string;
  expiresIn?: number;
}

type IResponseAuthSignUpWithGoogle = Either<Error, { account: Account; user: User }>;

export class AuthSignUpWithGoogleUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly externalAuthRepository: IExternalAuthRepository,
    private readonly userRepository: IUserRepository,
    private readonly hashGenerator: HashGenerator
  ) {}

  async execute(payload: IRequestAuthSignUpWihGoogle): Promise<IResponseAuthSignUpWithGoogle> {
    try {
      const userFoundByGoogleId = await this.externalAuthRepository.findByExternalId(payload.googleId, "google");

      if (userFoundByGoogleId) {
        return left(new EmailAlreadyExistsAuthRegisterError());
      }

      const accountFoundByEmail = await this.accountRepository.findByEmail(payload.email);

      if (accountFoundByEmail) {
        return left(new EmailAlreadyExistsAuthRegisterError());
      }

      const userFoundByEmail = await this.userRepository.findByEmail(payload.email);

      if (userFoundByEmail) {
        return left(new EmailAlreadyExistsAuthRegisterError());
      }

      const password = payload.password ?? payload.googleId;

      if (payload.password && payload.password !== payload.confirmPassword) {
        return left(new PasswordsMustBeTheSameAccountError());
      }

      const passwordHash = await this.hashGenerator.hash(password);

      const newAccount = Account.create({
        email: payload.email,
      });

      const accountCreated = await this.accountRepository.create(newAccount);

      const user = User.create({
        email: payload.email,
        username: payload.email,
        name: payload.name,
        password: passwordHash,
        ownedAccountId: accountCreated.accountId,
        managerAccountId: accountCreated.accountId,
      });

      const userCreated = await this.userRepository.create(user);

      const updateAccount = Account.create(
        {
          email: payload.email,
          ownerUserId: userCreated.userId,
          createdAt: accountCreated.createdAt,
          createdBy: accountCreated.createdBy,
        },
        accountCreated.accountId
      );

      const accountUpdated = await this.accountRepository.update(updateAccount);

      const externalAuth = ExternalAuth.create({
        provider: "google",
        providerUserId: payload.email,
        userId: userCreated.userId,
        accessToken: payload.accessToken ?? "",
        refreshToken: payload.refreshToken ?? "",
        expiresAt: payload.expiresIn ? new Date(Date.now() + payload.expiresIn * 1000) : undefined,
      });

      await this.externalAuthRepository.create(externalAuth);

      return right({ account: accountUpdated, user: userCreated });
    } catch (error) {
      return left(error as Error);
    }
  }
}
