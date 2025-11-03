import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") ?? "signIn";

  const res = NextResponse.redirect(new URL("/api/auth/signin/google", req.url));

  res.cookies.set("authWithGoogle", mode, {
    httpOnly: false,
    path: "/",
    maxAge: 60,
  });

  return res;
}
