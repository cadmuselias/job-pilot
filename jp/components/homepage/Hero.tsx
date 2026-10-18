"use client";

import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";

type HeroProps = Record<string, never>;

export function Hero({}: HeroProps) {
  const { user } = useAuth();
  const ctaHref = user ? "/dashboard" : "/login";

  return (
    <section className="w-full pt-6 sm:pt-8 pb-12 sm:pb-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Hero Card Container with Gradient and Border */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-hero-gradient shadow-sm pt-14 sm:pt-20 pb-8 sm:pb-12 text-center">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-[60px] font-bold tracking-tight text-text-primary leading-[1.14] max-w-4xl mx-auto px-4">
            Job hunting is hard.
            <br />
            Your tools shouldn’t be.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed px-4">
            Stop applying blind. JobPilot finds the jobs, researches the companies, and
            gives you everything you need to stand out.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 px-4">
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

          {/* Dashboard Preview Image */}
          <div className="mt-12 sm:mt-16 max-w-[1040px] mx-auto px-4 sm:px-8">
            <div className="relative mx-auto rounded-2xl">
              <Image
                src="/images/dashboard-demo.png"
                alt="JobPilot Dashboard Preview"
                width={1040}
                height={580}
                priority
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
