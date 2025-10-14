import { Either } from "@/backend/core";
import { IAuthSignInDto } from "@/backend/domain/dtos";
import { HttpValidationZodAdapter } from "@/shared/http-validation-zod-adapter";
import { z } from "zod";

const validationMessages = {
  identifier: {
    required: "identifier is required",
  },
  password: {
    required: "password is required",
  },
};

export const authSignInZodSchema = z.object({
  identifier: z.string({ error: validationMessages.identifier.required }).nonempty({ message: validationMessages.identifier.required }),
  password: z.string({ error: validationMessages.password.required }),
});

export class AuthSignInZodValidation {
  static validate(payload: IAuthSignInDto): Either<Error, boolean> {
    return HttpValidationZodAdapter.makeValidation(authSignInZodSchema)(payload);
  }
}
