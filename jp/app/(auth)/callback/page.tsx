"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { insforge } from "@/lib/insforge-client";
import { useAuth } from "@/components/auth/AuthProvider";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";

  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function handleCallback() {
      try {
        const { data, error: authError } = await insforge.auth.getCurrentUser();

        if (!isMounted) return;

        if (authError || !data?.user) {
          setError(
            authError?.message || "Failed to complete authentication. Please try again."
          );
          return;
        }

        const authenticatedUser = await refreshUser();
        if (!authenticatedUser) {
          setError("Failed to establish the authenticated session. Please try again.");
          return;
        }

        window.location.href = returnTo;
      } catch (err) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : "Unexpected error during authentication callback";
        setError(msg);
      }
    }

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [router, returnTo, refreshUser]);

  if (error) {
    return (
      <div className="w-full max-w-[440px] mx-auto px-4 text-center">
        <div className="bg-surface border border-border rounded-2xl p-8 sm:p-10 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-surface-secondary border border-border flex items-center justify-center mx-auto mb-4 text-error">
            <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary">Authentication Failed</h2>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">{error}</p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-block bg-overlay-dark hover:bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] mx-auto px-4 text-center">
      <div className="bg-surface border border-border rounded-2xl p-8 sm:p-10 shadow-sm">
        <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <h2 className="mt-4 text-lg font-semibold text-text-primary">Completing sign in...</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Finalizing your credentials and taking you to your dashboard.
        </p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 bg-background">
      <Suspense
        fallback={
          <div className="w-full max-w-[440px] mx-auto px-4 text-center">
            <div className="bg-surface border border-border rounded-2xl p-8 sm:p-10 shadow-sm">
              <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-sm text-text-secondary">Processing sign in...</p>
            </div>
          </div>
        }
      >
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
