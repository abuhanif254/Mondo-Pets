import { getTranslations } from 'next-intl/server';
import { ProductCard } from '@/components/ProductCard';
import { SidebarFilters } from '@/components/SidebarFilters';
import { getProducts, getCategories } from '@/app/actions';
import { Link } from '@/i18n/routing';

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; animal: string }> }): Promise<Metadata> {
  const { locale, animal } = await params;
  const t = await getTranslations({ locale, namespace: 'ToysPage' });
  const categories = await getCategories();
  const activeCategory = categories.find(c => c.slug === animal);
  const animalName = activeCategory ? activeCategory.name : animal.charAt(0).toUpperCase() + animal.slice(1);
  const title = `${animalName} Toys`;

  return {
    title,
    description: `Premium ${animalName.toLowerCase()} toys and accessories. ${t('subtitle')}`,
    openGraph: {
      title: `${title} | Mondo Pets`,
      description: `Premium ${animalName.toLowerCase()} toys and accessories.`,
      url: `https://mondopets.com/${locale}/toys/${animal}`,
      siteName: 'Mondo Pets',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&h=630&q=80',
          width: 1200,
          height: 630,
          alt: `Mondo Pets Premium ${animalName} Toys`,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Mondo Pets`,
      description: `Premium ${animalName.toLowerCase()} toys and accessories.`,
      images: ['https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&h=630&q=80'],
    }
  };
}

export default async function AnimalToysPage({ params, searchParams }: { params: Promise<{ locale: string; animal: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await params;
  const { locale, animal } = resolvedParams;
  const resolvedSearchParams = await searchParams;
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : undefined;
  
  const minPrice = typeof resolvedSearchParams.minPrice === 'string' ? Number(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? Number(resolvedSearchParams.maxPrice) : undefined;
  const lifeStage = typeof resolvedSearchParams.lifeStage === 'string' ? resolvedSearchParams.lifeStage : undefined;
  const brand = typeof resolvedSearchParams.brand === 'string' ? resolvedSearchParams.brand : undefined;
  const petType = typeof resolvedSearchParams.petType === 'string' ? resolvedSearchParams.petType : undefined;
  const minRating = typeof resolvedSearchParams.minRating === 'string' ? Number(resolvedSearchParams.minRating) : undefined;
  
  const t = await getTranslations({ locale, namespace: 'ToysPage' });
  const products = await getProducts('toy', animal, sort, { minPrice, maxPrice, lifeStage, brand, petType, minRating });
  const categories = await getCategories();

  // Find the active category name for display
  const activeCategory = categories.find(c => c.slug === animal);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-muted/50 py-12 px-6 border-b border-border">
        <div className="container mx-auto max-w-4xl space-y-4 flex flex-col md:flex-row md:justify-between md:items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
              {activeCategory ? `${activeCategory.name} Toys` : t('title')}
            </h1>
            <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Link href="/toys" className="rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
              All
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/toys/${cat.slug}`} 
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${cat.slug === animal ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="container mx-auto flex flex-col md:flex-row gap-8">
          {/* Faceted Filtering Sidebar */}
          <SidebarFilters categories={categories} currentCategorySlug={animal} basePath="/toys" />

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
                No toys found for this animal.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
