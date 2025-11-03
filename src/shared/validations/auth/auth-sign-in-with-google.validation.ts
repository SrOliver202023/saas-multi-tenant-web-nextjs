import { Either } from "@/backend/core";
import { IAuthSignInDto } from "@/backend/domain/dtos";
import { HttpValidationZodAdapter } from "@/shared/http-validation-zod-adapter";
import { z } from "zod";

const validationMessages = {
  email: {
    required: "email is required",
  },
  googleId: {
    required: "googleId is required",
  },
};

export const authSignInWithGoogleZodSchema = z.object({
  email: z.string({ error: validationMessages.email.required }).nonempty({ message: validationMessages.email.required }),
  googleId: z.string({ error: validationMessages.googleId.required }),
});

export class AuthSignInWithGoogleZodValidation {
  static validate(payload: IAuthSignInDto): Either<Error, boolean> {
    return HttpValidationZodAdapter.makeValidation(authSignInWithGoogleZodSchema)(payload);
  }
}
