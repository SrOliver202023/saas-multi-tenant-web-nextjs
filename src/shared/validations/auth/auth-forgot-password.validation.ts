import { Either } from "@/backend/core";
import { IAuthForgotPasswordDto } from "@/backend/domain/dtos";
import { HttpValidationZodAdapter } from "@/shared/http-validation-zod-adapter";
import { z } from "zod";

const validationMessages = {
  identifier: {
    required: "identifier is required",
  },
};

export const authForgotPasswordZodSchema = z.object({
  identifier: z.string({ error: validationMessages.identifier.required }).nonempty({ message: validationMessages.identifier.required }),
});

export class AuthForgotPasswordZodValidation {
  static validate(payload: IAuthForgotPasswordDto): Either<Error, boolean> {
    return HttpValidationZodAdapter.makeValidation(authForgotPasswordZodSchema)(payload);
  }
}
