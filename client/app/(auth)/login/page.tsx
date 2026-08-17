import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { AuthShowcasePanel } from "@/components/auth/auth-showcase-panel";

export const metadata: Metadata = {
  title: "Sign In | Spiceey — Authentic Homemade Spices & Pickles",
  description:
    "Sign in to your Spiceey account to view your past orders, delivery tracking, and saved artisan spices.",
};

export default function LoginPage() {
  return (
    <div className="grid w-full grid-cols-1 overflow-hidden rounded-3xl border border-border bg-surface shadow-lg lg:grid-cols-12">
      {/* Brand Showcase Panel (Desktop 5 cols, ~42% width) */}
      <div className="hidden lg:block lg:col-span-5">
        <AuthShowcasePanel
          heading="Pure flavours, freshly ground for your home."
          subheading="Log in to manage your orders, check courier tracking status, and save your favourite homemade spices."
          tagline="Handcrafted with Love"
        />
      </div>

      {/* Login Form Container (Mobile 12 cols, Desktop 7 cols) */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:col-span-7 xl:p-16">
        <LoginForm />
      </div>
    </div>
  );
}
