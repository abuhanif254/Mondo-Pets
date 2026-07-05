import Image from 'next/image';
import { ExternalLink, Star, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface Product {
  id: string;
  title: string;
  price: number | string;
  originalPrice?: number | string | null;
  imageUrl: string | null;
  affiliateUrl: string | null;
  amazonUrl?: string | null;
  chewyUrl?: string | null;
  editorRating: number | null;
  brand?: string | null;
  description?: string | null;
}

interface BlogAffiliateCardProps {
  product: Product;
  label?: string;
  variant?: 'editor-pick' | 'best-value' | 'hot-deal' | 'top-rated';
}

const VARIANT_CONFIG = {
  'editor-pick': {
    badge: "🏆 Editor's Pick",
    badgeClass: 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300',
    accent: 'border-amber-200 dark:border-amber-800/50',
    gradient: 'from-amber-50/80 via-background to-background dark:from-amber-950/20',
  },
  'best-value': {
    badge: '💰 Best Value',
    badgeClass: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300',
    accent: 'border-emerald-200 dark:border-emerald-800/50',
    gradient: 'from-emerald-50/80 via-background to-background dark:from-emerald-950/20',
  },
  'hot-deal': {
    badge: '🔥 Hot Deal',
    badgeClass: 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300',
    accent: 'border-red-200 dark:border-red-800/50',
    gradient: 'from-red-50/80 via-background to-background dark:from-red-950/20',
  },
  'top-rated': {
    badge: '⭐ Top Rated',
    badgeClass: 'bg-violet-100 dark:bg-violet-950/40 text-violet-800 dark:text-violet-300',
    accent: 'border-violet-200 dark:border-violet-800/50',
    gradient: 'from-violet-50/80 via-background to-background dark:from-violet-950/20',
  },
};

export function BlogAffiliateCard({ product, label, variant = 'editor-pick' }: BlogAffiliateCardProps) {
  if (!product) return null;

  const cfg = VARIANT_CONFIG[variant];
  const badgeText = label || cfg.badge;
  const price = Number(product.price);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const primaryUrl = product.amazonUrl
    ? `/api/go/${product.id}?vendor=amazon`
    : product.chewyUrl
    ? `/api/go/${product.id}?vendor=chewy`
    : product.affiliateUrl || `/api/go/${product.id}`;

  const hasMultipleVendors = !!(product.amazonUrl || product.chewyUrl);

  return (
    <div className={`not-prose my-10 rounded-3xl border-2 ${cfg.accent} bg-gradient-to-br ${cfg.gradient} shadow-sm overflow-hidden`}>
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-amber-400 to-primary/50" />

      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">

          {/* Product Image */}
          <div className="w-full sm:w-auto flex-shrink-0 flex justify-center sm:justify-start">
            <Link
              href={`/products/${product.id}`}
              className="block relative w-36 h-36 sm:w-44 sm:h-44 bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  sizes="176px"
                  className="object-contain p-3"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
              )}
            </Link>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            {/* Badge + brand */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${cfg.badgeClass}`}>
                {badgeText}
              </span>
              {product.brand && (
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                  {product.brand}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-black text-foreground leading-snug">
              <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                {product.title}
              </Link>
            </h3>

            {/* Rating + price row */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-success">
                  ${price.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
                {discount && discount >= 5 && (
                  <span className="flex items-center gap-1 text-xs font-black text-red-600 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-full">
                    <Zap className="w-3 h-3" /> -{discount}%
                  </span>
                )}
              </div>

              {/* Editor rating */}
              {product.editorRating && (
                <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-border px-3 py-1.5 rounded-full shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-black text-foreground">{product.editorRating}/5</span>
                  <span className="text-xs text-muted-foreground">Editor Rating</span>
                </div>
              )}
            </div>

            {/* Description or trust copy */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description
                ? product.description.slice(0, 140) + (product.description.length > 140 ? '…' : '')
                : 'Highly recommended based on expert testing, durability, and value. Every purchase supports our free pet care guides.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              {product.amazonUrl && (
                <a
                  href={`/api/go/${product.id}?vendor=amazon`}
                  target="_blank"
                  rel="nofollow noopener sponsored"
                  className="flex items-center justify-between gap-2 px-5 py-3 bg-[#FF9900] hover:bg-[#e68a00] text-black font-black rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-sm"
                >
                  <span>Check on Amazon</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {product.chewyUrl && (
                <a
                  href={`/api/go/${product.id}?vendor=chewy`}
                  target="_blank"
                  rel="nofollow noopener sponsored"
                  className="flex items-center justify-between gap-2 px-5 py-3 bg-[#0052cc] hover:bg-[#003d99] text-white font-black rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-sm"
                >
                  <span>Check on Chewy</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {!product.amazonUrl && !product.chewyUrl && (
                <a
                  href={primaryUrl}
                  target="_blank"
                  rel="nofollow noopener sponsored"
                  className="btn btn-affiliate text-sm"
                >
                  Check Best Price <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <Link
                href={`/products/${product.id}`}
                className="flex items-center justify-center gap-1.5 px-4 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors text-sm"
              >
                Full Review →
              </Link>
            </div>

            {/* Trust micro-copy */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Independent review
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-primary" />
                Price checked daily
              </span>
              <span>We may earn a commission.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
