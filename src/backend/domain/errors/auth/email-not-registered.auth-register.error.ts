import { HttpError } from "@/backend/core/entities";

export class EmailNotRegisteredAuthSignInError extends HttpError {
  constructor() {
    super("Email not registered", 404);
  }
}
