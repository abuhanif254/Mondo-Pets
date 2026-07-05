import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/components/Navbar';
import { AIAssistant } from '@/components/AIAssistant';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));
const CookieBanner = dynamic(() => import('@/components/CookieBanner').then(mod => mod.CookieBanner));
import { AuthProvider } from '@/context/AuthContext';
import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "../globals.css";

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

import { ThemeProvider } from "@/components/ThemeProvider";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import { CompareBar } from "@/components/CompareBar";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  const siteName = 'Mondo Pets';
  const defaultTitle = 'Mondo Pets | Expert Pet Advice, Reviews & Care Guides';
  const defaultDescription = 'Discover premium pet care tips, in-depth product reviews, and expert advice for your dogs, cats, and small animals. We help you find the best for your furry friends.';
  
  return {
    title: {
      template: `%s | ${siteName}`,
      default: defaultTitle,
    },
    description: defaultDescription,
    keywords: ['pet care', 'dog food reviews', 'cat toys', 'pet health advice', 'pet product reviews'],
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      url: `https://mondopets.com/${locale}`,
      siteName: siteName,
      images: [
        {
          url: 'https://mondopets.com/og-image.jpg', // Placeholder for actual OG image
          width: 1200,
          height: 630,
          alt: 'Mondo Pets - Premium Pet Care & Reviews',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDescription,
      images: ['https://mondopets.com/og-image.jpg'],
    },
    alternates: {
      canonical: `https://mondopets.com/${locale}`,
      languages: {
        'en': 'https://mondopets.com/en',
        'bn': 'https://mondopets.com/bn',
        'hi': 'https://mondopets.com/hi',
        'de': 'https://mondopets.com/de',
        'es': 'https://mondopets.com/es',
      },
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: siteName,
    },
    formatDetection: {
      telephone: false,
    },
  };
}

import { PromoBanner } from '@/components/PromoBanner';
import { getFeaturedCoupon } from '@/app/actions';
import { TopAdBanner } from '@/components/TopAdBanner';

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages();
  const featuredCoupon = await getFeaturedCoupon();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${bricolage.variable} min-h-full flex flex-col antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WishlistProvider>
            <CompareProvider>
              <AuthProvider>
                <NextIntlClientProvider messages={messages}>
                  <div className="flex flex-col min-h-screen bg-background relative pb-20 sm:pb-0">
                    <TopAdBanner />
                    <PromoBanner coupon={featuredCoupon} />
                    <Navbar locale={locale as string} />
                    <main className="flex-1 bg-muted/20">
                      {children}
                    </main>
                    <Footer />
                    <CompareBar />
                  </div>
                  <AIAssistant />
                  <CookieBanner />
                </NextIntlClientProvider>
              </AuthProvider>
            </CompareProvider>
          </WishlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
