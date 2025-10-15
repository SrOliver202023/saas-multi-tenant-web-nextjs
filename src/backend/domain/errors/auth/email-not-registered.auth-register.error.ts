import { HttpError } from "@/backend/core/entities";

export class EmailNotRegisteredAuthError extends HttpError {
  constructor() {
    super("Email not registered", 404);
  }
}
