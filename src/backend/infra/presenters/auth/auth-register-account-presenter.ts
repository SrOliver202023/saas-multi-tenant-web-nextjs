import { Account } from "@/backend/domain/entities";

interface AuthRegisterProps {
  accountId: string;
  name: string;
  email: string;
  createdAt: Date;
}

export class AuthRegisterPresenter {
  static toHttp(raw: Account): AuthRegisterProps {
    return {
      accountId: raw.accountId,
      createdAt: raw.createdAt,
      email: raw.email,
      name: raw.name,
    };
  }
}
