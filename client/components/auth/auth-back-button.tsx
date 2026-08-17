"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { MOTION } from "@/lib/motion";

interface AuthBackButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export function AuthBackButton({
  label = "Back to store",
  href,
  className = "",
}: AuthBackButtonProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={shouldReduceMotion ? undefined : { x: -3 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      transition={MOTION.ease.spring}
      className={`group inline-flex items-center gap-2 rounded-lg border border-border bg-surface/80 px-3.5 py-2 text-sm font-medium text-text-secondary backdrop-blur-md transition-colors hover:border-primary/30 hover:bg-surface hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5 text-primary" />
      <span>{label}</span>
    </motion.button>
  );
}
