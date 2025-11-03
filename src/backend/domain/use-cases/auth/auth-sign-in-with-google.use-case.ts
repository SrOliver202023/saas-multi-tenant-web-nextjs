import { Either, left, right } from "@/backend/core/either";
import { getEnv } from "@/utils";
import { Encrypter } from "../../cryptography";
import { Account, User } from "../../entities";
import { InvalidCredentialsAuthSignInError } from "../../errors";
import { IAccountRepository, IExternalAuthRepository, IUserRepository } from "../../repositories";

export interface IRequestAuthSignInWithGoogle {
  googleId: string;
}

type IResponseAuthSignInWithGoogleData = {
  account?: Account;
  user: User;
  credentials: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
};

type IResponseAuthSignInWithGoogle = Either<Error, IResponseAuthSignInWithGoogleData>;

export class AuthSignInWithGoogleUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly externalAuthRepository: IExternalAuthRepository,
    private readonly userRepository: IUserRepository,
    private readonly jwtEncrypter: Encrypter
  ) {}

  async execute(payload: IRequestAuthSignInWithGoogle): Promise<IResponseAuthSignInWithGoogle> {
    try {
      const userFoundByGoogleId = await this.externalAuthRepository.findByExternalId(payload.googleId, "google");

      if (!userFoundByGoogleId) {
        return left(new InvalidCredentialsAuthSignInError());
      }
      const user = await this.userRepository.findById(userFoundByGoogleId.userId);

      if (!user) {
        return left(new InvalidCredentialsAuthSignInError());
      }

      const secretKey = getEnv("JWT_SECRET_KEY");
      const accessTokenExpiresIn = Number(getEnv("ACCESS_TOKEN_EXPIRES_IN_SECONDS"));
      const refreshTokenExpiresIn = Number(getEnv("REFRESH_TOKEN_EXPIRES_IN_SECONDS"));

      const accountFound = user.ownedAccountId ? await this.accountRepository.findById(user.ownedAccountId) : null;

      const payloadToken = {
        accountId: user.ownedAccountId,
        userId: user.userId,
      };

      const accessToken = await this.jwtEncrypter.encrypt(payloadToken, {
        expiresIn: accessTokenExpiresIn,
        secretKey,
        subject: user.email,
      });

      const refreshToken = await this.jwtEncrypter.encrypt(payloadToken, {
        expiresIn: refreshTokenExpiresIn,
        secretKey,
        subject: user.email,
      });

      return right({
        account: accountFound ?? undefined,
        user,
        credentials: {
          accessToken,
          refreshToken,
          expiresIn: accessTokenExpiresIn,
        },
      });
    } catch (error) {
      return left(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
