"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SocialAuthButton } from "@/components/auth/social-auth-button";
import { MOTION } from "@/lib/motion";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
          phone: data.phone || undefined,
          callbackURL: "/profile",
        } as Parameters<typeof authClient.signUp.email>[0],
        {
          onError: (ctx) => {
            setAuthError(
              ctx.error.message || "Registration failed. Please try again.",
            );
          },
          onSuccess: () => {
            router.push("/profile");
            router.refresh();
          },
        },
      );

      if (res.error) {
        setAuthError(
          res.error.message || "Registration failed. Please try again.",
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);

    try {
      const callbackURL =
        typeof window !== "undefined"
          ? `${window.location.origin}/profile`
          : "/profile";

      await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to connect to Google. Please try again.";
      setAuthError(message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="space-y-2 text-left">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
          Create your account
        </h1>
        <p className="text-sm text-text-secondary">
          Join Spiceey for authentic homemade spices, pickles, and faster
          checkout.
        </p>
      </div>

      {/* Global Auth Error Alert */}
      <AnimatePresence mode="wait">
        {authError && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2.5 rounded-lg border border-error/30 bg-error-light p-3.5 text-sm font-medium text-error-foreground"
            role="alert"
          >
            <AlertCircle className="size-4 shrink-0 text-error" />
            <span>{authError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Logins */}
      <div className="space-y-3">
        <SocialAuthButton
          provider="google"
          onClick={handleGoogleSignUp}
          isLoading={isGoogleLoading}
          disabled={isLoading || isGoogleLoading}
          text="Sign up with Google"
        />

        <div className="flex items-center gap-3 w-full my-4">
          <div className="h-px flex-1 bg-border" />
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-text-muted whitespace-nowrap">
            or with email
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3.5"
        noValidate
      >
        {/* Full Name */}
        <div className="space-y-1">
          <Label
            htmlFor="name"
            className="text-text-primary font-medium text-sm"
          >
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted pointer-events-none" />
            <Input
              id="name"
              type="text"
              placeholder="e.g. Rahat Chowdhury"
              autoComplete="name"
              className={`pl-9 h-11 bg-surface text-text-primary border-border focus-visible:border-primary focus-visible:ring-primary/20 ${
                errors.name ? "border-error ring-2 ring-error/20" : ""
              }`}
              {...register("name")}
            />
          </div>
          <AnimatePresence mode="wait">
            {errors.name && (
              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="text-xs font-medium text-error"
                role="alert"
              >
                {errors.name.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <Label
            htmlFor="email"
            className="text-text-primary font-medium text-sm"
          >
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={`pl-9 h-11 bg-surface text-text-primary border-border focus-visible:border-primary focus-visible:ring-primary/20 ${
                errors.email ? "border-error ring-2 ring-error/20" : ""
              }`}
              {...register("email")}
            />
          </div>
          <AnimatePresence mode="wait">
            {errors.email && (
              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="text-xs font-medium text-error"
                role="alert"
              >
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Phone Number Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="phone"
              className="text-text-primary font-medium text-sm"
            >
              Phone Number{" "}
              <span className="text-text-muted text-xs font-normal">
                (optional)
              </span>
            </Label>
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted pointer-events-none" />
            <Input
              id="phone"
              type="tel"
              placeholder="017XXXXXXXX"
              autoComplete="tel"
              className={`pl-9 h-11 bg-surface text-text-primary border-border focus-visible:border-primary focus-visible:ring-primary/20 ${
                errors.phone ? "border-error ring-2 ring-error/20" : ""
              }`}
              {...register("phone")}
            />
          </div>
          <AnimatePresence mode="wait">
            {errors.phone && (
              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="text-xs font-medium text-error"
                role="alert"
              >
                {errors.phone.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <Label
            htmlFor="password"
            className="text-text-primary font-medium text-sm"
          >
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters with numbers"
              autoComplete="new-password"
              className={`pl-9 pr-10 h-11 bg-surface text-text-primary border-border focus-visible:border-primary focus-visible:ring-primary/20 ${
                errors.password ? "border-error ring-2 ring-error/20" : ""
              }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          <AnimatePresence mode="wait">
            {errors.password && (
              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="text-xs font-medium text-error"
                role="alert"
              >
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <Label
            htmlFor="confirmPassword"
            className="text-text-primary font-medium text-sm"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted pointer-events-none" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              className={`pl-9 pr-10 h-11 bg-surface text-text-primary border-border focus-visible:border-primary focus-visible:ring-primary/20 ${
                errors.confirmPassword
                  ? "border-error ring-2 ring-error/20"
                  : ""
              }`}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          <AnimatePresence mode="wait">
            {errors.confirmPassword && (
              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="text-xs font-medium text-error"
                role="alert"
              >
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          whileHover={
            shouldReduceMotion || isLoading || isGoogleLoading
              ? undefined
              : { y: -1 }
          }
          whileTap={
            shouldReduceMotion || isLoading || isGoogleLoading
              ? undefined
              : { scale: 0.98 }
          }
          transition={MOTION.ease.spring}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </motion.button>
      </form>

      {/* Footer link to Login */}
      <div className="text-center pt-1">
        <p className="text-sm text-text-secondary">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
