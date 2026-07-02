import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ExternalLink, ShieldCheck, Truck, RotateCcw, ArrowLeft, Star, Info } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { getReviews, getQuestions, getCoupons, getSimilarProducts } from '@/app/actions';
import { PriceAlertButton } from '@/components/PriceAlertButton';
import { RecallAlertForm } from '@/components/RecallAlertForm';
import { ProductUGC } from '@/components/ProductUGC';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} | Mondo Pets`,
    description: product.description || `Buy ${product.title} at the best price.`,
    openGraph: {
      title: product.title,
      description: product.description || `Buy ${product.title} at the best price.`,
      url: `https://mondopets.com/${locale}/products/${id}`,
      images: [
        {
          url: product.imageUrl || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
          width: 800,
          height: 800,
          alt: product.title,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description || `Buy ${product.title} at the best price.`,
      images: [product.imageUrl || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee'],
    }
  };
}

export const revalidate = 3600; // Revalidate every hour for max performance

export default async function ProductDetailPage({ params }: Props) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ProductDetail' });

  const product = await prisma.product.findUnique({
    where: { id },
    include: { 
      category: true,
      reviews: { orderBy: { createdAt: 'desc' } },
      questions: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!product) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(product.price));

  const reviews = await getReviews(id);
  const questions = await getQuestions(id);

  // Generate aggregate rating if available
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : product.editorRating ? Number(product.editorRating).toFixed(1) : undefined;
  
  const reviewCount = reviews.length > 0 ? reviews.length : (product.editorRating ? 1 : undefined);

  // Construct JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.imageUrl || 'https://mondopets.com/placeholder.jpg',
    description: product.description || `Premium ${product.type} for your pet.`,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Mondo Pets Partner'
    },
    offers: {
      '@type': 'Offer',
      url: `https://mondopets.com/${locale}/products/${id}`,
      priceCurrency: 'USD',
      price: Number(product.price).toFixed(2),
      availability: 'https://schema.org/InStock',
    },
    ...(avgRating && reviewCount ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        reviewCount: reviewCount,
      }
    } : {})
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-24">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumbs / Back button */}
      <div className="container mx-auto px-6 py-6">
        <Link href={`/${product.type}s`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-emerald-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('backTo')} {product.type === 'toy' ? 'Toys' : 'Food'}
        </Link>
      </div>

      <main className="container mx-auto px-6">
        <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
            
            {/* Image Gallery (Left) */}
            <div className="p-8 md:p-12 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50">
              <div className="relative w-full aspect-square max-w-md rounded-2xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10">
                <Image
                  src={product.imageUrl || '/placeholder.jpg'}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Product Info (Right) */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              
              <div className="mb-2">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  {product.category.name}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black mb-4 text-foreground leading-tight tracking-tight">
                {product.title}
              </h1>
              
              {product.editorRating && (
                <div className="flex items-center gap-1 mb-4">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-6 h-6 fill-current" />
                    <span className="ml-2 text-2xl font-bold">{product.editorRating.toString()}</span>
                    <span className="text-muted-foreground text-lg ml-1">/ 5</span>
                  </div>
                  <span className="text-sm text-muted-foreground ml-3 uppercase tracking-wider font-semibold">Editor Rating</span>
                </div>
              )}

              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-6">
                {formattedPrice}
              </div>

              {/* Editor Byline */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-muted/40 rounded-xl border border-border">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold">
                  MP
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Reviewed by The Mondo Pets Editorial Team</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Independent & Unbiased Analysis
                  </p>
                </div>
              </div>
              
              <div className="prose dark:prose-invert text-muted-foreground mb-8">
                <p>
                  {product.description || `This premium ${product.type} is highly rated and recommended by pet experts. Enhance your pet's life with top-quality materials and ingredients. Check the merchant page for full specifications and customer reviews.`}
                </p>
              </div>

              {/* Action Buttons & Price Comparison */}
              <div className="flex flex-col gap-3 mb-8 bg-muted/30 p-5 sm:p-6 rounded-2xl border border-border">
                <h3 className="font-bold text-lg mb-2 text-foreground">Compare Prices & Buy</h3>
                
                {product.amazonUrl && (
                  <a 
                    href={`/api/go/${product.id}?vendor=amazon`} 
                    className="flex items-center justify-between w-full bg-[#FF9900] hover:bg-[#E68A00] text-black font-bold text-lg py-3 px-6 rounded-xl shadow-md transition-transform active:scale-95"
                  >
                    <span className="flex items-center gap-2">
                      Check price on <span className="font-extrabold">Amazon</span>
                    </span>
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
                
                {product.chewyUrl && (
                  <a 
                    href={`/api/go/${product.id}?vendor=chewy`} 
                    className="flex items-center justify-between w-full bg-[#1C4ED8] hover:bg-[#1E40AF] text-white font-bold text-lg py-3 px-6 rounded-xl shadow-md transition-transform active:scale-95"
                  >
                    <span className="flex items-center gap-2">
                      Check price on <span className="font-extrabold">Chewy</span>
                    </span>
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
                
                {product.affiliateUrl && !product.amazonUrl && !product.chewyUrl && (
                  <a 
                    href={`/api/go/${product.id}`} 
                    className="flex items-center justify-between w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-3 px-6 rounded-xl shadow-md transition-transform active:scale-95"
                  >
                    <span className="flex items-center gap-2">
                      {t('buyNow')}
                    </span>
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
                
                {product.affiliateUrl && (product.amazonUrl || product.chewyUrl) && (
                  <a 
                    href={`/api/go/${product.id}`} 
                    className="flex items-center justify-center w-full bg-transparent hover:bg-muted text-foreground border border-border font-bold text-sm py-3 px-6 rounded-xl transition-colors mt-2"
                  >
                    Other Retailers <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
                  </a>
                )}

                <div className="mt-4">
                  <PriceAlertButton productId={product.id} productName={product.title} />
                </div>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  {t('affiliateDisclaimer')} We may earn a commission if you make a purchase.
                </p>
              </div>

              {/* Value Props */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-8">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">{t('secureCheckout')}</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">{t('fastShipping')}</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">{t('easyReturns')}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Structured Review Data (Advisor Model) */}
        {(product.ingredients || product.proteinPercent || product.fatPercent) && (
          <div className="mt-8 bg-card rounded-2xl border border-border shadow-sm overflow-hidden p-6 md:p-12">
            <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-emerald-600" />
              Nutritional Analysis & Ingredients
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Nutritional Chart / Bars */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Guaranteed Analysis</h3>
                <div className="space-y-4">
                  {product.proteinPercent && (
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span>Protein</span>
                        <span>{product.proteinPercent.toString()}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${product.proteinPercent}%` }}></div>
                      </div>
                    </div>
                  )}
                  {product.fatPercent && (
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span>Fat</span>
                        <span>{product.fatPercent.toString()}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${product.fatPercent}%` }}></div>
                      </div>
                    </div>
                  )}
                  {product.fiberPercent && (
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span>Fiber</span>
                        <span>{product.fiberPercent.toString()}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${Math.min(Number(product.fiberPercent) * 5, 100)}%` }}></div>
                      </div>
                    </div>
                  )}
                  {product.moisturePercent && (
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span>Moisture</span>
                        <span>{product.moisturePercent.toString()}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${product.moisturePercent}%` }}></div>
                      </div>
                    </div>
                  )}
                  {product.caloricContent && (
                    <div className="pt-4 border-t border-border mt-4">
                      <span className="font-semibold">Caloric Content:</span> {product.caloricContent}
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredients List */}
              {product.ingredients && (
                <section aria-labelledby="ingredients-heading">
                  <h3 id="ingredients-heading" className="text-lg font-semibold mb-4 border-b border-border pb-2">Ingredients List</h3>
                  <div className="prose dark:prose-invert text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/50">
                    <p>{product.ingredients}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 italic">
                    Ingredients are listed in descending order by weight before processing.
                  </p>
                </section>
              )}
            </div>
          </div>
        )}

        {/* Recall Alerts Signup Widget */}
        {product.type === 'food' && (
          <RecallAlertForm />
        )}

        {/* User Generated Content */}
        <ProductUGC 
          productId={product.id} 
          initialReviews={reviews} 
          initialQuestions={questions} 
        />
      </main>
    </div>
  );
}
