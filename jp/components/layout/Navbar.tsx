"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutGrid, Search, User } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

type NavbarProps = Record<string, never>;

export function Navbar({}: NavbarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/find-jobs") ||
    pathname.startsWith("/profile");

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { label: "Find Jobs", href: "/find-jobs", icon: Search },
    { label: "Profile", href: "/profile", icon: User },
  ];

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

        {/* Navigation Items */}
        <div className="flex items-center gap-6 sm:gap-8 h-16">
          <nav className="flex items-center gap-6 sm:gap-8 h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href + "/"));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors h-16 border-b-2 ${
                    isActive
                      ? "text-accent border-accent"
                      : "text-text-secondary hover:text-accent border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Authentication actions for homepage / logout */}
          {!isAppRoute && !user && (
            <Link
              href="/login"
              className="bg-overlay-dark hover:bg-black text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors inline-block"
            >
              Start for free
            </Link>
          )}

          {user && (
            <button
              type="button"
              onClick={() => signOut()}
              className="text-xs text-text-secondary hover:text-error transition-colors px-2 py-1 cursor-pointer hidden lg:inline-block"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
