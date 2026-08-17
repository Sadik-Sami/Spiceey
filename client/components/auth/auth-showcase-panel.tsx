import Image from "next/image";
import { Sparkles, ShieldCheck, Truck, Award } from "lucide-react";

interface AuthShowcasePanelProps {
  heading?: string;
  subheading?: string;
  tagline?: string;
}

export function AuthShowcasePanel({
  heading = "Taste the heritage of authentic homemade spices.",
  subheading = "Small-batch, hand-ground spices and traditional pickles crafted with zero artificial preservatives.",
  tagline = "Single-Brand Artisan Quality",
}: AuthShowcasePanelProps) {
  return (
    <div className="relative hidden lg:flex flex-col justify-between h-full bg-primary p-10 xl:p-14 text-white">
      {/* Background texture with subtle warm glow */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/auth-bg.png"
          alt="Artisan Bengali Spices"
          fill
          priority
          className="object-cover object-center mix-blend-multiply opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/70 to-primary/40" />
      </div>

      {/* Top Header & Tagline */}
      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold tracking-wider text-white/95 uppercase backdrop-blur-md border border-white/20">
          <Sparkles className="size-3.5" />
          <span>{tagline}</span>
        </div>

        <h2 className="font-display text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight text-white/95 max-w-md">
          {heading}
        </h2>

        <p className="text-sm xl:text-base font-normal text-white/85 leading-relaxed max-w-md">
          {subheading}
        </p>
      </div>

      {/* Middle Value Pillars */}
      <div className="relative z-10 my-8 space-y-4 rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/15">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white/95">
            <Award className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/95">
              100% Hand-Ground in Bangladesh
            </h4>
            <p className="text-xs text-white/80">
              Stone-crushed in small batches for maximum aroma and natural oils.
            </p>
          </div>
        </div>

        <div className="h-px bg-white/15" />

        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white/95">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/95">
              Pure & Preservative Free
            </h4>
            <p className="text-xs text-white/80">
              No artificial coloring, fillers, or chemical enhancers.
            </p>
          </div>
        </div>

        <div className="h-px bg-white/15" />

        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white/95">
            <Truck className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/95">
              Cash on Delivery (COD)
            </h4>
            <p className="text-xs text-white/80">
              Convenient home delivery across all 64 districts in Bangladesh.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Quote / Guarantee Badge */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-6">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold tracking-wide text-white/95 uppercase">
            Spiceey Authenticity Guarantee
          </p>
          <p className="text-xs text-white/80">
            Freshly prepared upon your order confirmation.
          </p>
        </div>
        <div className="flex -space-x-1.5 overflow-hidden">
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-white text-[11px] font-bold text-primary ring-2 ring-primary">
            ৳
          </span>
        </div>
      </div>
    </div>
  );
}
