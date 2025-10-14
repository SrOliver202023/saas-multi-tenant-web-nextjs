import { HttpError } from "@/backend/core/entities";

export class EmailAlreadyExistsAuthRegisterError extends HttpError {
  constructor() {
    super("Email already registered", 409);
  }
}
