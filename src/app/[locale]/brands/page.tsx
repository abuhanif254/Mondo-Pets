import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { getBrandProfiles } from '@/app/actions';
import { Star, ShieldAlert } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: `Top Pet Brands - Mondo Pets`,
    description: `Browse all top-rated pet brands. Read independent reviews, compare product ratings, and track brand recall histories.`,
  };
}

// Function to convert brand name to a URL-friendly slug
const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export default async function BrandsDirectoryPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'common' });

  // 1. Get all distinct brands from products with their average rating and count
  const products = await prisma.product.findMany({
    where: { brand: { not: null } },
    select: { brand: true, editorRating: true }
  });

  const brandStats = new Map<string, { count: number, totalRating: number }>();
  
  products.forEach(p => {
    if (p.brand) {
      const stats = brandStats.get(p.brand) || { count: 0, totalRating: 0 };
      stats.count += 1;
      if (p.editorRating) {
        stats.totalRating += Number(p.editorRating);
      }
      brandStats.set(p.brand, stats);
    }
  });

  // 2. Get Brand Profiles
  const profiles = await getBrandProfiles();
  const profileMap = new Map(profiles.map(p => [p.name, p]));

  // 3. Combine data
  const brandsList = Array.from(brandStats.entries()).map(([name, stats]) => {
    const profile = profileMap.get(name);
    const avgRating = stats.totalRating > 0 ? (stats.totalRating / stats.count).toFixed(1) : null;
    return {
      name,
      slug: profile?.slug || slugify(name),
      count: stats.count,
      avgRating,
      description: profile?.description,
      logoUrl: profile?.logoUrl,
      hasRecalls: !!profile?.recallHistory
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-muted/30 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Top Pet Brands
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore independent reviews and historical data for the biggest brands in the pet industry.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandsList.map(brand => (
            <Link 
              key={brand.name} 
              href={`/${locale}/brands/${brand.slug}`}
              className="bg-card rounded-2xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                {brand.logoUrl ? (
                  <div className="relative w-16 h-16 bg-white rounded-lg border border-border overflow-hidden">
                    <Image src={brand.logoUrl} alt={brand.name} fill className="object-contain p-2" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-black text-2xl">
                    {brand.name.charAt(0)}
                  </div>
                )}
                
                {brand.hasRecalls && (
                  <div className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                    <ShieldAlert className="w-3 h-3" /> Past Recalls
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-foreground mb-1">{brand.name}</h2>
              <div className="text-sm text-muted-foreground mb-4">
                {brand.count} Products Reviewed
              </div>

              {brand.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                  {brand.description}
                </p>
              )}

              {brand.avgRating && (
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border">
                  <div className="flex text-amber-400">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <span className="font-bold text-foreground">{brand.avgRating} Average Rating</span>
                </div>
              )}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
