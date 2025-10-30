import { IHttpResponseSuccess } from "@/backend/core/types";
import { IAuthForgotPasswordDto, IAuthRefreshDto, IAuthRegisterDto, IAuthSignInDto } from "@/backend/domain/dtos";
import { Account, User } from "@/backend/domain/entities";

export interface IAuthServiceRegisterData {
  account: Account;
  user: User;
}
export interface IAuthServiceSignInData {
  account?: Account;
  user: User;
  credentials: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export type IAuthServiceRefreshData = IAuthServiceSignInData;

export interface IAuthService {
  register(data: IAuthRegisterDto): Promise<IHttpResponseSuccess<IAuthServiceRegisterData>>;
  signIn(data: IAuthSignInDto): Promise<IHttpResponseSuccess<IAuthServiceSignInData>>;
  forgotPassword(data: IAuthForgotPasswordDto): Promise<IHttpResponseSuccess<{ status: "sent" | "scheduled" }>>;
  refreshToken(data: IAuthRefreshDto): Promise<IHttpResponseSuccess<IAuthServiceRefreshData>>;
}
