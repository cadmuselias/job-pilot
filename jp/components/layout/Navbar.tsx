"use client";

import Link from "next/link";
import Image from "next/image";

import { useAuth } from "@/components/auth/AuthProvider";

type NavbarProps = Record<string, never>;

export function Navbar({}: NavbarProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-surface border-b border-border">
      <div className="max-w-[1440px] mx-auto h-16 px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="JobPilot"
            width={124}
            height={36}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-text-dark hover:text-accent transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/find-jobs"
            className="text-sm font-medium text-text-dark hover:text-accent transition-colors"
          >
            Find Jobs
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-text-dark hover:text-accent transition-colors"
          >
            Profile
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="bg-overlay-dark hover:bg-black text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors inline-block"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-xs text-text-secondary hover:text-error transition-colors px-2 py-1 cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-overlay-dark hover:bg-black text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors inline-block"
            >
              Start for free
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

