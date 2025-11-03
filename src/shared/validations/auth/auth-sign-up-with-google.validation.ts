import { Either } from "@/backend/core";
import { IAuthSignUpInWithGoogleDto } from "@/backend/domain/dtos";
import { HttpValidationZodAdapter } from "@/shared/http-validation-zod-adapter";
import { z } from "zod";

const validationMessages = {
  name: {
    required: "Name is required",
    invalid: "Name must have at least 3 characters",
  },
  email: {
    required: "Email is required",
    invalid: "Email format is invalid",
  },
  password: {
    required: "Password is required",
    invalid: "Password must have at least 6 characters",
  },
  confirmPassword: {
    required: "Confirm Password is required",
    invalid: "Confirm Password must have at least 6 characters",
    mismatch: "Passwords must be the same",
  },
  googleId: {
    required: "googleId is required",
  },
  refreshToken: {
    invalid: "refreshToken is invalid",
  },
  accessToken: {
    invalid: "accessToken is invalid",
  },
  expiresIn: {
    invalid: "expiresIn is invalid",
  },
};

export const authSignUpWithGoogleValidation = z
  .object({
    name: z
      .string({ error: validationMessages.name.required })
      .min(3, { message: validationMessages.name.invalid })
      .nonempty({ message: validationMessages.name.required }),
    email: z.email({ error: validationMessages.email.invalid }).nonempty({ message: validationMessages.email.required }),
    password: z.string({ error: validationMessages.password.required }).min(6, { message: validationMessages.password.invalid }).optional(),
    confirmPassword: z
      .string({ error: validationMessages.confirmPassword.required })
      .min(6, { message: validationMessages.confirmPassword.invalid })
      .optional(),
    googleId: z.string({ error: validationMessages.googleId.required }),
    refreshToken: z.string({ error: validationMessages.refreshToken.invalid }).optional(),
    accessToken: z.string({ error: validationMessages.accessToken.invalid }).optional(),
    expiresIn: z.number({ error: validationMessages.expiresIn.invalid }).optional(),
  })
  .refine(({ password, confirmPassword }) => (password || confirmPassword ? password === confirmPassword : true), {
    message: validationMessages.confirmPassword.mismatch,
    path: ["confirmPassword"],
  });

export class AuthSignUpWithGoogleZodValidation {
  static validate(payload: IAuthSignUpInWithGoogleDto): Either<Error, boolean> {
    return HttpValidationZodAdapter.makeValidation(authSignUpWithGoogleValidation)(payload);
  }
}
