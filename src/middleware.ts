import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/login", "/register", "/signup", "/api/public"];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path) && pathname);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 🔁 Evita loop: nunca redireciona se já estiver indo pro mesmo lugar
  const redirect = (path: string) => {
    if (pathname === path) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    return NextResponse.redirect(url);
  };

  // ✅ Usuário autenticado tentando acessar página pública → volta pra /home
  if (token && isPublic) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    return redirect(callbackUrl || "/home");
  }

  // 🚫 Usuário não autenticado tentando acessar página privada → manda pra /login
  if (!!!token && !!!isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname + (search || ""));
    return NextResponse.redirect(url);
  }

  // ✅ Tudo certo
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)"],
};
