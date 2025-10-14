import { Encrypter } from "@/backend/domain/cryptography";
import { getEnv } from "@/utils";
import JsonWebToken from "jsonwebtoken";

export class JwtEncrypter implements Encrypter {
  constructor() {}

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JsonWebToken.sign(payload, getEnv("JWT_SECRET_KEY"), {
      expiresIn: "12h",
    });
  }
}
