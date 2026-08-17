# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

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
- **Pattern:** Base UI Button primitive with `class-variance-authority` (cva) variants (`default`, `outline`, `secondary`, `ghost`, `destructive`, `link`) and sizes (`default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`)
- **Classes (default):** `group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 bg-primary text-primary-foreground hover:bg-primary/80`

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
- **Pattern:** Accessible theme mode switcher dropdown with animated rotate/scale Sun and Moon icons
- **Classes:** Trigger button `variant="outline" size="icon"`, Sun icon `h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`, Moon icon `absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`

### DropdownMenu (UI Primitive)
- **Path:** `client/components/ui/dropdown-menu.tsx`
- **Pattern:** Base UI Menu primitive wrapper with positioner, content, items, submenus, radio/checkbox items, and shortcuts
- **Classes:** Popup content `z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none`, Item `group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground`
