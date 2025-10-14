import { Account } from "@/backend/domain/entities";

interface AuthSignInProps {
  credentials: {
    accessToken: string;
  };
  user: {
    accountId: string;
    name: string;
    email: string;
  };
}

type IAuthSignInPresenterRaw = {
  account: Account;
  credentials: { accessToken: string };
};

export class AuthSignInPresenter {
  static toHttp(raw: IAuthSignInPresenterRaw): AuthSignInProps {
    return {
      credentials: {
        accessToken: raw.credentials.accessToken,
      },
      user: {
        accountId: raw.account.accountId,
        name: raw.account.name,
        email: raw.account.email,
      },
    };
  }
}
