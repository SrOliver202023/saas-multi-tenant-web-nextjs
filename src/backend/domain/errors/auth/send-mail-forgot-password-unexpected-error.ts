export class SendMailForgotPasswordUnexpectedError extends Error {
  constructor() {
    super("Unexpected error sending password recovery email");
  }
}
