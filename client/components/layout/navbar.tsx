"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  ShoppingBag,
  Search,
  User,
  ShieldCheck,
  Package,
  Star,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOTION } from "@/lib/motion";
import { useSession, signOut } from "@/lib/auth-client";
import { useCartStore } from "@/stores/cart-store";
import { ModeToggle } from "@/components/mode-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/stories", label: "Stories" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  // Cart store hydration-safe counter
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const totalItems = useCartStore((state) => state.totalItems());

  // Auth session
  const { data: session, isPending } = useSession();
  const user = session?.user as
    | { name?: string; email?: string; role?: string }
    | undefined;
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  // Avoid showing public navbar on auth pages or admin dashboard
  if (
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/admin")
  ) {
    return null;
  }

  const cartCount = isMounted ? totalItems : 0;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur-xl transition-colors duration-200",
        )}
      >
        <div className="mx-auto flex h-14 md:h-16 max-w-350 items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-display text-xl md:text-2xl font-extrabold tracking-tight text-primary transition-opacity hover:opacity-90"
              aria-label="Spiceey Home"
            >
              Spiceey
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden md:flex items-center gap-7"
              aria-label="Main Navigation"
            >
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/shop"
                    ? pathname === "/shop" || pathname?.startsWith("/shop/")
                    : pathname === item.href ||
                      pathname?.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative py-1 text-sm font-medium transition-colors hover:text-primary",
                      isActive
                        ? "text-primary font-semibold"
                        : "text-text-secondary",
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
                        transition={MOTION.ease.spring}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Trigger */}
            <Link
              href="/shop"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              aria-label="Search products"
            >
              <Search className="h-4 w-4 md:h-4.5 md:w-4.5" />
            </Link>

            {/* Cart Icon with Count Badge */}
            <Link
              href="/cart"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="h-4 w-4 md:h-4.5 md:w-4.5" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={MOTION.ease.bounce}
                  className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground shadow-xs tabular-nums"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              )}
            </Link>

            {/* Theme Toggle (Desktop & Tablet) */}
            <div className="hidden sm:block">
              <ModeToggle />
            </div>

            {/* User Account / Auth CTA */}
            <div className="hidden sm:block">
              {isPending ? (
                <div className="h-9 w-9 rounded-full bg-surface-muted animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="flex h-9 items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-text-primary shadow-2xs hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                    aria-label="User menu"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-display font-bold text-white text-[11px]">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </span>
                    <span className="max-w-25 truncate text-text-primary hidden lg:inline">
                      {user.name?.split(" ")[0] || "Account"}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-surface border-border"
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-text-primary">
                          {user.name || "Customer"}
                        </p>
                        <p className="text-xs leading-none text-text-muted truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuGroup>
                      {isAdmin && (
                        <DropdownMenuItem
                          render={<Link href="/admin" />}
                          className="text-primary font-medium focus:bg-primary-wash focus:text-primary cursor-pointer"
                        >
                          <ShieldCheck className="h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        render={<Link href="/profile" />}
                        className="focus:bg-surface-secondary text-text-primary cursor-pointer"
                      >
                        <User className="h-4 w-4 text-text-muted" />
                        <span>My Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        render={<Link href="/profile/orders" />}
                        className="focus:bg-surface-secondary text-text-primary cursor-pointer"
                      >
                        <Package className="h-4 w-4 text-text-muted" />
                        <span>My Orders</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        render={<Link href="/profile/reviews" />}
                        className="focus:bg-surface-secondary text-text-primary cursor-pointer"
                      >
                        <Star className="h-4 w-4 text-text-muted" />
                        <span>My Reviews</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      variant="destructive"
                      className="text-error focus:bg-error-light focus:text-error cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-text-primary transition-colors hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              aria-label={
                mobileNavOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Sheet */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
}
