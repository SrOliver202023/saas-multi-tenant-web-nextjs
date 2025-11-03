import { IHttpResponseSuccess } from "@/backend/core/types";
import { IAuthSignUpDto, IAuthSignInDto, IAuthForgotPasswordDto, IAuthRefreshDto, IAuthSignInWithGoogleDto } from "@/backend/domain/dtos";
import { IAuthService, IAuthServiceRefreshData, IAuthServiceRegisterData, IAuthServiceSignInData } from "@/core/services/core";
import { corePublicApi } from "@/infra/apis";

export class AuthService implements IAuthService {
  async signUpWithGoogle(data: IAuthSignInWithGoogleDto): Promise<IHttpResponseSuccess<IAuthServiceRegisterData>> {
    const result = await corePublicApi.post("/auth/register/google", data);
    return result.data;
  }

  async register(data: IAuthSignUpDto): Promise<IHttpResponseSuccess<IAuthServiceRegisterData>> {
    const result = await corePublicApi.post("/auth/register", data);
    return result.data;
  }

  async signIn(data: IAuthSignInDto): Promise<IHttpResponseSuccess<IAuthServiceSignInData>> {
    const result = await corePublicApi.post("/auth/login", data);
    return result.data;
  }

  async forgotPassword(data: IAuthForgotPasswordDto): Promise<IHttpResponseSuccess<{ status: "sent" | "scheduled" }>> {
    const result = await corePublicApi.post("/auth/forgot-password", data);
    return result.data;
  }

  async refreshToken(data: IAuthRefreshDto): Promise<IHttpResponseSuccess<IAuthServiceRefreshData>> {
    const result = await corePublicApi.post("/auth/refresh", data);
    return result.data;
  }

  async signInWithGoogle(data: IAuthSignInWithGoogleDto): Promise<IHttpResponseSuccess<IAuthServiceSignInData>> {
    const result = await corePublicApi.post("/auth/login/google", data);
    return result.data;
  }
}
