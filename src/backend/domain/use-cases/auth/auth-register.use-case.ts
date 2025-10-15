import { Either, left, right } from "@/backend/core/either";
import { HashGenerator } from "../../cryptography";
import { Account, User } from "../../entities";
import { EmailAlreadyExistsAuthRegisterError } from "../../errors";
import { IAccountRepository, IUserRepository } from "../../repositories";

interface IRequestAuthRegister {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type IResponseAuthRegister = Either<Error, { account: Account; user: User }>;

export class AuthRegisterUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly userRepository: IUserRepository,
    private readonly hashGenerator: HashGenerator
  ) {}

  async execute(payload: IRequestAuthRegister): Promise<IResponseAuthRegister> {
    try {
      const accountFoundByEmail = await this.accountRepository.findByEmail(payload.email);

      if (accountFoundByEmail) {
        return left(new EmailAlreadyExistsAuthRegisterError());
      }

      const userFoundByEmail = await this.userRepository.findByEmail(payload.email);

      if (userFoundByEmail) {
        return left(new EmailAlreadyExistsAuthRegisterError());
      }

      const passwordHash = await this.hashGenerator.hash(payload.password);

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

      return right({ account: accountUpdated, user: userCreated });
    } catch (error) {
      return left(error as Error);
    }
  }
}
