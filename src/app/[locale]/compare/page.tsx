import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import CompareClient from './CompareClient';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: `Compare Products - Mondo Pets`,
    description: `Compare pet products side-by-side to find the best ingredients and prices for your furry friend.`,
  };
}

export default async function ComparePage() {
  return (
    <div className="bg-muted/30 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Compare Products Side-by-Side
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select two products below to compare their ingredients, nutritional values, and prices.
          </p>
        </header>

        <CompareClient />
      </div>
    </div>
  );
}
