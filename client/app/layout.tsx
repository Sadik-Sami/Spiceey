import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Schibsted_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/providers/theme-provider';

const bricolage = Bricolage_Grotesque({
	subsets: ['latin'],
	variable: '--font-bricolage',
	display: 'swap',
});

const schibsted = Schibsted_Grotesk({
	subsets: ['latin'],
	variable: '--font-schibsted',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'Spiceey | Authentic Homemade Spices & Pickles | Bangladesh',
	description:
		'Spiceey is a single-brand DTC ecommerce platform for homemade spices and pickles in Bangladesh. Shop fresh, organic, hand-ground spices delivered to your door.',
};

export const viewport: Viewport = {
	themeColor: '#FEFDFB',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
			className={cn('h-full antialiased', bricolage.variable, schibsted.variable, 'font-sans')}>
			<body className='min-h-full flex flex-col'>
				<ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
