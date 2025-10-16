import { Either, left, right } from "@/backend/core";
import { SendMailForgotPasswordUnexpectedError } from "../../errors";
import { IUserRepository } from "../../repositories";
import { MailForgotPasswordService } from "../../services";

interface IRequestAuthForgotPassword {
  identifier: string;
}

type MailStatus = "scheduled" | "sent";

type IResponseAuthForgotPassword = Either<Error, { status: MailStatus }>;

export class AuthForgotPasswordUseCase {
  constructor(private readonly userRepository: IUserRepository, private readonly mailForgotPasswordService: MailForgotPasswordService) {}

  async execute({ identifier }: IRequestAuthForgotPassword): Promise<IResponseAuthForgotPassword> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const userFound = emailRegex.test(identifier) ? await this.userRepository.findByEmail(identifier) : await this.userRepository.findByUsername(identifier);

    if (!userFound) {
      return right({ status: "sent" });
    }

    const result = await this.mailForgotPasswordService.execute({
      email: userFound.email,
      name: userFound.name,
    });

    if (result.isLeft()) {
      return left(new SendMailForgotPasswordUnexpectedError());
    }

    return right({ status: "sent" });
  }
}
