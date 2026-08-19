"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ShoppingBag,
  Sparkles,
  BookOpen,
  History,
  Heart,
  User,
  ShieldCheck,
  Package,
  Star,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOTION } from "@/lib/motion";
import { useSession, signOut } from "@/lib/auth-client";
import { ModeToggle } from "@/components/mode-toggle";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { href: "/shop", label: "Shop All Spices", icon: ShoppingBag },
  { href: "/blog", label: "Spice Knowledge & Blog", icon: BookOpen },
  { href: "/stories", label: "Artisan Stories", icon: History },
  { href: "/wishlist", label: "Saved Wishlist", icon: Heart },
];

const CATEGORIES = [
  {
    href: "/shop?category=ground",
    label: "Ground Spices",
    tag: "Powders",
    badgeClass:
      "bg-category-ground-bg text-category-ground border-category-ground/20",
  },
  {
    href: "/shop?category=whole",
    label: "Whole Spices",
    tag: "Raw Seeds",
    badgeClass:
      "bg-category-whole-bg text-category-whole border-category-whole/20",
  },
  {
    href: "/shop?category=mix",
    label: "Spice Mixes",
    tag: "Special Masala",
    badgeClass: "bg-category-mix-bg text-category-mix border-category-mix/20",
  },
  {
    href: "/shop?category=pickles",
    label: "Homemade Pickles",
    tag: "Traditional",
    badgeClass:
      "bg-category-pickles-bg text-category-pickles border-category-pickles/20",
  },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const { data: session } = useSession();
  const user = session?.user as
    | { name?: string; email?: string; role?: string }
    | undefined;
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  // Close on route change
  React.useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Close on Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when mobile nav is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-start">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION.duration.fast }}
            className="fixed inset-0 bg-overlay backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 0 } : { y: -20, opacity: 0 }
            }
            animate={{ y: 0, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: -20, opacity: 0 }}
            transition={{
              duration: MOTION.duration.normal,
              ease: MOTION.ease.smooth,
            }}
            className="relative z-10 w-full max-h-[90dvh] flex flex-col bg-surface border-b border-border shadow-2xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-surface px-4">
              <Link
                href="/"
                onClick={onClose}
                className="font-display text-xl font-extrabold tracking-tight text-primary"
              >
                Spiceey
              </Link>
              <div className="flex items-center gap-2">
                <ModeToggle />
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-secondary text-text-primary transition-colors hover:bg-surface-muted"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-6 p-4 pb-8">
              {/* Primary Links */}
              <div className="space-y-1">
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Explore
                </p>
                <nav className="space-y-1">
                  {NAV_LINKS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex min-h-11 items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                          isActive
                            ? "bg-primary-wash text-primary font-semibold"
                            : "text-text-primary hover:bg-surface-secondary hover:text-primary",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <Icon
                            className={cn(
                              "h-5 w-5",
                              isActive ? "text-primary" : "text-text-muted",
                            )}
                          />
                          {item.label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-text-muted" />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Category Quick Access */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Categories
                  </p>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={onClose}
                      className="group flex flex-col justify-between rounded-xl border border-border bg-surface-secondary/60 p-3 transition-colors hover:border-primary/40 hover:bg-surface-secondary"
                    >
                      <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                        {cat.label}
                      </span>
                      <span
                        className={cn(
                          "mt-2 inline-flex self-start rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                          cat.badgeClass,
                        )}
                      >
                        {cat.tag}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* User Account / Auth Section */}
              <div className="rounded-xl border border-border bg-surface-secondary/50 p-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-border">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-display font-bold text-white text-sm">
                        {user.name ? user.name[0].toUpperCase() : "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text-primary">
                          {user.name || "Customer"}
                        </p>
                        <p className="truncate text-xs text-text-muted">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={onClose}
                          className="flex min-h-10 items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-semibold text-primary hover:bg-primary-wash"
                        >
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        onClick={onClose}
                        className="flex min-h-10 items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary"
                      >
                        <User className="h-4 w-4 text-text-muted" />
                        My Profile & Addresses
                      </Link>
                      <Link
                        href="/profile/orders"
                        onClick={onClose}
                        className="flex min-h-10 items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary"
                      >
                        <Package className="h-4 w-4 text-text-muted" />
                        Order History
                      </Link>
                      <Link
                        href="/profile/reviews"
                        onClick={onClose}
                        className="flex min-h-10 items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary"
                      >
                        <Star className="h-4 w-4 text-text-muted" />
                        My Reviews
                      </Link>

                      <button
                        type="button"
                        onClick={async () => {
                          await signOut();
                          onClose();
                        }}
                        className="flex w-full min-h-10 items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-error hover:bg-error-light"
                      >
                        <LogOut className="h-4 w-4 text-error" />
                        Log Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Authentic Homemade Spices
                    </div>
                    <p className="text-xs text-text-secondary">
                      Sign in to track orders, manage delivery addresses, and
                      save favorites.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href="/login"
                        onClick={onClose}
                        className="flex min-h-11 items-center justify-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary shadow-xs hover:bg-surface-secondary"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={onClose}
                        className="flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Support / Slogan */}
              <div className="pt-2 text-center text-xs text-text-muted">
                <p>Delivering across Bangladesh via Cash On Delivery</p>
                <p className="mt-1 font-medium text-text-secondary">
                  100% Pure & Homemade Guarantee
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
