export interface IEncrypterOptions {
  expiresIn: number;
  secretKey: string;
  subject: string;
}
export abstract class Encrypter {
  abstract encrypt(payload: Record<string, unknown>, options: IEncrypterOptions): Promise<string>;
  abstract decrypt(token: string): Promise<Record<string, unknown>>;
}
