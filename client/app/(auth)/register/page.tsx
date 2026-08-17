import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthShowcasePanel } from "@/components/auth/auth-showcase-panel";

export const metadata: Metadata = {
  title: "Create an Account | Spiceey — Authentic Homemade Spices & Pickles",
  description:
    "Join Spiceey to order freshly ground homemade spices, blends, and pickles with cash on delivery across Bangladesh.",
};

export default function RegisterPage() {
  return (
    <div className="grid w-full grid-cols-1 overflow-hidden rounded-3xl border border-border bg-surface shadow-lg lg:grid-cols-12">
      {/* Brand Showcase Panel (Desktop 5 cols, ~42% width) */}
      <div className="hidden lg:block lg:col-span-5">
        <AuthShowcasePanel
          heading="Join the authentic Bengali spice journey."
          subheading="Create your account to unlock quick checkout, cash on delivery, and artisanal pickles prepared fresh to order."
          tagline="Fresh Batch Guarantee"
        />
      </div>

      {/* Register Form Container (Mobile 12 cols, Desktop 7 cols) */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:col-span-7 xl:p-16">
        <RegisterForm />
      </div>
    </div>
  );
}
