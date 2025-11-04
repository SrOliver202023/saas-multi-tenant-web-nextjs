import { NextRequest, NextResponse } from "next/server";

/**
 * Inicia o login via Google e define o modo (signIn/signUp).
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") ?? "signIn";

  // Redireciona para o provider Google do NextAuth
  const signInUrl = new URL("/api/auth/signin/google", req.url);
  signInUrl.searchParams.set("callbackUrl", `${url.origin}/home`);

  const res = NextResponse.redirect(signInUrl);

  // Cookie temporário (1 minuto)
  res.cookies.set("authWithGoogle", mode, {
    httpOnly: false, // pode ser lido pelo lado do servidor no App Router
    sameSite: "lax",
    path: "/",
    maxAge: 60,
  });

  return res;
}
