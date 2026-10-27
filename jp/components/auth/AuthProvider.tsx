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
  getToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isJwtExpired(token: string | null | undefined, leewaySeconds = 45): boolean {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );
    const payload = JSON.parse(atob(padded));
    if (typeof payload.exp !== "number") return false;
    return payload.exp * 1000 <= Date.now() + leewaySeconds * 1000;
  } catch {
    return true;
  }
}

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

      // If we have an active non-expired token, verify directly from backend
      if (activeToken && !isJwtExpired(activeToken, 30)) {
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
          }
        } catch (fetchErr) {
          console.warn("[AuthProvider] Session verification network issue:", fetchErr);
        }
      }

      // If token is missing, expired, or failed verification, attempt session refresh
      try {
        const { data: refreshData } = await insforge.auth.refreshSession();
        if (refreshData?.accessToken && refreshData.user) {
          clientAny.tokenManager?.saveSession?.({
            accessToken: refreshData.accessToken,
            user: refreshData.user,
          });
          insforge.setAccessToken(refreshData.accessToken);
          syncAuthCookie(refreshData.accessToken);
          identifyUser(refreshData.user);
          setUser(refreshData.user);
          return refreshData.user;
        }
      } catch (refErr) {
        console.warn("[AuthProvider] refreshSession attempt failed:", refErr);
      }

      // Fallback: getCurrentUser
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
      // and refresh token could not renew the session.
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

  const getToken = useCallback(async (): Promise<string | null> => {
    const clientAny = insforge as unknown as {
      tokenManager?: {
        getAccessToken?: () => string | null;
        getSession?: () => { accessToken?: string } | null;
      };
    };

    let token =
      clientAny.tokenManager?.getAccessToken?.() ||
      clientAny.tokenManager?.getSession?.()?.accessToken ||
      null;

    if (!token) {
      token = getAuthCookie();
      if (token) {
        insforge.setAccessToken(token);
      }
    }

    if (token && !isJwtExpired(token, 45)) {
      return token;
    }

    // Token missing or expired: perform refresh
    try {
      const { data } = await insforge.auth.refreshSession();
      if (data?.accessToken) {
        insforge.setAccessToken(data.accessToken);
        syncAuthCookie(data.accessToken);
        if (data.user) {
          setUser(data.user);
          identifyUser(data.user);
        }
        return data.accessToken;
      }
    } catch (refErr) {
      console.warn("[AuthProvider] Session refresh in getToken failed:", refErr);
    }

    // Fallback: getCurrentUser
    try {
      const { data } = await insforge.auth.getCurrentUser();
      if (data?.user) {
        const refreshedToken =
          clientAny.tokenManager?.getAccessToken?.() ||
          clientAny.tokenManager?.getSession?.()?.accessToken ||
          getAuthCookie();
        if (refreshedToken) {
          syncAuthCookie(refreshedToken);
          return refreshedToken;
        }
      }
    } catch {}

    return token && !isJwtExpired(token, 0) ? token : null;
  }, [identifyUser]);

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
        getToken,
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
