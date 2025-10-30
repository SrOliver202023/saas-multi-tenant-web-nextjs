import { Account, User } from "@/backend/domain/entities";

export interface IAuthenticationProps {
  credentials: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  user: {
    userId: string;
    username: string;
    name: string;
    email: string;
    managerAccountId?: string;
    ownerAccountId?: string;
  };
}

type IAuthSignInPresenterRaw = {
  account?: Account;
  user: User;
  credentials: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
};

export class AuthSignInPresenter {
  static toHttp(raw: IAuthSignInPresenterRaw): IAuthenticationProps {
    return {
      credentials: {
        accessToken: raw.credentials.accessToken,
        refreshToken: raw.credentials.refreshToken,
        expiresIn: raw.credentials.expiresIn,
      },
      user: {
        userId: raw.user.userId,
        email: raw.user.email,
        name: raw.user?.name,
        username: raw.user.username,
        managerAccountId: raw.user.managerAccountId,
        ownerAccountId: raw.user.ownedAccountId,
      },
    };
  }
}
