import { Either, left, right } from "@/backend/core/either";
import { HashGenerator } from "../../cryptography";
import { Account } from "../../entities";
import { EmailAlreadyExistsAuthRegisterError } from "../../errors";
import { IAccountRepository } from "../../repositories";

export interface IRequestAuthRegister {
  name: string;
  email: string;
  password: string;
}

type IResponseAuthRegister = Either<Error, Account>;

export class AuthRegisterUseCase {
  constructor(private readonly accountRepository: IAccountRepository, private readonly hashGenerator: HashGenerator) {}

  async execute(payload: IRequestAuthRegister): Promise<IResponseAuthRegister> {
    try {
      const passwordHash = await this.hashGenerator.hash(payload.password);

      const newAccount = Account.create({
        ...payload,
        password: passwordHash,
      });

      const foundByEmail = await this.accountRepository.findByEmail(payload.email);

      if (foundByEmail) {
        return left(new EmailAlreadyExistsAuthRegisterError());
      }

      const created = await this.accountRepository.create(newAccount);

      return right(created);
    } catch (error) {
      return left(error as Error);
    }
  }
}
