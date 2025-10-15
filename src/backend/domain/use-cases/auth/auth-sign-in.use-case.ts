import { Either, left, right } from "@/backend/core/either";
import { getEnv } from "@/utils";
import { Encrypter, HashComparer } from "../../cryptography";
import { Account, User } from "../../entities";
import { InvalidCredentialsAuthSignInError } from "../../errors";
import { IAccountRepository, IUserRepository } from "../../repositories";

export interface IRequestAuthSignIn {
  identifier: string;
  password: string;
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

type IResponseAuthSignIn = Either<Error, IResponseAuthSignInData>;

export class AuthSignInUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly userRepository: IUserRepository,
    private readonly hashComparer: HashComparer,
    private readonly jwtEncrypter: Encrypter
  ) {}

  async execute(payload: IRequestAuthSignIn): Promise<IResponseAuthSignIn> {
    try {
      const { identifier, password } = payload;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const user = emailRegex.test(identifier) ? await this.userRepository.findByEmail(identifier) : await this.userRepository.findByUsername(identifier);

      if (!user) {
        return left(new InvalidCredentialsAuthSignInError());
      }

      const isPasswordValid = await this.hashComparer.compare(password, user.password);

      if (!isPasswordValid) {
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
