import { HttpError } from "@/backend/core/entities";

export class InvalidCredentialsAuthSignInError extends HttpError {
  constructor() {
    super("Invalid credentials", 404);
  }
}
