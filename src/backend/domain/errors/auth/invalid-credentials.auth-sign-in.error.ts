import { HttpError } from "@/backend/core/entities";

export class InvalidCredentialsAuthSignInError extends HttpError {
  constructor() {
    super("Email not registered", 404);
  }
}
