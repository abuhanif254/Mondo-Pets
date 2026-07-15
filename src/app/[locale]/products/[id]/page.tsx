import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import {
  ExternalLink, ShieldCheck, Truck, RotateCcw, ArrowLeft,
  Star, Info, CheckCircle, Clock, ChevronRight, Award,
  AlertCircle, TrendingUp, Package,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { getReviews, getQuestions, getCoupons, getSimilarProducts } from '@/app/actions';
import { PriceAlertButton } from '@/components/PriceAlertButton';
import { ProductCard } from '@/components/ProductCard';
import { MobileStickyBar } from '@/components/MobileStickyBar';
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure';
import dynamic from 'next/dynamic';

const ProductUGC = dynamic(() => import('@/components/ProductUGC').then(mod => mod.ProductUGC));
const RecallAlertForm = dynamic(() => import('@/components/RecallAlertForm').then(mod => mod.RecallAlertForm));

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { title: 'Product Not Found' };

  const title = `${product.title} — Review & Best Price | Mondo Pets`;
  const description = product.description
    ? product.description.slice(0, 155)
    : `Expert review of ${product.title}. Find the best price, pros & cons, and where to buy. Updated daily.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://mondopets.com/${locale}/products/${id}`,
      images: [{ url: product.imageUrl || 'https://mondopets.com/og-default.jpg', width: 1200, height: 630, alt: product.title }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [product.imageUrl || ''] },
    alternates: { canonical: `https://mondopets.com/${locale}/products/${id}` },
  };
}



