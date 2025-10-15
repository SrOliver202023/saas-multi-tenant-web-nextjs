import { Encrypter, IEncrypterOptions } from "@/backend/domain/cryptography";
import { getEnv } from "@/utils";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

//  1s  | 1m | 1h | 1d
// 1000 * 60 * 60 * 24

export class JwtEncrypter implements Encrypter {
  private readonly secretKey: string;
  private readonly defaultExpiresIn: number;

  constructor(secretKey = getEnv("JWT_SECRET_KEY"), expiresIn = 1000 * 60 * 60 * 12) {
    this.secretKey = secretKey;
    this.defaultExpiresIn = expiresIn;
  }

  /**
   * Cria um token JWT com payload e opções opcionais.
   */
  async encrypt(payload: Record<string, unknown>, options?: IEncrypterOptions): Promise<string> {
    const secret = options?.secretKey ?? this.secretKey;
    const expiresIn = options?.expiresIn ?? this.defaultExpiresIn;

    const signOptions: SignOptions = {
      expiresIn,
      subject: options?.subject,
    };

    return jwt.sign(payload, secret, signOptions);
  }

  /**
   * Decodifica e valida um token JWT.
   * Lança erro se o token for inválido ou expirado.
   */
  async decrypt<T extends JwtPayload = JwtPayload>(token: string): Promise<T> {
    const result = jwt.verify(token, this.secretKey);
    return result as T;
  }
}
