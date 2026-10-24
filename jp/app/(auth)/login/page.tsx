"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Lock, Sparkles } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";

function LoginForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";

  const { user, loading: authLoading, signInWithOAuth } = useAuth();
  const [submittingProvider, setSubmittingProvider] = useState<"google" | "github" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (!authLoading && user && !redirectedRef.current) {
      const hasCookie =
        typeof document !== "undefined" &&
        document.cookie.includes("insforge_access_token=");

      if (hasCookie) {
        redirectedRef.current = true;
        const target =
          returnTo.startsWith("/login") || returnTo === "/callback"
            ? "/dashboard"
            : returnTo;
        window.location.href = target;
      }
    }
  }, [user, authLoading, returnTo]);

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    try {
      setErrorMessage(null);
      setSubmittingProvider(provider);
      await signInWithOAuth(provider, returnTo);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to initiate authentication";
      setErrorMessage(message);
      setSubmittingProvider(null);
    }
  };

  return (
    <div className="w-full max-w-[460px] mx-auto">
      {/* Elevated Glass Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/95 backdrop-blur-xl p-8 sm:p-10 shadow-xl transition-all before:absolute before:inset-x-8 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-accent/40 before:to-transparent">
        {/* Header Icon Badge */}
        <div className="w-12 h-12 rounded-2xl bg-accent-light/50 border border-accent/20 flex items-center justify-center mx-auto mb-4 text-accent shadow-xs">
          <Sparkles className="w-6 h-6 stroke-[2.2]" />
        </div>

        {/* Brand Logo & Title */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
            <Image
              src="/logo.png"
              alt="JobPilot"
              width={140}
              height={40}
              priority
              className="h-8 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="mt-5 text-2xl sm:text-[28px] font-bold tracking-tight text-text-primary leading-tight">
            Welcome to JobPilot
          </h1>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
            Sign in to start matching roles, researching companies, and tailoring resumes in seconds.
          </p>

          {/* Feature Highlight Chips */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-secondary border border-border text-[11px] font-medium text-text-secondary">
              <Check className="w-3 h-3 text-success" />
              Instant matching
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-secondary border border-border text-[11px] font-medium text-text-secondary">
              <Check className="w-3 h-3 text-success" />
              Company dossiers
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-secondary border border-border text-[11px] font-medium text-text-secondary">
              <Check className="w-3 h-3 text-success" />
              No password needed
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-surface-secondary border border-border text-xs text-text-primary animate-in fade-in">
            <span className="font-semibold text-text-dark">Authentication error:</span>{" "}
            {errorMessage}
          </div>
        )}

        {/* OAuth Action Buttons */}
        <div className="space-y-3">
          {/* Google Button */}
          <button
            type="button"
            onClick={() => handleOAuthSignIn("google")}
            disabled={submittingProvider !== null || authLoading}
            className="group relative w-full h-12 px-4 flex items-center justify-center gap-3.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-text-primary text-sm font-semibold transition-all shadow-xs hover:shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {submittingProvider === "google"
                ? "Connecting to Google..."
                : "Continue with Google"}
            </span>
          </button>

          {/* GitHub Button */}
          <button
            type="button"
            onClick={() => handleOAuthSignIn("github")}
            disabled={submittingProvider !== null || authLoading}
            className="group relative w-full h-12 px-4 flex items-center justify-center gap-3.5 rounded-xl bg-overlay-dark hover:bg-black text-white text-sm font-semibold transition-all shadow-xs hover:shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0 fill-current transition-transform group-hover:scale-105" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>
              {submittingProvider === "github"
                ? "Connecting to GitHub..."
                : "Continue with GitHub"}
            </span>
          </button>
        </div>

        {/* Security Indicator */}
        <div className="mt-7 pt-5 border-t border-border flex items-center justify-center gap-1.5 text-xs text-text-muted">
          <Lock className="w-3.5 h-3.5" />
          <span>Encrypted connection • InsForge OAuth 2.0</span>
        </div>

        {/* Legal Disclaimer */}
        <p className="mt-4 text-[11px] text-text-muted text-center leading-relaxed">
          By continuing, you agree to JobPilot’s{" "}
          <Link href="/" className="text-text-secondary hover:text-accent underline transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/" className="text-text-secondary hover:text-accent underline transition-colors">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-background bg-diagonal-stripes overflow-hidden">
      {/* Ambient background mesh gradients */}
      <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[760px] h-[480px] bg-hero-gradient rounded-full blur-3xl opacity-80 pointer-events-none" />
      <div className="absolute -bottom-24 right-[-10%] w-[450px] h-[450px] bg-accent-light/40 rounded-full blur-[110px] pointer-events-none" />

      {/* Top Bar with Return Link */}
      <header className="relative z-10 max-w-[1440px] w-full mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="JobPilot"
            width={124}
            height={36}
            priority
            className="h-8 w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary px-3.5 py-1.5 rounded-full border border-border bg-surface/80 backdrop-blur-sm transition-all hover:bg-surface shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to home</span>
        </Link>
      </header>

      {/* Centered Main Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <Suspense
          fallback={
            <div className="w-full max-w-[460px] mx-auto text-center">
              <div className="bg-surface/95 border border-border rounded-3xl p-10 shadow-xl backdrop-blur-xl">
                <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-sm text-text-secondary">Loading sign in...</p>
              </div>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-text-muted">
        <span>© 2026 JobPilot Inc. AI-Powered Job Search Copilot.</span>
      </footer>
    </div>
  );
}
