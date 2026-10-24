import { cookies } from "next/headers";
import { createServerClient } from "@insforge/sdk/ssr";

export const createInsforgeServer = async () => {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get("insforge_access_token")?.value;
  const token = rawToken ? decodeURIComponent(rawToken) : undefined;

  return createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
    cookies: cookieStore,
    accessToken: token,
  });
};
