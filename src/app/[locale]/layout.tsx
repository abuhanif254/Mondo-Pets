import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AIAssistant } from '@/components/AIAssistant';
import { AuthProvider } from '@/context/AuthContext';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/components/ThemeProvider";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import { CompareBar } from "@/components/CompareBar";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: {
      template: '%s | Mondo Pets',
      default: 'Mondo Pets',
    },
    description: "Premium pet care, toys, and food.",
    openGraph: {
      title: 'Mondo Pets',
      description: 'Premium pet care, toys, and food for your beloved companions.',
      url: `https://mondopets.com/${locale}`,
      siteName: 'Mondo Pets',
      images: [
        {
          url: 'https://mondopets.com/og-image.jpg', // Placeholder for actual OG image
          width: 1200,
          height: 630,
          alt: 'Mondo Pets - Premium Pet Care',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Mondo Pets',
      description: 'Premium pet care, toys, and food for your beloved companions.',
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
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased`}
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
                </NextIntlClientProvider>
              </AuthProvider>
            </CompareProvider>
          </WishlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
