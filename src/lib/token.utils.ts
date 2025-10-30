import { cookies } from "next/headers";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";
const EXPIRES_AT = "expires_at";

/**
 * ✅ Define cookies de autenticação
 * Funciona tanto em contexts síncronos quanto assíncronos (Next 15+)
 */
export async function setAuthCookies(accessToken: string, refreshToken: string, expiresIn: number) {
  const cookieStore = await cookies(); // ✅ compatível com Promise<ReadonlyRequestCookies>
  const expiresAt = Date.now() + expiresIn * 1000;

  cookieStore.set(ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set(REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set(EXPIRES_AT, expiresAt.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

/**
 * ✅ Lê cookies de autenticação
 */
export async function getAuthCookies() {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get(ACCESS_TOKEN)?.value,
    refreshToken: cookieStore.get(REFRESH_TOKEN)?.value,
    expiresAt: Number(cookieStore.get(EXPIRES_AT)?.value || 0),
  };
}

/**
 * ✅ Remove cookies de autenticação
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN);
  cookieStore.delete(REFRESH_TOKEN);
  cookieStore.delete(EXPIRES_AT);
}
