import { Either, left, right } from "@/backend/core";
import { HttpValidation } from "@/backend/core/entities";
import { IAuthSignUpDto } from "../../dtos";
import { EmailIsRequiredAccountError, NameIsRequiredAccountError, PasswordIsRequiredAccountError, PasswordsMustBeTheSameAccountError } from "../../errors";

export class AuthSignUpValidation implements HttpValidation<IAuthSignUpDto> {
  validate(payload: IAuthSignUpDto): Either<Error, boolean> {
    if (payload) {
      if (!payload.name) {
        return left(new NameIsRequiredAccountError());
      }
      if (!payload.email) {
        return left(new EmailIsRequiredAccountError());
      }
      if (!payload.password) {
        return left(new PasswordIsRequiredAccountError());
      }
      if (payload.password !== payload.confirmPassword) {
        return left(new PasswordsMustBeTheSameAccountError());
      }
    }
    return right(true);
  }
}
