import type { NextAuthOptions, User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthService } from "@/infra/services/core";
import { setAuthCookies } from "./token.utils";
import GoogleProvider from "next-auth/providers/google"; // ✅ novo import

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
}

interface BackendSignInResponse {
  user: BackendUser;
  credentials: BackendCredentials;
}

/* ----------------------------------------
   Extensões do token e da sessão NextAuth
---------------------------------------- */
interface ExtendedJWT extends JWT {
  user?: BackendUser;
  credentials?: BackendCredentials & { expiresAt: number };
}

interface ExtendedSession extends Session {
  user?: BackendUser;
  credentials?: BackendCredentials;
}

/* ----------------------------------------
   Configuração principal do NextAuth
---------------------------------------- */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<User | null> {
        console.log("🟡 [authorize] Tentando login com:", credentials);

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          const authService = new AuthService();
          const response = await authService.signIn({
            identifier: credentials.email,
            password: credentials.password,
          });

          console.log("🟢 [authorize] Resposta da API:", response);

          const data = response?.data as BackendSignInResponse | undefined;
          if (!data?.user || !data?.credentials?.accessToken) {
            console.error("❌ [authorize] Dados inválidos:", data);
            return null;
          }

          console.log("✅ [authorize] Login bem-sucedido:", data.user);

          // Retorna o usuário + tokens para o callback `jwt`
          return {
            id: data.user.userId,
            name: data.user.name,
            email: data.user.email,
            username: data.user.username,
            accessToken: data.credentials.accessToken,
            refreshToken: data.credentials.refreshToken,
            expiresIn: data.credentials.expiresIn,
          } as unknown as User;
        } catch (err) {
          console.error("🔥 [authorize] Erro no login:", err);
          throw new Error("Login failed");
        }
      },
    }),
  ],

  callbacks: {
    /* ------------------------------
       JWT Callback
    ------------------------------ */
    async jwt({ token, user, account, profile }): Promise<JWT> {
      // 🔹 LOGIN VIA GOOGLE
      if (account?.provider === "google" && profile?.email) {
        try {
          const response = await authService.signInWithGoogle({
            email: profile.email,
            name: profile.name || "",
            googleId: profile.sub,
          });

          const data = response.data;

          token.user = {
            userId: data.user.userId,
            name: data.user.name,
            email: data.user.email,
          };

          token.credentials = {
            accessToken: data.credentials.accessToken,
            refreshToken: data.credentials.refreshToken,
            expiresIn: Date.now() + data.credentials.expiresIn * 1000,
          };
        } catch (error) {
          console.error("Erro ao autenticar com Google:", error);
        }
      }

      const t = token as ExtendedJWT;

      // Primeiro login: user vem do authorize()
      if (user) {
        const u = user as User & {
          username?: string;
          accessToken?: string;
          refreshToken?: string;
          expiresIn?: number;
        };

        t.user = {
          userId: u.id,
          name: u.name ?? "",
          email: u.email ?? "",
          username: u.username ?? "",
        };

        if (u.accessToken) {
          t.credentials = {
            accessToken: u.accessToken,
            refreshToken: u.refreshToken ?? "",
            expiresIn: u.expiresIn ?? 3600,
            expiresAt: Date.now() + (u.expiresIn ?? 3600) * 1000,
          };
        }

        console.log("✅ [jwt] Token inicial criado:", t);
      }

      // Atualiza token se expirado
      if (t.credentials?.expiresAt && Date.now() > t.credentials.expiresAt) {
        console.warn("🔁 [jwt] Token expirado, tentando refresh...");

        try {
          const authService = new AuthService();
          const res = await authService.refreshToken({
            refreshToken: t.credentials.refreshToken,
          });

          const creds = res.data.credentials as BackendCredentials;
          t.credentials = {
            ...creds,
            expiresAt: Date.now() + creds.expiresIn * 1000,
          };

          console.log("✅ [jwt] Token renovado com sucesso:", t.credentials);
          await setAuthCookies(creds.accessToken, creds.refreshToken, creds.expiresIn);
        } catch (err) {
          console.error("❌ [jwt] Falha ao atualizar token:", err);
          t.credentials = undefined;
        }
      }

      return t as JWT;
    },

    /* ------------------------------
       Session Callback
    ------------------------------ */
    async session({ session, token }): Promise<ExtendedSession> {
      const extToken = token as ExtendedJWT;

      return {
        ...session,
        user: extToken.user,
        credentials: extToken.credentials,
      };
    },

    /* ------------------------------
       Redirect Callback
    ------------------------------ */
    async redirect({ baseUrl }) {
      console.log("➡️ [redirect] Redirecionando para /inicio");
      return `${baseUrl}/inicio`;
    },
  },

  pages: {
    signIn: "/login",
  },
};
