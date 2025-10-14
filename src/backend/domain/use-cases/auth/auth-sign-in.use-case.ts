import { Either, left, right } from "@/backend/core/either";
import { Encrypter, HashComparer } from "../../cryptography";
import { Account } from "../../entities";
import { EmailNotRegisteredAuthSignInError } from "../../errors";
import { IAccountRepository } from "../../repositories";

export interface IRequestAuthSignIn {
  identifier: string;
  password: string;
}

type IResponseAuthSignIn = Either<Error, { account: Account; credentials: { accessToken: string } }>;

export class AuthSignInUseCase {
  constructor(private readonly accountRepository: IAccountRepository, private readonly hashComparer: HashComparer, private readonly jwtEncrypter: Encrypter) {}

  async execute(payload: IRequestAuthSignIn): Promise<IResponseAuthSignIn> {
    try {
      const foundByEmail = await this.accountRepository.findByEmail(payload.identifier);

      if (!foundByEmail) {
        return left(new EmailNotRegisteredAuthSignInError());
      }

      const passwordMatch = await this.hashComparer.compare(payload.password, foundByEmail.password);

      if (!passwordMatch) {
        return left(new EmailNotRegisteredAuthSignInError());
      }

      const accessToken = await this.jwtEncrypter.encrypt({
        accountId: foundByEmail.accountId,
        userId: undefined,
      });

      return right({
        account: foundByEmail,
        credentials: {
          accessToken,
        },
      });
    } catch (error) {
      return left(error as Error);
    }
  }
}
