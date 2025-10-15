import { Account, User } from "@/backend/domain/entities";

interface AuthRefreshProps {
  credentials: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  user: {
    userId: string;
    accountId?: string;
    name: string;
    email: string;
  };
}

type IAuthRefreshPresenterRaw = {
  account?: Account;
  user: User;
  credentials: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
};

export class AuthRefreshPresenter {
  static toHttp(raw: IAuthRefreshPresenterRaw): AuthRefreshProps {
    return {
      credentials: {
        accessToken: raw.credentials.accessToken,
        expiresIn: raw.credentials.expiresIn,
        refreshToken: raw.credentials.refreshToken,
      },
      user: {
        userId: raw.user.userId,
        name: raw.user.name,
        email: raw.user.email,
        accountId: raw.account?.accountId,
      },
    };
  }
}
