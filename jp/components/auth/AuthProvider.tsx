"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { UserSchema } from "@insforge/sdk";
import posthog from "posthog-js";

import { insforge } from "@/lib/insforge-client";

const isPostHogConfigured = Boolean(
  (process.env.NEXT_PUBLIC_POSTHOG_KEY ||
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

type AuthContextType = {
  user: UserSchema | null;
  loading: boolean;
  signInWithOAuth: (
    provider: "google" | "github",
    returnTo?: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<UserSchema | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getAuthCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)insforge_access_token=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function syncAuthCookie(accessToken: string | null): void {
  if (typeof document === "undefined") return;
  if (accessToken) {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `insforge_access_token=${encodeURIComponent(
      accessToken,
    )}; path=/; max-age=604800; SameSite=Lax${secure}`;
  } else {
    document.cookie =
      "insforge_access_token=; path=/; max-age=0; SameSite=Lax";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const identifiedUserId = useRef<string | null>(null);

  const resetPostHog = useCallback(() => {
    if (!isPostHogConfigured) return;

    const hasIdentifiedUser =
      identifiedUserId.current || posthog.get_property("$user_id");

    if (hasIdentifiedUser) {
      posthog.reset();
      identifiedUserId.current = null;
    }
  }, []);

  const identifyUser = useCallback((authenticatedUser: UserSchema) => {
    if (!isPostHogConfigured) return;

    const persistedUserId = posthog.get_property("$user_id");
    if (
      (identifiedUserId.current &&
        identifiedUserId.current !== authenticatedUser.id) ||
      (typeof persistedUserId === "string" &&
        persistedUserId !== authenticatedUser.id)
    ) {
      posthog.reset();
    }

    if (posthog.get_distinct_id() !== authenticatedUser.id) {
      posthog.identify(authenticatedUser.id, {
        email: authenticatedUser.email,
        ...(authenticatedUser.profile?.name
          ? { name: authenticatedUser.profile.name }
          : {}),
      });
    }

    identifiedUserId.current = authenticatedUser.id;
  }, []);

  const refreshUser = useCallback(async (): Promise<UserSchema | null> => {
    try {
      const clientAny = insforge as unknown as {
        tokenManager?: {
          getAccessToken?: () => string | null;
          getSession?: () => { accessToken?: string } | null;
          saveSession?: (session: { accessToken: string; user: UserSchema }) => void;
        };
      };

      let activeToken =
        clientAny.tokenManager?.getAccessToken?.() ||
        clientAny.tokenManager?.getSession?.()?.accessToken ||
        null;

      const cookieToken = getAuthCookie();

      // If client has no token in memory, but a cookie exists, seed the client
      if (!activeToken && cookieToken) {
        insforge.setAccessToken(cookieToken);
        activeToken = cookieToken;
      }

      // If we have an active token, fetch user directly from backend sessions endpoint
      if (activeToken) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
          const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;
          const res = await fetch(`${baseUrl}/api/auth/sessions/current`, {
            headers: {
              Authorization: `Bearer ${activeToken}`,
              apikey: anonKey || "",
            },
          });

          if (res.ok) {
            const sessionData = await res.json();
            if (sessionData?.user) {
              const u = sessionData.user;
              clientAny.tokenManager?.saveSession?.({
                accessToken: activeToken,
                user: u,
              });
              syncAuthCookie(activeToken);
              identifyUser(u);
              setUser(u);
              return u;
            }
          } else if (res.status === 401) {
            // Token is explicitly expired or invalid
            resetPostHog();
            setUser(null);
            syncAuthCookie(null);
            return null;
          }
        } catch (fetchErr) {
          console.warn("[AuthProvider] Session verification network issue:", fetchErr);
        }
      }

      const { data, error } = await insforge.auth.getCurrentUser();

      if (data?.user) {
        if (!activeToken) {
          activeToken =
            clientAny.tokenManager?.getAccessToken?.() ||
            clientAny.tokenManager?.getSession?.()?.accessToken ||
            cookieToken;
        }

        if (activeToken) {
          syncAuthCookie(activeToken);
        }
        identifyUser(data.user);
        setUser(data.user);
        return data.user;
      }

      // Only clear cookie if server explicitly returned an unauthorized error
      // or if there is no token anywhere.
      const isExplicitUnauthorized =
        error &&
        (error.statusCode === 401 ||
          error.message?.toLowerCase().includes("unauthorized") ||
          error.message?.toLowerCase().includes("jwt expired"));

      if (isExplicitUnauthorized || (!cookieToken && !activeToken)) {
        resetPostHog();
        setUser(null);
        syncAuthCookie(null);
        return null;
      }

      return null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, [identifyUser, resetPostHog]);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (isMounted) {
        const cookieToken = getAuthCookie();
        if (cookieToken) {
          insforge.setAccessToken(cookieToken);
        }
        await refreshUser();
      }
    };

    void initializeAuth();

    const unsubscribe = insforge.auth.onAuthStateChange(async (event) => {
      if (event === "signedIn" || event === "tokenRefreshed") {
        await refreshUser();
      } else if (event === "signedOut") {
        resetPostHog();
        setUser(null);
        syncAuthCookie(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [refreshUser, resetPostHog]);

  const signInWithOAuth = async (
    provider: "google" | "github",
    returnTo?: string,
  ): Promise<void> => {
    const origin = window.location.origin;
    const target = returnTo || "/";
    const redirectUrl = `${origin}/callback?returnTo=${encodeURIComponent(target)}`;

    await insforge.auth.signInWithOAuth(provider, {
      redirectTo: redirectUrl,
      additionalParams:
        provider === "google" ? { prompt: "select_account" } : undefined,
    });
  };

  const signOut = async (): Promise<void> => {
    try {
      await insforge.auth.signOut();
    } finally {
      resetPostHog();
      setUser(null);
      syncAuthCookie(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithOAuth,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
