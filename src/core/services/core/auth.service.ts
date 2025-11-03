import { IHttpResponseSuccess } from "@/backend/core/types";
import {
  IAuthForgotPasswordDto,
  IAuthRefreshDto,
  IAuthSignUpDto,
  IAuthSignInDto,
  IAuthSignInWithGoogleDto,
  IAuthSignUpInWithGoogleDto,
} from "@/backend/domain/dtos";
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
  register(data: IAuthSignUpDto): Promise<IHttpResponseSuccess<IAuthServiceRegisterData>>;
  signIn(data: IAuthSignInDto): Promise<IHttpResponseSuccess<IAuthServiceSignInData>>;
  forgotPassword(data: IAuthForgotPasswordDto): Promise<IHttpResponseSuccess<{ status: "sent" | "scheduled" }>>;
  refreshToken(data: IAuthRefreshDto): Promise<IHttpResponseSuccess<IAuthServiceRefreshData>>;
  signInWithGoogle(data: IAuthSignInWithGoogleDto): Promise<IHttpResponseSuccess<IAuthServiceSignInData>>;
  signUpWithGoogle(data: IAuthSignUpInWithGoogleDto): Promise<IHttpResponseSuccess<IAuthServiceRegisterData>>;
}
