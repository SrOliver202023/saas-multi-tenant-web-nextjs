// src/backend/core/interfaces/i-oauth-service.ts

export interface IOAuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn: number;
  tokenType?: string;
  scope?: string;
}

export interface IOAuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

/**
 * Contrato genérico para qualquer serviço OAuth2
 */
export interface IOAuthService {
  getAuthUrl(state?: string): string;
  getTokens(code: string): Promise<IOAuthTokens>;
  getUserInfo(accessToken: string): Promise<IOAuthUser>;
  authenticate(code: string): Promise<{ tokens: IOAuthTokens; user: IOAuthUser }>;
}
