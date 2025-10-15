import { Either } from "@/backend/core";
import { IAuthRefreshDto } from "@/backend/domain/dtos";
import { HttpValidationZodAdapter } from "@/shared/http-validation-zod-adapter";
import { z } from "zod";

const validationMessages = {
  refreshToken: {
    required: "refreshToken is required",
  },
};

export const authRefreshZodSchema = z.object({
  refreshToken: z.string({ error: validationMessages.refreshToken.required }).nonempty({ message: validationMessages.refreshToken.required }),
});

export class AuthRefreshZodValidation {
  static validate(payload: IAuthRefreshDto): Either<Error, boolean> {
    return HttpValidationZodAdapter.makeValidation(authRefreshZodSchema)(payload);
  }
}
