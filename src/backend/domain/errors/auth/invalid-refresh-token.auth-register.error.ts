import { HttpError } from "@/backend/core/entities";

export class InvalidRefreshTokenAuthError extends HttpError {
  constructor() {
    super("Invalid Refresh Token", 404);
  }
}
