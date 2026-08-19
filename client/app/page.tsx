import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Home() {
	return (
		<div className='min-h-full flex flex-col bg-background text-text-primary'>
			{/* Announcement Banner */}
			<div className='bg-primary px-4 py-2 text-center text-xs font-semibold text-primary-foreground'>
				<span>
					Fresh Winter Mustard Pickle & Whole Spices &mdash; Cash on Delivery across 64 Districts in Bangladesh
				</span>
			</div>

			{/* Main Storefront Hero Preview */}
			<main className='flex-1'>
				{/* Hero Section */}
				<section className='relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-350 mx-auto'>
					<div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>
						{/* Left Narrative */}
						<div className='lg:col-span-7 space-y-6'>
							<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-wash border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider'>
								<Sparkles className='size-3.5' />
								<span>Stone-Ground &bull; 100% Pure Homemade</span>
							</div>

							<h1 className='font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-text-primary leading-[1.1]'>
								Pure, authentic homemade spices & pickles for every{' '}
								<span className='text-primary underline decoration-primary/40 decoration-wavy underline-offset-8'>
									Bangladeshi kitchen.
								</span>
							</h1>

							<p className='text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed'>
								Hand-ground in weekly small batches in Dhaka. No artificial preservatives, no synthetic color powders
								&mdash; just raw, unadulterated flavor delivered to your doorstep.
							</p>

							<div className='flex flex-wrap items-center gap-4 pt-2'>
								<Link
									href='/shop'
									className='inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-6 py-3 rounded-full shadow-md transition-all hover:scale-102 text-sm'>
									<span>Explore Products</span>
									<ArrowRight className='size-4' />
								</Link>
								<Link
									href='/stories'
									className='inline-flex items-center rounded-full px-6 py-3 border border-border hover:bg-surface-secondary text-text-primary font-semibold text-sm transition-colors'>
									Our Stories
								</Link>
							</div>

							{/* Value Props Bar */}
							<div className='grid grid-cols-3 gap-4 pt-8 border-t border-border/80 text-text-secondary'>
								<div className='flex items-center gap-2'>
									<ShieldCheck className='size-5 text-primary shrink-0' />
									<span className='text-xs font-medium'>100% Chemical Free</span>
								</div>
								<div className='flex items-center gap-2'>
									<Truck className='size-5 text-primary shrink-0' />
									<span className='text-xs font-medium'>Nationwide COD</span>
								</div>
								<div className='flex items-center gap-2'>
									<RefreshCw className='size-5 text-primary shrink-0' />
									<span className='text-xs font-medium'>Fresh Weekly Grind</span>
								</div>
							</div>
						</div>

						{/* Right Card Showcase */}
						<div className='lg:col-span-5 relative'>
							<div className='relative rounded-3xl border border-border bg-surface p-6 shadow-xl space-y-6 overflow-hidden'>
								<div className='absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl z-0' />
								<div className='relative z-10 space-y-4'>
									<div className='flex items-center justify-between'>
										<span className='text-xs font-bold uppercase tracking-wider text-primary'>Featured Blend</span>
										<span className='text-xs font-semibold px-2.5 py-0.5 rounded-full bg-success-light text-success-foreground'>
											In Stock
										</span>
									</div>

									<h3 className='font-display font-bold text-2xl text-text-primary'>
										Shahi Garam Masala (Special Reserve)
									</h3>

									<p className='text-xs text-text-secondary leading-relaxed'>
										12 aromatic whole spices gently roasted and stone-ground to perfection. Elevates biryanis, curries,
										and meat roasts.
									</p>

									<div className='flex items-center justify-between pt-4 border-t border-border'>
										<div>
											<p className='text-[11px] text-text-muted'>Pack Size: 100g / 250g</p>
											<p className='text-xl font-extrabold text-primary'>৳240 BDT</p>
										</div>
										<Link
											href='/shop'
											className='inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary-hover rounded-full px-4 py-2 text-xs font-bold transition-colors'>
											View Details
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className='border-t border-border bg-surface-secondary/40 py-8 px-4 text-center text-xs text-text-muted'>
				<p>&copy; {new Date().getFullYear()} Spiceey Bangladesh. Handcrafted with care.</p>
			</footer>
		</div>
	);
}
