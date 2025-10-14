import { Either } from "@/backend/core";
import { IAuthRegisterDto } from "@/backend/domain/dtos";
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
};

export const createAccountValidation = z
  .object({
    name: z
      .string({ error: validationMessages.name.required })
      .min(3, { message: validationMessages.name.invalid })
      .nonempty({ message: validationMessages.name.required }),
    email: z.email({ error: validationMessages.email.invalid }).nonempty({ message: validationMessages.email.required }),
    password: z.string({ error: validationMessages.password.required }).min(6, { message: validationMessages.password.invalid }),
    confirmPassword: z.string({ error: validationMessages.confirmPassword.required }).min(6, { message: validationMessages.confirmPassword.invalid }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: validationMessages.confirmPassword.mismatch,
    path: ["confirmPassword"],
  });

export class AuthRegisterZodValidation {
  static validate(payload: IAuthRegisterDto): Either<Error, boolean> {
    return HttpValidationZodAdapter.makeValidation(createAccountValidation)(payload);
  }
}
