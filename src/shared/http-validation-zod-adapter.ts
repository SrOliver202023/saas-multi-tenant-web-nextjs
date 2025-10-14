import { Either, left, right } from "@/backend/core";
import { HttpError } from "@/backend/core/entities";
import z from "zod";

export class HttpValidationZodAdapter {
  static makeValidation<TData>(schema: z.ZodObject): (payload: TData) => Either<HttpError, boolean> {
    return function <TData>(payload: TData) {
      try {
        schema.parse(payload);
        return right(true);
      } catch (error) {
        console.log("zod_error", error);
        if (error instanceof z.ZodError) {
          return left(new HttpError(error.issues[0].message, 400));
        }
        const message = error instanceof Error ? error.message : "Invalid data";
        return left(new HttpError(message, 400));
      }
    };
  }
}
