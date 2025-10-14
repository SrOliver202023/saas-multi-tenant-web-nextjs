export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly fieldPath?: string;

  constructor(message: string, statusCode: number, fieldPath?: string) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.fieldPath = fieldPath;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
