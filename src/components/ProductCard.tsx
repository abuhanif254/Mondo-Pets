'use client';

import Image from 'next/image';
import { JsonLd } from './JsonLd';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Scale, Star, Zap } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { useFormatter } from 'next-intl';
import { Link } from '@/i18n/routing';
import { triggerHaptic } from '@/lib/haptic';

interface ProductCardProps {
  product?: any;
  locale?: string;
  currencyFormatter?: any;
  id?: string;
  title?: string;
  price?: number | string;
  originalPrice?: number | string | null;
  imageUrl?: string;
  affiliateUrl?: string;
  brand?: string | null;
  editorRating?: number | null;
  isFeatured?: boolean;
  badge?: string; // e.g. "Editor's Pick", "Best Value", "Hot Deal"
}

export function ProductCard({
  product, locale, currencyFormatter,
  id, title, price, originalPrice, imageUrl, brand,
  affiliateUrl, editorRating, isFeatured, badge,
}: ProductCardProps) {
  const pId           = product?.id           || id           || '';
  const pTitle        = product?.title        || title        || '';
  const pPrice        = product?.price        || price        || 0;
  const pOriginal     = product?.originalPrice || originalPrice || null;
  const pImageUrl     = product?.imageUrl     || imageUrl     || '';
  const pBrand        = product?.brand        || brand        || null;
  const pAffiliateUrl = product?.affiliateUrl || affiliateUrl || '';
  const pRating       = product?.editorRating || editorRating || null;
  const pFeatured     = product?.isFeatured   || isFeatured   || false;
  const pBadge        = badge || (pFeatured ? "Editor's Pick" : null);

  const { isFavorite, addItem, removeItem } = useWishlist();
  const { isComparing, addItem: addCompare, removeItem: removeCompare } = useCompare();
  const format = useFormatter();

  const favorite  = isFavorite(pId);
  const comparing = isComparing(pId);

  const formattedPrice = typeof pPrice === 'number'
    ? format.number(pPrice, { style: 'currency', currency: 'USD' })
    : pPrice;

  const formattedOriginal = pOriginal
    ? (typeof pOriginal === 'number'
        ? format.number(pOriginal, { style: 'currency', currency: 'USD' })
        : pOriginal)
    : null;

  const discount = pOriginal && typeof pPrice === 'number' && typeof pOriginal === 'number' && pOriginal > pPrice
    ? Math.round(((pOriginal - pPrice) / pOriginal) * 100)
    : null;

  const pdpUrl      = `/products/${pId}`;
  const trackingUrl = pAffiliateUrl || `/api/go/${pId}`;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic(10);
    if (favorite) {
      removeItem(pId);
    } else {
      addItem({ id: pId, title: pTitle, price: formattedPrice, imageUrl: pImageUrl, affiliateUrl: trackingUrl });
    }
  };

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic(10);
    if (comparing) {
      removeCompare(pId);
    } else {
      addCompare({ id: pId, title: pTitle, imageUrl: pImageUrl });
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pTitle,
    image: pImageUrl,
    offers: {
      '@type': 'Offer',
      price: typeof pPrice === 'number' ? pPrice : String(pPrice).replace(/[^0-9.]/g, ''),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: trackingUrl,
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <motion.div
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="h-full relative group"
      >
        {/* ── BADGES (top-left) ── */}
        <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5">
          {discount && discount >= 5 && (
            <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
              <Zap className="w-2.5 h-2.5" />
              -{discount}%
            </span>
          )}
          {pBadge && (
            <span className="badge badge-featured text-[10px]">
              {pBadge}
            </span>
          )}
        </div>

        {/* ── ACTION BUTTONS (top-right) ── */}
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5">
          <button
            onClick={toggleFavorite}
            aria-label={favorite ? 'Remove from wishlist' : 'Add to wishlist'}
            className="p-2 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-white/30 shadow-md hover:scale-110 transition-all"
          >
            <Heart className={`h-4 w-4 transition-colors ${favorite ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground hover:text-rose-500'}`} />
          </button>
          <button
            onClick={toggleCompare}
            aria-label={comparing ? 'Remove from compare' : 'Add to compare'}
            className={`p-2 rounded-full backdrop-blur-sm border shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-110 ${
              comparing
                ? 'bg-primary border-primary/50 text-white'
                : 'bg-white/80 dark:bg-zinc-900/80 border-white/30 text-muted-foreground hover:text-primary'
            }`}
          >
            <Scale className="h-4 w-4" />
          </button>
        </div>

        {/* ── CARD BODY ── */}
        <div className="h-full flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">

          {/* Image */}
          <Link href={pdpUrl} className="relative block aspect-square w-full overflow-hidden bg-muted">
            <Image
              src={pImageUrl}
              alt={pTitle}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Info */}
          <div className="flex flex-col flex-1 p-4 gap-2">
            {/* Brand + rating row */}
            <div className="flex items-center justify-between">
              {pBrand && (
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground truncate">
                  {pBrand}
                </span>
              )}
              {pRating && (
                <span className="flex items-center gap-0.5 text-amber-500 ml-auto flex-shrink-0">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-[11px] font-bold text-foreground">{Number(pRating).toFixed(1)}</span>
                </span>
              )}
            </div>

            {/* Title */}
            <Link href={pdpUrl}>
              <h3 className="text-[14px] font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                {pTitle}
              </h3>
            </Link>

            {/* Price row */}
            <div className="flex items-baseline gap-2 mt-auto pt-1">
              <span className="text-lg font-black text-foreground tracking-tight">
                {formattedPrice}
              </span>
              {formattedOriginal && (
                <span className="text-xs text-muted-foreground line-through">
                  {formattedOriginal}
                </span>
              )}
            </div>

            {/* CTA */}
            <a
              href={trackingUrl}
              target="_blank"
              rel="nofollow noopener sponsored"
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic(15);
              }}
              className="mt-1 flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-sm shadow-primary/25 transition-all hover:shadow-md hover:shadow-primary/30 active:scale-95"
            >
              Check Price <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
}
