import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AuthService } from "@/infra/services/core";
import { cookies } from "next/headers";

/* ----------------------------------------
   Tipos vindos do backend
---------------------------------------- */
export interface BackendUser {
  userId: string;
  username: string;
  name: string;
  email: string;
  managerAccountId?: string;
  ownerAccountId?: string;
}

export interface BackendCredentials {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt?: number;
}

interface BackendSignInResponse {
  user: BackendUser;
  credentials: BackendCredentials;
}

/* ----------------------------------------
   Tipos estendidos
---------------------------------------- */
interface ExtendedJWT extends JWT {
  user?: BackendUser;
  credentials?: BackendCredentials & { expiresAt: number };
  mode?: "signIn" | "signUp";
  error?: string;
}

interface ExtendedSession extends Session {
  user?: BackendUser;
  credentials?: BackendCredentials;
  mode?: "signIn" | "signUp";
  error?: string;
}

/* ----------------------------------------
   User usado internamente no provider
---------------------------------------- */
interface CredentialsUser extends User {
  username: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/* ----------------------------------------
   Configuração principal do NextAuth
---------------------------------------- */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Senha", type: "password" },
      },

      async authorize(credentials): Promise<CredentialsUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const authService = new AuthService();
        const response = await authService.signIn({
          identifier: credentials.email,
          password: credentials.password,
        });

        const data: BackendSignInResponse | undefined = response?.data;

        if (!data?.user || !data?.credentials?.accessToken) {
          return null;
        }

        const { user, credentials: creds } = data;

        const credentialsUser: CredentialsUser = {
          id: user.userId,
          name: user.name,
          email: user.email,
          username: user.username,
          accessToken: creds.accessToken,
          refreshToken: creds.refreshToken,
          expiresIn: creds.expiresIn,
        };

        return credentialsUser;
      },
    }),
  ],

  callbacks: {
    /* ------------------------------
       JWT Callback
    ------------------------------ */
    async jwt({ token, account, profile, user }): Promise<ExtendedJWT> {
      const authService = new AuthService();
      const extToken: ExtendedJWT = { ...token };
      const cookieStore = await cookies();
      const googleMode = cookieStore.get("authWithGoogle")?.value as "signIn" | "signUp" | undefined;

      if (googleMode) extToken.mode = googleMode;

      // ✅ LOGIN VIA CREDENTIALS
      if (user && "accessToken" in user && "refreshToken" in user) {
        const credUser = user as CredentialsUser;

        extToken.user = {
          userId: credUser.id,
          username: credUser.username,
          name: credUser.name ?? "",
          email: credUser.email ?? "",
        };

        extToken.credentials = {
          accessToken: credUser.accessToken,
          refreshToken: credUser.refreshToken,
          expiresIn: credUser.expiresIn,
          expiresAt: Date.now() + credUser.expiresIn * 1000,
        };

        extToken.error = undefined;
      }

      // ✅ LOGIN VIA GOOGLE
      if (account?.provider === "google" && profile?.email) {
        try {
          const response = await authService.signInWithGoogle({
            email: profile.email,
            name: profile.name ?? "",
            googleId: profile.sub ?? "",
          });

          const data: BackendSignInResponse | undefined = response?.data;

          if (!data?.user || !data?.credentials?.accessToken) {
            extToken.user = undefined;
            extToken.credentials = undefined;
            extToken.error = "Falha ao autenticar com o Google.";
            return extToken;
          }

          extToken.user = data.user;
          extToken.credentials = {
            accessToken: data.credentials.accessToken,
            refreshToken: data.credentials.refreshToken,
            expiresIn: data.credentials.expiresIn,
            expiresAt: Date.now() + data.credentials.expiresIn * 1000,
          };
          extToken.error = undefined;
        } catch (error: unknown) {
          if (typeof error === "object" && error !== null && "response" in error && typeof (error as Record<string, unknown>).response === "object") {
            const status = (error as { response?: { status?: number } }).response?.status;

            if (status === 404) {
              // tenta cadastrar e logar
              await authService.signUpWithGoogle({
                email: profile.email,
                name: profile.name ?? "",
                googleId: profile.sub ?? "",
              });

              const signinResponse = await authService.signInWithGoogle({
                email: profile.email,
                name: profile.name ?? "",
                googleId: profile.sub ?? "",
              });

              const data: BackendSignInResponse | undefined = signinResponse?.data;

              if (!data?.user || !data?.credentials?.accessToken) {
                throw new Error("Sign-in após cadastro retornou inválido");
              }

              extToken.user = data.user;
              extToken.credentials = {
                accessToken: data.credentials.accessToken,
                refreshToken: data.credentials.refreshToken,
                expiresIn: data.credentials.expiresIn,
                expiresAt: Date.now() + data.credentials.expiresIn * 1000,
              };
              extToken.error = undefined;
            } else {
              extToken.user = undefined;
              extToken.credentials = undefined;
              extToken.error = status === 409 ? "Usuário já cadastrado com este Google." : "Falha ao autenticar com o Google.";
            }
          } else {
            extToken.user = undefined;
            extToken.credentials = undefined;
            extToken.error = "Erro desconhecido no fluxo do Google.";
          }
        }
      }

      // remove cookie temporário
      if (googleMode) cookieStore.delete("authWithGoogle");

      // garante consistência
      if (!extToken.user || !extToken.credentials) {
        extToken.user = undefined;
        extToken.credentials = undefined;
        extToken.error ??= "Falha na autenticação.";
      }

      return extToken;
    },

    /* ------------------------------
       Session Callback
    ------------------------------ */
    async session({ session, token }): Promise<ExtendedSession> {
      const extToken = token as ExtendedJWT;

      if (extToken.error) {
        return {
          ...session,
          user: undefined,
          credentials: undefined,
          mode: undefined,
          error: extToken.error,
        };
      }

      if (extToken.user && extToken.credentials) {
        return {
          ...session,
          user: extToken.user,
          credentials: extToken.credentials,
          mode: extToken.mode,
          error: undefined,
        };
      }

      return {
        ...session,
        user: undefined,
        credentials: undefined,
        mode: undefined,
        error: undefined,
      };
    },

    /* ------------------------------
       Redirect Callback
    ------------------------------ */
    async redirect({ baseUrl, url }): Promise<string> {
      if (url.startsWith("/")) {
        const target = new URL(url, baseUrl);
        if (target.pathname.startsWith("/api/auth/")) return `${baseUrl}/home`;
        if (target.pathname === "/login") return `${baseUrl}/home`;
        return target.toString();
      }

      if (url.includes("error=")) {
        const parsed = new URL(url);
        const err = parsed.searchParams.get("error");
        return `${baseUrl}/login?error=${encodeURIComponent(err ?? "")}`;
      }

      return `${baseUrl}/home`;
    },
  },

  pages: {
    signIn: "/login",
  },
};
