import Link from "next/link";
import { AuthBackButton } from "@/components/auth/auth-back-button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-text-primary selection:bg-primary-wash selection:text-primary">
      {/* Top minimal header: Back button + Brand logo */}
      <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <AuthBackButton />

          <Link
            href="/"
            className="font-display text-2xl font-extrabold tracking-tight text-primary transition-opacity hover:opacity-90"
            aria-label="Spiceey Home"
          >
            Spiceey
          </Link>

          {/* Spacer to keep logo centered or balanced */}
          <div className="w-30 hidden sm:block" />
        </div>
      </header>

      {/* Main container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl">{children}</div>
      </main>

      {/* Minimal copyright footer */}
      <footer className="py-6 text-center text-xs text-text-muted border-t border-border/40">
        <p>
          © {new Date().getFullYear()} Spiceey Bangladesh. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
