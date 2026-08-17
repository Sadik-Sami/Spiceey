"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SocialAuthButton } from "@/components/auth/social-auth-button";
import { MOTION } from "@/lib/motion";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe ?? true,
          callbackURL: "/profile",
        },
        {
          onError: (ctx) => {
            setAuthError(
              ctx.error.message || "Invalid email or password. Please try again."
            );
          },
          onSuccess: () => {
            router.push("/profile");
            router.refresh();
          },
        }
      );

      if (res.error) {
        setAuthError(
          res.error.message || "Invalid email or password. Please try again."
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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/profile",
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
          Welcome back
        </h1>
        <p className="text-sm text-text-secondary">
          Enter your details to access your orders, wishlist, and profile.
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
          onClick={handleGoogleSignIn}
          isLoading={isGoogleLoading}
          disabled={isLoading || isGoogleLoading}
          text="Continue with Google"
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-text-primary font-medium text-sm">
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

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-text-primary font-medium text-sm">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:text-primary-hover hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
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

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            id="rememberMe"
            type="checkbox"
            className="size-4 rounded border-border text-primary accent-primary focus:ring-primary/20 cursor-pointer"
            {...register("rememberMe")}
          />
          <Label
            htmlFor="rememberMe"
            className="text-xs text-text-secondary font-normal cursor-pointer select-none"
          >
            Keep me signed in on this device
          </Label>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          whileHover={shouldReduceMotion || isLoading || isGoogleLoading ? undefined : { y: -1 }}
          whileTap={shouldReduceMotion || isLoading || isGoogleLoading ? undefined : { scale: 0.98 }}
          transition={MOTION.ease.spring}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </motion.button>
      </form>

      {/* Footer link to Register */}
      <div className="text-center pt-2">
        <p className="text-sm text-text-secondary">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
