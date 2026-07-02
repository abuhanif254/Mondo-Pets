import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getBrandProfile } from '@/app/actions';
import { ShieldAlert, Star, Calendar, MapPin } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

export async function generateMetadata({ params: { locale, slug } }: { params: { locale: string, slug: string } }): Promise<Metadata> {
  const profile = await getBrandProfile(slug);
  
  // If no profile, try to infer brand name from slug
  const title = profile ? profile.name : slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `${title} Pet Products - Reviews & Recall History`,
    description: `Independent reviews of ${title} products, average editor ratings, and comprehensive brand recall history.`,
  };
}

export default async function BrandHubPage({ params: { locale, slug } }: { params: { locale: string, slug: string } }) {
  const t = await getTranslations({ locale, namespace: 'common' });
  
  const profile = await getBrandProfile(slug);
  const brandName = profile?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Fetch all products for this brand (case insensitive)
  const products = await prisma.product.findMany({
    where: { 
      brand: {
        equals: brandName,
        mode: 'insensitive'
      }
    },
    include: {
      category: true,
      reviews: true
    },
    orderBy: { editorRating: 'desc' }
  });

  if (products.length === 0 && !profile) {
    notFound();
  }

  const validRatings = products.map(p => Number(p.editorRating)).filter(r => !isNaN(r));
  const avgRating = validRatings.length > 0 
    ? (validRatings.reduce((a, b) => a + b, 0) / validRatings.length).toFixed(1) 
    : null;

  return (
    <div className="bg-muted/30 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Header */}
        <div className="bg-card rounded-3xl border border-border overflow-hidden mb-12 shadow-sm">
          <div className="p-8 md:p-12 lg:flex lg:gap-12">
            
            <div className="lg:w-2/3">
              <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
                {brandName}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                {avgRating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-xl">{avgRating} Average</span>
                  </div>
                )}
                {profile?.foundedYear && (
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Calendar className="w-5 h-5" /> Founded {profile.foundedYear}
                  </div>
                )}
                {profile?.headquarters && (
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <MapPin className="w-5 h-5" /> {profile.headquarters}
                  </div>
                )}
              </div>

              <div className="prose dark:prose-invert text-muted-foreground max-w-none">
                <p>{profile?.description || `Explore our comprehensive, independent analysis of ${brandName} pet products. Below you will find our editor ratings, product details, and any historical recall information associated with this brand.`}</p>
              </div>
            </div>

            {/* Recall History Alert Box */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <div className={`p-6 rounded-2xl border ${profile?.recallHistory ? 'bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900' : 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900'} h-full flex flex-col`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-full ${profile?.recallHistory ? 'bg-red-100 text-red-600 dark:bg-red-900/50' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50'}`}>
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h3 className={`font-bold text-lg ${profile?.recallHistory ? 'text-red-900 dark:text-red-400' : 'text-emerald-900 dark:text-emerald-400'}`}>
                    Recall History
                  </h3>
                </div>
                
                {profile?.recallHistory ? (
                  <div className="text-sm text-red-800 dark:text-red-300 whitespace-pre-wrap flex-grow">
                    {profile.recallHistory}
                  </div>
                ) : (
                  <div className="text-sm text-emerald-800 dark:text-emerald-300 flex-grow">
                    <p className="font-bold mb-1">Clean Record</p>
                    We currently have no recorded recalls for {brandName} products in our database. Always check the official FDA website for real-time updates.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Product Grid */}
        <div>
          <h2 className="text-2xl font-black text-foreground mb-8 border-b border-border pb-4">
            Top Rated {brandName} Products
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                title={product.title}
                price={Number(product.price)}
                imageUrl={product.imageUrl || ''}
                brand={product.brand}
              />
            ))}
          </div>
          
          {products.length === 0 && (
            <p className="text-muted-foreground text-center py-12">No products found for this brand.</p>
          )}
        </div>

      </div>
    </div>
  );
}
