import type { NextAuthOptions, User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AuthService } from "@/infra/services/core";

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
  expiresAt?: number; // 👈 este campo existe no tipo esperado
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
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          const authService = new AuthService();
          const response = await authService.signIn({
            identifier: credentials.email,
            password: credentials.password,
          });

          const data = response?.data as BackendSignInResponse | undefined;

          if (!data?.user || !data?.credentials?.accessToken) {
            return null;
          }

          return {
            id: data.user.userId,
            name: data.user.name,
            email: data.user.email,
            username: data.user.username,
            accessToken: data.credentials.accessToken,
            refreshToken: data.credentials.refreshToken,
            expiresIn: data.credentials.expiresIn,
          } as unknown as User;
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    /* ------------------------------
       JWT Callback
    ------------------------------ */
    async jwt({ token, account, profile }) {
      const authService = new AuthService();

      if (account?.provider === "google" && profile?.email) {
        try {
          await authService.signUpWithGoogle({
            email: profile.email,
            name: profile.name ?? "",
            googleId: profile.sub ?? "",
          });

          const response = await authService.signInWithGoogle({
            email: profile.email,
            name: profile.name ?? "",
            googleId: profile.sub ?? "",
          });

          const data = response.data;
          (token as ExtendedJWT).user = data.user;

          token.credentials = {
            accessToken: data.credentials.accessToken,
            refreshToken: data.credentials.refreshToken,
            expiresIn: data.credentials.expiresIn,
            expiresAt: Date.now() + data.credentials.expiresIn * 1000, // ✅ novo campo
          };
        } catch (error: unknown) {
          const err = error as { response?: { status?: number } };
          if (err.response?.status === 409) {
            (token as ExtendedJWT).error = "Usuário já cadastrado com este Google.";
          } else {
            (token as ExtendedJWT).error = "Falha ao autenticar com o Google.";
          }
        }
      }

      return token;
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
        mode: extToken.mode,
        error: extToken.error,
      };
    },

    /* ------------------------------
       Redirect Callback
    ------------------------------ */
    async redirect({ baseUrl, url }) {
      // Se o redirecionamento já vai pra uma rota interna válida, deixa passar
      if (url.startsWith("/")) {
        const target = new URL(url, baseUrl);

        // Evita redirecionar para /api/auth/callback/google (loop)
        if (target.pathname.startsWith("/api/auth/")) return `${baseUrl}/home`;

        // Evita redirecionar para /login (loop caso já autenticado)
        if (target.pathname === "/login") return `${baseUrl}/home`;

        return target.toString();
      }

      // Se tiver erro, manda para login
      if (url.includes("error=")) {
        const parsed = new URL(url);
        const err = parsed.searchParams.get("error");
        return `${baseUrl}/login?error=${encodeURIComponent(err ?? "")}`;
      }

      // Redirecionamento padrão
      return `${baseUrl}/home`;
    },
  },

  pages: {
    signIn: "/login",
  },
};
