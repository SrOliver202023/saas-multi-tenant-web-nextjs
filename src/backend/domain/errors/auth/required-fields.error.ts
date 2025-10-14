import { HttpError } from "@/backend/core/entities";

export class EmailIsRequiredAccountError extends HttpError {
  constructor() {
    super("Email is required", 400, "email");
  }
}

export class NameIsRequiredAccountError extends HttpError {
  constructor() {
    super("Name is required", 400, "name");
  }
}

export class PasswordIsRequiredAccountError extends HttpError {
  constructor() {
    super("Password is required", 400, "password");
  }
}

export class PasswordsMustBeTheSameAccountError extends HttpError {
  constructor() {
    super("Passwords must be the same", 400);
  }
}
