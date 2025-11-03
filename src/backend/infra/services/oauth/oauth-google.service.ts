// src/backend/infra/services/google-oauth.service.ts
import { IGoogleOAuthService, IGoogleOAuthTokens, IGoogleOAuthUser } from "@/backend/domain/services";
import axios from "axios";

export class GoogleOAuthService implements IGoogleOAuthService {
  private clientId = process.env.GOOGLE_CLIENT_ID!;
  private clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  private redirectUri = process.env.GOOGLE_REDIRECT_URI!;
  private tokenUri = "https://oauth2.googleapis.com/token";
  private userInfoUri = "https://www.googleapis.com/oauth2/v3/userinfo";
  private authUri = "https://accounts.google.com/o/oauth2/v2/auth";

  getAuthUrl(state?: string): string {
    const scope = ["openid", "email", "profile"].join(" ");
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope,
      access_type: "offline",
      prompt: "consent",
    });

    if (state) params.append("state", state);
    return `${this.authUri}?${params.toString()}`;
  }

  async getTokens(code: string): Promise<IGoogleOAuthTokens> {
    const params = new URLSearchParams({
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: "authorization_code",
    });

    const { data } = await axios.post(this.tokenUri, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      idToken: data.id_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      scope: data.scope,
    };
  }

  async getUserInfo(accessToken: string): Promise<IGoogleOAuthUser> {
    const { data } = await axios.get(this.userInfoUri, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      id: data.sub,
      name: data.name,
      email: data.email,
      picture: data.picture,
      givenName: data.given_name,
      familyName: data.family_name,
    };
  }

  async authenticate(code: string) {
    const tokens = await this.getTokens(code);
    const user = await this.getUserInfo(tokens.accessToken);
    return { tokens, user };
  }
}
