import { cookies } from "next/headers";
import { createServerClient } from "@insforge/sdk/ssr";

export const createInsforgeServer = async (overrideToken?: string) => {
  const cookieStore = await cookies();
  const rawToken =
    overrideToken ||
    cookieStore.get("insforge_access_token")?.value ||
    cookieStore.get("access_token")?.value;

  const token = rawToken ? decodeURIComponent(rawToken.replace(/^Bearer\s+/i, "")) : undefined;

  return createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
    cookies: cookieStore,
    accessToken: token,
  });
};
