export class AwaitSecondsNewPinError extends Error {
  constructor(seconds: number) {
    super(`Wait a few ${seconds} seconds before requesting a new code.`);
  }
}