/** Render n filled/half/empty stars */
function StarDisplay({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ProductDetail' });

  const [product, reviews, questions, similarProductsData] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { category: true, reviews: { orderBy: { createdAt: 'desc' } }, questions: { orderBy: { createdAt: 'desc' } } },
    }),
    getReviews(id),
    getQuestions(id),
    getSimilarProducts(id).catch(() => []),
  ]);

  if (!product) notFound();

  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(product.price));
  const originalPrice  = product.originalPrice ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(product.originalPrice)) : null;
  const discount       = product.originalPrice && Number(product.originalPrice) > Number(product.price)
    ? Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)
    : null;

  const avgRating   = reviews.length > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length)
    : (product.editorRating ? Number(product.editorRating) : null);
  const reviewCount = reviews.length > 0 ? reviews.length : (product.editorRating ? 1 : null);

  // JSON-LD — Product + AggregateRating
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.imageUrl || 'https://mondopets.com/placeholder.jpg',
    description: product.description || `Premium ${product.type} for your pet.`,
    sku: product.id,
    brand: { '@type': 'Brand', name: product.brand || 'Mondo Pets Partner' },
    offers: {
      '@type': 'Offer',
      url: `https://mondopets.com/${locale}/products/${id}`,
      priceCurrency: 'USD',
      price: Number(product.price).toFixed(2),
      priceValidUntil: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
    },
    ...(avgRating && reviewCount ? {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: avgRating.toFixed(1), reviewCount },
    } : {}),
  };

  // Breadcrumb JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: `https://mondopets.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `https://mondopets.com/${locale}/products` },
      { '@type': 'ListItem', position: 3, name: product.title },
    ],
  };

  const VENDOR_BUTTONS = [
    product.amazonUrl && { href: `/api/go/${product.id}?vendor=amazon`, label: 'Check Price on Amazon', subLabel: 'Free Prime Shipping', bg: 'bg-[#FF9900] hover:bg-[#e68a00]', text: 'text-black' },
    product.chewyUrl  && { href: `/api/go/${product.id}?vendor=chewy`,  label: 'Check Price on Chewy',  subLabel: 'Auto-ship & save 35%',   bg: 'bg-[#0052cc] hover:bg-[#003d99]', text: 'text-white' },
    (product.affiliateUrl && !product.amazonUrl && !product.chewyUrl) && {
      href: `/api/go/${product.id}`, label: t('buyNow'), subLabel: 'Best available price',
      bg: 'bg-primary hover:bg-primary/90', text: 'text-white',
    },
  ].filter(Boolean) as { href: string; label: string; subLabel: string; bg: string; text: string }[];

  const primaryVendor = VENDOR_BUTTONS[0];

  return (
    <div className="min-h-screen bg-muted/20 pb-24 mobile-page-bottom">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* ── MOBILE STICKY CTA (visible on mobile only, above bottom nav) ── */}
      {primaryVendor && (
        <MobileStickyBar
          title={product.title}
          price={formattedPrice}
          primaryHref={primaryVendor.href}
          primaryLabel={product.amazonUrl ? 'Amazon' : product.chewyUrl ? 'Chewy' : 'Buy Now'}
          secondaryHref={VENDOR_BUTTONS[1]?.href}
          secondaryLabel={VENDOR_BUTTONS[1] ? (product.chewyUrl && product.amazonUrl ? 'Chewy' : undefined) : undefined}
        />
      )}

      {/* ── BREADCRUMB ── */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-4">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-semibold truncate max-w-[200px]">{product.title}</span>
        </nav>
      </div>

      <main className="max-w-[1280px] mx-auto px-0 sm:px-4 md:px-8 pb-16 space-y-4 lg:space-y-8">
        
        <div className="px-4 sm:px-0">
          <AffiliateDisclosure />
        </div>

        {/* ══════════════════════════════════════════════════════
            HERO SECTION — Image + Info + CTA
            ══════════════════════════════════════════════════════ */}
        <div className="bg-card rounded-3xl app-card-feed border border-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* ── LEFT: Image ── */}
            <div className="relative p-4 sm:p-6 lg:p-12 bg-muted/40 flex items-center justify-center min-h-[300px] lg:min-h-[480px]">
              {/* Discount badge */}
              {discount && discount >= 5 && (
                <div className="absolute top-5 left-5 z-10 bg-red-500 text-white text-sm font-black px-3 py-1.5 rounded-full shadow-lg">
                  -{discount}% OFF
                </div>
              )}
              {(product as any).isFeatured && (
                <div className="absolute top-5 right-5 z-10 badge badge-featured text-xs px-3 py-1.5">
                  ⭐ Editor's Pick
                </div>
              )}
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
                <Image
                  src={product.imageUrl || '/placeholder.jpg'}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* ── RIGHT: Info ── */}
            <div className="p-4 sm:p-6 lg:p-12 flex flex-col justify-start gap-5">

              {/* Category + Brand */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-primary">{product.category.name}</span>
                {product.brand && (
                  <span className="badge badge-muted">{product.brand}</span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground leading-tight tracking-tight">
                {product.title}
              </h1>

              {/* Rating row */}
              {avgRating && (
                <div className="flex items-center gap-3 flex-wrap">
                  <StarDisplay rating={avgRating} />
                  <span className="text-lg font-black text-foreground">{avgRating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    {reviewCount ? `(${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})` : 'Editor Rating'}
                  </span>
                  {product.editorRating && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                      <Award className="w-3 h-3" /> Editor Rating
                    </span>
                  )}
                </div>
              )}

              {/* Price block */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-black text-success">{formattedPrice}</span>
                {originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">{originalPrice}</span>
                )}
                {discount && discount >= 5 && (
                  <span className="price-save">Save {discount}%</span>
                )}
              </div>

              {/* Affiliate Disclosure + Editor byline */}
              <div className="flex items-start gap-3 p-4 bg-muted/40 rounded-2xl border border-border">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Reviewed by Mondo Pets Editorial Team</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Independent & unbiased analysis. Updated daily. We may earn a commission on purchases.</p>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              )}

              {/* ── AFFILIATE CTA BOX ── */}
              <div className="affiliate-cta-bar flex-col">
                <p className="text-sm font-black text-foreground w-full flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-primary" />
                  Where to Buy — Best Price Today
                </p>

                <div className="flex flex-col gap-2.5 w-full">
                  {VENDOR_BUTTONS.map((btn) => (
                    <a
                      key={btn.href}
                      href={btn.href}
                      target="_blank"
                      rel="nofollow noopener sponsored"
                      className={`flex items-center justify-between w-full ${btn.bg} ${btn.text} font-bold py-3.5 px-5 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0`}
                    >
                      <div>
                        <span className="text-base font-black block">{btn.label}</span>
                        <span className="text-xs opacity-80">{btn.subLabel}</span>
                      </div>
                      <ExternalLink className="w-5 h-5 opacity-80 flex-shrink-0" />
                    </a>
                  ))}

                  {/* Other retailers link */}
                  {product.affiliateUrl && (product.amazonUrl || product.chewyUrl) && (
                    <a
                      href={`/api/go/${product.id}`}
                      target="_blank"
                      rel="nofollow noopener sponsored"
                      className="flex items-center justify-center gap-2 w-full btn btn-outline btn-sm text-sm"
                    >
                      Other Retailers <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="w-full">
                  <PriceAlertButton productId={product.id} productName={product.title} />
                </div>

                <p className="text-xs text-muted-foreground text-center w-full flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  Price last checked: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Value props */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                {[
                  { icon: ShieldCheck, label: t('secureCheckout'), color: 'text-primary' },
                  { icon: Truck,       label: t('fastShipping'),   color: 'text-emerald-500' },
                  { icon: RotateCcw,   label: t('easyReturns'),    color: 'text-amber-500' },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1.5">
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            NUTRITIONAL ANALYSIS (food products)
            ══════════════════════════════════════════════════════ */}
        {(product.ingredients || product.proteinPercent || product.fatPercent) && (
          <div className="bg-card rounded-3xl app-card-feed border border-border shadow-sm overflow-hidden p-4 sm:p-6 md:p-10">
            <h2 className="text-xl font-black text-foreground mb-4 flex items-center gap-2 px-4 sm:px-0">
              <Info className="w-5 h-5 text-primary" />
              Nutritional Analysis & Ingredients
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nutrient bars */}
              <div>
                <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4">Guaranteed Analysis</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Protein',  value: product.proteinPercent,  color: 'bg-emerald-500', max: 100 },
                    { label: 'Fat',      value: product.fatPercent,       color: 'bg-amber-500',   max: 100 },
                    { label: 'Fiber',    value: product.fiberPercent,     color: 'bg-primary',     max: 20  },
                    { label: 'Moisture', value: product.moisturePercent,  color: 'bg-cyan-500',    max: 100 },
                  ].filter(n => n.value).map(({ label, value, color, max }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm font-semibold mb-1.5">
                        <span className="text-foreground">{label}</span>
                        <span className="text-muted-foreground">{value?.toString()}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`${color} h-2 rounded-full transition-all`}
                          style={{ width: `${Math.min((Number(value) / max) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {product.caloricContent && (
                    <div className="pt-4 border-t border-border text-sm">
                      <span className="font-bold text-foreground">Caloric Content: </span>
                      <span className="text-muted-foreground">{product.caloricContent}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredients */}
              {product.ingredients && (
                <div>
                  <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4">Ingredient List</h3>
                  <div className="bg-muted/40 rounded-xl p-4 border border-border/50 text-sm text-muted-foreground leading-relaxed">
                    {product.ingredients}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 italic flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    Listed in descending order by weight before processing.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            RECALL ALERTS (food only)
            ══════════════════════════════════════════════════════ */}
        {product.type === 'food' && <RecallAlertForm />}

        {/* ══════════════════════════════════════════════════════
            SIMILAR PRODUCTS
            ══════════════════════════════════════════════════════ */}
        {similarProductsData.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-4 px-4 sm:px-0">
              <div>
                <span className="section-label"><TrendingUp className="w-3 h-3" /> You May Also Like</span>
                <h2 className="section-title mt-1 text-xl">Similar Products</h2>
              </div>
              <Link href="/products" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex overflow-x-auto pb-4 scroll-snap-x gap-4 md:grid md:grid-cols-4 md:gap-6 px-4 sm:px-0">
              {similarProductsData.slice(0, 4).map((p: any) => (
                <div key={p.id} className="snap-start flex-shrink-0 w-[240px] sm:w-[260px] md:w-auto">
                  <ProductCard
                    id={p.id}
                    title={p.title}
                    price={Number(p.price)}
                    originalPrice={p.originalPrice ? Number(p.originalPrice) : null}
                    imageUrl={p.imageUrl || '/placeholder.jpg'}
                    brand={p.brand}
                    editorRating={p.editorRating ? Number(p.editorRating) : null}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            USER GENERATED CONTENT (Reviews + Q&A)
            ══════════════════════════════════════════════════════ */}
        <ProductUGC
          productId={product.id}
          initialReviews={reviews}
          initialQuestions={questions}
        />

        {/* ══════════════════════════════════════════════════════
            BOTTOM AFFILIATE CTA (sticky-feel on mobile)
            ══════════════════════════════════════════════════════ */}
        {VENDOR_BUTTONS.length > 0 && (
          <div className="bg-card rounded-3xl app-card-feed border border-border shadow-sm p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black text-foreground mb-1">{product.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Independent review — we earn a small commission at no cost to you.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {VENDOR_BUTTONS.slice(0, 2).map((btn) => (
                  <a
                    key={btn.href}
                    href={btn.href}
                    target="_blank"
                    rel="nofollow noopener sponsored"
                    className={`${btn.bg} ${btn.text} font-bold py-3 px-6 rounded-xl flex items-center gap-2 justify-center transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm whitespace-nowrap`}
                  >
                    {btn.label} <ExternalLink className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
