"use client";

import { motion, useReducedMotion } from "motion/react";
import { MOTION } from "@/lib/motion";

interface SocialAuthButtonProps {
  provider: "google";
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  text?: string;
}

export function SocialAuthButton({
  provider = "google",
  onClick,
  isLoading = false,
  disabled = false,
  text = "Continue with Google",
}: SocialAuthButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={shouldReduceMotion || disabled || isLoading ? undefined : { y: -1 }}
      whileTap={shouldReduceMotion || disabled || isLoading ? undefined : { scale: 0.98 }}
      transition={MOTION.ease.spring}
      className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-text-primary shadow-xs transition-colors hover:bg-surface-secondary hover:border-border/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {provider === "google" && (
        <svg className="size-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#EA4335"
            d="M12 5c1.56 0 2.96.54 4.07 1.43l3.05-3.05C17.27 1.6 14.82 0.8 12 0.8 7.37 0.8 3.4 3.44 1.48 7.28l3.66 2.84C6.01 7.28 8.76 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.28 1.47-1.12 2.72-2.38 3.56l3.68 2.86c2.15-1.99 3.72-4.92 3.72-8.66z"
          />
          <path
            fill="#FBBC05"
            d="M5.14 14.88c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.48 7.48C.54 9.36 0 11.47 0 13.7s.54 4.34 1.48 6.22l3.66-3.04z"
          />
          <path
            fill="#34A853"
            d="M12 23.2c3.24 0 5.95-1.08 7.93-2.92l-3.68-2.86c-1.07.72-2.45 1.15-4.25 1.15-3.24 0-5.99-2.28-6.86-5.32L1.48 16.09C3.4 19.93 7.37 23.2 12 23.2z"
          />
        </svg>
      )}
      <span>{isLoading ? "Connecting..." : text}</span>
    </motion.button>
  );
}
