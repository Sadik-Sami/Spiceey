# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

### Tailwind Canonical Classes Standard

- Always use standard Tailwind scale classes (e.g., `min-h-11` for 44px, `min-h-10` for 40px, `min-w-4` for 16px, `min-w-24` for 96px, `w-30` for 120px, `max-w-350` for 1400px) instead of arbitrary bracket values (`min-h-[44px]`).
- Arbitrary brackets (`[...]`) are strictly prohibited unless the size cannot be represented on the standard Tailwind scale (e.g., `min-h-[100dvh]`, `aspect-[4/5]`).

---

## State Stores

### useCartStore

- **Path:** `client/stores/cart-store.ts`
- **Pattern:** Zustand persistent store (`spiceey-cart` localStorage key) managing cart line items with schema (`variantId`, `productId?`, `productName`, `productSlug?`, `weight`, `price`, `quantity`, `image`). Hydration-safe reading in UI components (like the Navbar badge) using `useSyncExternalStore`.
- **Actions:** `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `totalItems`, `totalPrice`.

---

## Components

### AuthBackButton

- **Path:** `client/components/auth/auth-back-button.tsx`
- **Pattern:** Smart fallback router back button with spring hover feedback
- **Classes:** `group inline-flex items-center gap-2 rounded-lg border border-border bg-surface/80 px-3.5 py-2 text-sm font-medium text-text-secondary backdrop-blur-md transition-colors hover:border-primary/30 hover:bg-surface hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20`

### SocialAuthButton

- **Path:** `client/components/auth/social-auth-button.tsx`
- **Pattern:** Full-width third-party provider button with brand SVG icon
- **Classes:** `inline-flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-text-primary shadow-xs transition-colors hover:bg-surface-secondary hover:border-border/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60`

### AuthShowcasePanel

- **Path:** `client/components/auth/auth-showcase-panel.tsx`
- **Pattern:** Brand heritage showcase panel with committed Burnt Sienna background (35-40% surface commitment), high-contrast white text, spice texture overlay, and trust pillars. Built flush to top/bottom/left edges for an immersive asymmetric layout.
- **Classes:** `relative hidden lg:flex flex-col justify-between h-full bg-primary p-10 xl:p-14 text-white`

### LoginForm

- **Path:** `client/components/auth/login-form.tsx`
- **Pattern:** Client form with React Hook Form + Zod resolver, password visibility toggle, accessible error states, non-wrapping flex divider, and spring submit button
- **Classes:** Card wrapper `w-full max-w-md space-y-6`, submit button `inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover`

### RegisterForm

- **Path:** `client/components/auth/register-form.tsx`
- **Pattern:** Client form with React Hook Form + Zod resolver, full name, email, optional BD phone, password with confirmation, non-wrapping flex divider, and spring submit button
- **Classes:** Card wrapper `w-full max-w-md space-y-6`, submit button `inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover`

### Button (UI Primitive)

- **Path:** `client/components/ui/button.tsx`
- **Pattern:** Base UI Button primitive with `class-variance-authority` (cva) variants (`default`, `outline`, `secondary`, `ghost`, `destructive`, `link`) and standard scale sizes (`default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`)
- **Classes (base):** `group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/20 active:not-aria-[haspopup]:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer`
- **Variants:** `default` (`bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs`), `outline` (`border border-border bg-surface text-text-primary shadow-2xs hover:bg-surface-secondary hover:text-text-primary aria-expanded:bg-surface-secondary`), `secondary` (`bg-surface-secondary text-text-primary hover:bg-surface-muted aria-expanded:bg-surface-muted`), `ghost` (`hover:bg-surface-secondary hover:text-text-primary text-text-secondary aria-expanded:bg-surface-secondary`), `destructive` (`bg-error-light text-error-foreground hover:bg-error hover:text-white`), `link` (`text-primary underline-offset-4 hover:underline`)

### Input (UI Primitive)

- **Path:** `client/components/ui/input.tsx`
- **Pattern:** Base UI Input primitive with accessible focus rings and error states
- **Classes:** `h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40`

### Label (UI Primitive)

- **Path:** `client/components/ui/label.tsx`
- **Pattern:** Label primitive with disabled peer state support
- **Classes:** `flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50`

### Toast / Toaster (UI Primitive)

- **Path:** `client/components/ui/toast.tsx`
- **Pattern:** Base UI Toast manager with swipe physics, stack expansion, and status icons (success, info, warning, error, loading)
- **Classes:** Viewport `pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full`, Toast root `group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-2xl border bg-popover text-popover-foreground shadow-lg`

### ThemeProvider

- **Path:** `client/components/providers/theme-provider.tsx`
- **Pattern:** Client wrapper component for `next-themes` ThemeProvider
- **Configuration:** `attribute="class"`, `defaultTheme="light"`, `enableSystem`, `disableTransitionOnChange`

### ModeToggle

- **Path:** `client/components/mode-toggle.tsx`
- **Pattern:** Accessible theme mode switcher dropdown with animated rotate/scale Sun and Moon icons using `next-themes`
- **Classes:** Trigger button `variant="outline" size="icon" className="relative cursor-pointer bg-surface text-text-primary border-border hover:bg-surface-secondary"`, Sun icon `h-[1.15rem] w-[1.15rem] rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0 text-text-primary`, Moon icon `absolute h-[1.15rem] w-[1.15rem] rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100 text-text-primary`

### DropdownMenu (UI Primitive)

- **Path:** `client/components/ui/dropdown-menu.tsx`
- **Pattern:** Base UI Menu primitive wrapper with positioner, content, items, submenus, radio/checkbox items, and shortcuts
- **Classes:** Popup content `z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-xl border border-border bg-surface p-1.5 text-text-primary shadow-xl duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95`, Item `group/dropdown-menu-item relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-text-secondary outline-none transition-colors hover:bg-surface-secondary hover:text-text-primary focus:bg-surface-secondary focus:text-text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50`

### Navbar

- **Path:** `client/components/layout/navbar.tsx`
- **Pattern:** Sticky responsive storefront navigation header with backdrop blur, Bricolage Grotesque brand logo, desktop navigation links with Motion active spring indicators, cart item badge counter synced to Zustand store via `useSyncExternalStore`, theme toggle, and authenticated user dropdown menu.
- **Classes:** Header `sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur-xl transition-colors duration-200`, Container `mx-auto flex h-14 md:h-16 max-w-350 items-center justify-between px-4 md:px-6 lg:px-8`, Logo `font-display text-xl md:text-2xl font-extrabold tracking-tight text-primary transition-opacity hover:opacity-90`, Cart badge `absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground shadow-xs tabular-nums`

### MobileNav

- **Path:** `client/components/layout/mobile-nav.tsx`
- **Pattern:** Mobile slide-up drawer navigation sheet using AnimatePresence + Motion with body scroll lock, Escape key dismiss, 44px (min-h-11) min touch targets, category chips with color tokens, and full auth profile controls.
- **Classes:** Backdrop `fixed inset-0 bg-overlay backdrop-blur-xs`, Drawer `relative z-10 w-full max-h-[90dvh] flex flex-col bg-surface border-b border-border shadow-2xl overflow-y-auto`, Link item `flex min-h-11 items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium transition-colors`
