'use client';

import Image from 'next/image';
import { JsonLd } from './JsonLd';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Scale } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { useFormatter } from 'next-intl';
import { Link } from '@/i18n/routing';

interface ProductCardProps {
  product?: any;
  locale?: string;
  currencyFormatter?: any;
  id?: string;
  title?: string;
  price?: number | string;
  imageUrl?: string;
  affiliateUrl?: string;
  brand?: string | null;
}

export function ProductCard({ 
  product, locale, currencyFormatter,
  id, title, price, imageUrl, brand, affiliateUrl 
}: ProductCardProps) {
  const pId = product?.id || id || '';
  const pTitle = product?.title || title || '';
  const pPrice = product?.price || price || 0;
  const pImageUrl = product?.imageUrl || imageUrl || '';
  const pBrand = product?.brand || brand || null;
  const pAffiliateUrl = product?.affiliateUrl || affiliateUrl || '';
  const { isFavorite, addItem, removeItem } = useWishlist();
  const { isComparing, addItem: addCompare, removeItem: removeCompare } = useCompare();
  const format = useFormatter();
  
  const favorite = isFavorite(pId);
  const comparing = isComparing(pId);
  
  const formattedPrice = typeof pPrice === 'number' 
    ? format.number(pPrice, { style: 'currency', currency: 'USD' }) 
    : pPrice;
    
  const pdpUrl = `/products/${pId}`;
  const trackingUrl = pAffiliateUrl || `/api/go/${pId}`;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (favorite) {
      removeItem(pId);
    } else {
      addItem({ id: pId, title: pTitle, price: formattedPrice, imageUrl: pImageUrl, affiliateUrl: trackingUrl });
    }
  };

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
      price: typeof pPrice === 'number' ? pPrice : pPrice.replace(/[^0-9.]/g, ''),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: trackingUrl
    }
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <motion.div 
        whileHover={{ y: -8, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="h-full relative group"
      >
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">
          <button 
            onClick={toggleFavorite}
            className="p-2 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-white dark:hover:bg-black transition-all group/btn"
            title={favorite ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${favorite ? 'fill-rose-500 text-rose-500' : 'text-foreground/70 group-hover/btn:text-rose-500'}`} 
            />
          </button>
          
          <button 
            onClick={toggleCompare}
            className={`p-2 rounded-full backdrop-blur-md border shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all group/btn2 opacity-0 group-hover:opacity-100 focus:opacity-100 ${comparing ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/70 dark:bg-black/50 border-white/20 text-foreground/70 hover:bg-white dark:hover:bg-black hover:text-indigo-500'}`}
            title={comparing ? "Remove from compare" : "Compare"}
          >
            <Scale className="h-4 w-4" />
          </button>
        </div>

        <div className="h-full relative flex flex-col overflow-hidden rounded-2xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.4)] transition-all duration-500 ease-out">
          
          <Link href={pdpUrl} className="absolute inset-0 z-10">
            <span className="sr-only">View {pTitle}</span>
          </Link>
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-4 flex items-center justify-center">
            <Image 
              src={pImageUrl} 
              alt={pTitle} 
              fill 
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-10 opacity-95 group-hover:opacity-100" 
            />
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 z-20 pointer-events-none" />
          </div>
          
          <div className="flex flex-col flex-1 justify-between gap-3 relative z-20 pointer-events-none">
            <div>
              {pBrand && (
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1 block">
                  {pBrand}
                </span>
              )}
              <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                {pTitle}
              </h3>
            </div>
            
              <div className="flex items-center justify-between mt-auto">
              <p className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                {formattedPrice}
              </p>
              <Link href={pdpUrl} className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-semibold shadow-lg shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors transform group-hover:scale-105 duration-300 pointer-events-auto">
                <span>View Details</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
