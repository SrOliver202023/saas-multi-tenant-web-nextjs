import { Either, left, right } from "@/backend/core/either";
import { getEnv } from "@/utils";
import { Encrypter } from "../../cryptography";
import { Account, User } from "../../entities";
import { EmailNotRegisteredAuthError } from "../../errors";
import { InvalidRefreshTokenAuthError } from "../../errors/auth/invalid-refresh-token.auth-register.error";
import { IAccountRepository, IUserRepository } from "../../repositories";

export interface IRequestAuthRefresh {
  refreshToken: string;
}

type IResponseAuthSignInData = {
  account?: Account;
  user: User;
  credentials: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
};

type IResponseAuthRefresh = Either<Error, IResponseAuthSignInData>;

export class AuthRefreshUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly userRepository: IUserRepository,
    private readonly jwtEncrypter: Encrypter
  ) {}

  async execute(payload: IRequestAuthRefresh): Promise<IResponseAuthRefresh> {
    try {
      const { userId } = (await this.jwtEncrypter.decrypt(payload.refreshToken)) as { accountId: string; userId: string };

      const userFoundById = await this.userRepository.findById(userId);

      if (!userFoundById) {
        return left(new EmailNotRegisteredAuthError());
      }

      const accountFoundById = userFoundById.ownedAccountId ? await this.accountRepository.findById(userFoundById.ownedAccountId) : null;

      const secretKey = getEnv("JWT_SECRET_KEY");

      const expiresIn = getEnv("ACCESS_TOKEN_EXPIRES_IN_SECONDS");

      const accessToken = await this.jwtEncrypter.encrypt(
        {
          accountId: userFoundById.ownedAccountId,
          userId: userFoundById.userId,
        },
        {
          expiresIn,
          secretKey,
          subject: userFoundById.email,
        }
      );

      const refreshToken = await this.jwtEncrypter.encrypt(
        {
          accountId: userFoundById.ownedAccountId,
          userId: userFoundById.userId,
        },
        {
          expiresIn: getEnv("REFRESH_TOKEN_EXPIRES_IN_SECONDS"),
          secretKey,
          subject: userFoundById.email,
        }
      );

      return right({
        account: accountFoundById ?? undefined,
        user: userFoundById,
        credentials: {
          accessToken,
          refreshToken,
          expiresIn,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error in [JsonWebTokenError]: invalid signature";
      if (message.includes("invalid signature")) {
        return left(new InvalidRefreshTokenAuthError());
      }
      return left(error as Error);
    }
  }
}
