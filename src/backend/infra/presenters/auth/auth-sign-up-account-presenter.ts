import { Account, User } from "@/backend/domain/entities";

interface AuthSignUpProps {
  accountId: string;
  name: string;
  email: string;
  createdAt: Date;
}

export class AuthSignUpPresenter {
  static toHttp(raw: { account: Account; user: User }): AuthSignUpProps {
    return {
      accountId: raw.account.accountId,
      createdAt: raw.account.createdAt,
      email: raw.user.email,
      name: raw.user.name,
    };
  }
}
