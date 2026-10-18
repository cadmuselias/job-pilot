"use client";

import Link from "next/link";
import { Play } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";

type CallToActionProps = Record<string, never>;

export function CallToAction({}: CallToActionProps) {
  const { user } = useAuth();
  const ctaHref = user ? "/dashboard" : "/login";

  return (
    <section className="py-12 sm:py-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-cta-gradient px-6 py-16 sm:py-20 text-center shadow-sm">
          {/* Headline - structured so 'a' never wraps onto its own line */}
          <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary tracking-tight leading-tight max-w-3xl mx-auto">
            <span className="block">
              Your next job search can{" "}
              <span className="whitespace-nowrap">feel a</span>
            </span>
            <span className="block">lot less overwhelming</span>
          </h2>

          <p className="relative mt-4 text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
            Set up your profile, upload your resume, and start finding matches in
            minutes.
          </p>

          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-overlay-dark hover:bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              <span>Get Started</span>
              <Play className="w-3.5 h-3.5 fill-white text-white" />
            </Link>

            <Link
              href="/find-jobs"
              className="inline-flex items-center bg-surface hover:bg-surface-secondary text-text-primary border border-border px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              Find Your First Match
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
