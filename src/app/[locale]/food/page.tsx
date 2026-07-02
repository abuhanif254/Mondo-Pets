import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ProductCard } from '@/components/ProductCard';
import { SidebarFilters } from '@/components/SidebarFilters';
import { getProducts, getCategories } from '@/app/actions';
import { Link } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'FoodPage' });
  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} | Mondo Pets`,
      description: t('subtitle'),
      url: `https://mondopets.com/${locale}/food`,
      siteName: 'Mondo Pets',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&h=630&q=80',
          width: 1200,
          height: 630,
          alt: 'Mondo Pets Premium Food',
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | Mondo Pets`,
      description: t('subtitle'),
      images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&h=630&q=80'],
    }
  };
}

export default async function FoodPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : undefined;
  
  const minPrice = typeof resolvedSearchParams.minPrice === 'string' ? Number(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? Number(resolvedSearchParams.maxPrice) : undefined;
  const lifeStage = typeof resolvedSearchParams.lifeStage === 'string' ? resolvedSearchParams.lifeStage : undefined;
  const brand = typeof resolvedSearchParams.brand === 'string' ? resolvedSearchParams.brand : undefined;
  const petType = typeof resolvedSearchParams.petType === 'string' ? resolvedSearchParams.petType : undefined;
  const minRating = typeof resolvedSearchParams.minRating === 'string' ? Number(resolvedSearchParams.minRating) : undefined;

  const t = await getTranslations({ locale, namespace: 'FoodPage' });
  const products = await getProducts('food', undefined, sort, { minPrice, maxPrice, lifeStage, brand, petType, minRating });
  const categories = await getCategories();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-muted/30 py-8 px-6 border-b border-border">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{t('title')}</h1>
          <p className="text-lg text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
      </header>

      <main className="flex-1 py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row gap-8">
          
          {/* Faceted Filtering Sidebar */}
          <SidebarFilters categories={categories} basePath="/food" />

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  imageUrl={product.imageUrl || '/placeholder.jpg'}
                  affiliateUrl={product.affiliateUrl}
                />
              ))}
            </div>

            {products.length === 0 && (
              <div className="py-12 text-center text-muted-foreground border border-dashed rounded-lg mt-8">
                No food found.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
