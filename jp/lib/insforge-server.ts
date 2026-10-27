import { cookies } from "next/headers";
import { createServerClient, refreshAuth } from "@insforge/sdk/ssr";

function isJwtExpired(token: string | null | undefined, leewaySeconds = 30): boolean {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const jsonStr = Buffer.from(parts[1], "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr);
    if (typeof payload.exp !== "number") return false;
    return payload.exp * 1000 <= Date.now() + leewaySeconds * 1000;
  } catch {
    return true;
  }
}

export const createInsforgeServer = async (overrideToken?: string) => {
  const cookieStore = await cookies();

  // 1. Check override token if provided and non-expired
  let token: string | undefined =
    overrideToken && !isJwtExpired(overrideToken)
      ? overrideToken.trim()
      : undefined;

  // 2. Check cookies if override token was missing or expired
  if (!token) {
    const rawCookieToken =
      cookieStore.get("insforge_access_token")?.value ||
      cookieStore.get("access_token")?.value;

    const cookieToken = rawCookieToken
      ? decodeURIComponent(rawCookieToken.replace(/^Bearer\s+/i, ""))
      : undefined;

    if (cookieToken && !isJwtExpired(cookieToken)) {
      token = cookieToken;
    }
  }

  // 3. If access token is still missing/expired, attempt server-side refresh
  if (!token) {
    try {
      const refreshResult = await refreshAuth({
        baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
        anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
        cookies: cookieStore,
      });
      if (refreshResult.accessToken) {
        token = refreshResult.accessToken;
      }
    } catch {
      // Refresh token missing or expired; continue with unauthenticated client
    }
  }

  return createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
    cookies: cookieStore,
    accessToken: token,
  });
};

