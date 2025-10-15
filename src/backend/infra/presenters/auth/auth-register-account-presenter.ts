import { Account, User } from "@/backend/domain/entities";

interface AuthRegisterProps {
  accountId: string;
  name: string;
  email: string;
  createdAt: Date;
}

export class AuthRegisterPresenter {
  static toHttp(raw: { account: Account; user: User }): AuthRegisterProps {
    return {
      accountId: raw.account.accountId,
      createdAt: raw.account.createdAt,
      email: raw.user.email,
      name: raw.user.name,
    };
  }
}
