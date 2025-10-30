import { Account, User } from "@/backend/domain/entities";
import { IAuthenticationProps } from "./auth-sign-in-account-presenter";

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
  static toHttp(raw: IAuthRefreshPresenterRaw): IAuthenticationProps {
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
