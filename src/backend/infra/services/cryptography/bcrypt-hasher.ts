import { HashComparer, HashGenerator } from "@/backend/domain/cryptography";
import { compare as compareHash, hashSync } from "bcrypt";

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  async hash(plain: string): Promise<string> {
    return hashSync(plain, this.HASH_SALT_LENGTH);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await compareHash(plain, hash);
  }
}
