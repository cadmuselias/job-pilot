import Link from "next/link";
import Image from "next/image";

type FooterProps = Record<string, never>;

export function Footer({}: FooterProps) {
  return (
    <footer className="w-full bg-surface border-t border-border mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="JobPilot"
            width={112}
            height={32}
            className="h-7 w-auto object-contain"
          />
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/dashboard"
            className="text-xs sm:text-sm text-text-dark hover:text-accent transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-xs sm:text-sm text-text-dark hover:text-accent transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-xs sm:text-sm text-text-dark hover:text-accent transition-colors"
          >
            Terms & Condition
          </Link>
        </div>
      </div>
    </footer>
  );
}
