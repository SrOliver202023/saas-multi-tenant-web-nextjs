import { Either, left, right } from "@/backend/core";
import { AwaitSecondsNewPinError, InvalidParseCacheError } from "../../errors";
import { ICacheRepository, IMailRepository } from "../../repositories";
import { Security } from "../../security";
import { MailForgotPasswordTemplate } from "../../templates/email";

type IMailForgotPasswordRequest = {
  email: string;
  name: string;
};

type CachedPinData = {
  pin: string;
  expiresAt: number;
  lastSentAt: number;
};

export class MailForgotPasswordService {
  constructor(private readonly mailRepository: IMailRepository, private readonly cacheRepository: ICacheRepository) {}

  async execute({ email, name }: IMailForgotPasswordRequest): Promise<Either<Error, string>> {
    const key = `PIN_FORGOT_PASSWORD:${email}`;
    const now = Date.now();
    const seconds = 60;
    const cooldownTime = seconds * 1000;

    const cachedData = await this.cacheRepository.get<CachedPinData>(key);

    if (cachedData) {
      try {
        const timeSinceLastSent = now - cachedData.lastSentAt;
        if (timeSinceLastSent < cooldownTime) {
          const remainingSeconds = Math.ceil((cooldownTime - timeSinceLastSent) / 1000);
          return left(new AwaitSecondsNewPinError(remainingSeconds));
        }

        if (cachedData.expiresAt > now) {
          const html = MailForgotPasswordTemplate.template({
            email,
            pin: cachedData.pin,
            expireInHours: 2,
            name,
          });

          const updatedData: CachedPinData = {
            ...cachedData,
            lastSentAt: now,
          };

          await this.cacheRepository.set(key, JSON.stringify(updatedData));
          await this.mailRepository.send({ html, to: email, subject: "Recover your password" });

          return right("Recovery code re-sent to email service");
        }
      } catch (err) {
        return left(err instanceof Error ? new Error(err.message) : new InvalidParseCacheError());
      }
    }

    const pin = Security.generatePin({ length: 6 });
    const expireInHours = 2;
    const expiresAt = now + expireInHours * 60 * 60 * 1000; // 2 horas em ms

    const html = MailForgotPasswordTemplate.template({
      email,
      pin,
      expireInHours,
      name,
    });

    const dataToCache: CachedPinData = {
      pin,
      expiresAt,
      lastSentAt: now,
    };

    await this.cacheRepository.set(key, JSON.stringify(dataToCache));
    await this.mailRepository.send({ html, to: email, subject: "Recover your password" });

    return right("Recovery code sent to email service");
  }
}
