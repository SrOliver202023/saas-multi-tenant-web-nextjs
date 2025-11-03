// src/backend/core/interfaces/i-google-oauth-service.ts

export interface IGoogleOAuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken: string;
  expiresIn: number;
  tokenType: string;
  scope?: string;
}

export interface IGoogleOAuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  givenName?: string;
  familyName?: string;
}

/**
 * Contrato da camada de domínio para provedores OAuth2 do Google
 */
export interface IGoogleOAuthService {
  /**
   * Gera a URL de autorização para redirecionar o usuário
   */
  getAuthUrl(state?: string): string;

  /**
   * Troca o "authorization code" pelos tokens OAuth2
   */
  getTokens(code: string): Promise<IGoogleOAuthTokens>;

  /**
   * Busca as informações básicas do usuário autenticado
   */
  getUserInfo(accessToken: string): Promise<IGoogleOAuthUser>;

  /**
   * Executa o fluxo completo de autenticação (troca o code e retorna user + tokens)
   */
  authenticate(code: string): Promise<{
    tokens: IGoogleOAuthTokens;
    user: IGoogleOAuthUser;
  }>;
}
