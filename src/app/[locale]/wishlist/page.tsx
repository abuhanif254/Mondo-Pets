'use client';

import * as React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/ProductCard';
import { HeartCrack } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function WishlistPage() {
  const { items } = useWishlist();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 py-16 px-6 flex items-center justify-center">
        <p className="text-muted-foreground">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary/10 py-12 px-6 border-b border-border">
        <div className="container mx-auto max-w-4xl space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">Your Wishlist</h1>
          <p className="text-lg text-muted-foreground">Products you've favorited are saved here in your browser.</p>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="container mx-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl bg-card">
              <HeartCrack className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Looks like you haven't saved any products yet. Explore our toys and premium food to find something your pet will love!
              </p>
              <div className="flex gap-4">
                <Link href="/toys" className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-semibold hover:bg-primary/90 transition-colors">
                  Shop Toys
                </Link>
                <Link href="/food" className="bg-secondary text-secondary-foreground px-6 py-2 rounded-full font-semibold hover:bg-secondary/90 transition-colors">
                  Shop Food
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="font-semibold text-muted-foreground">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {items.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    affiliateUrl={product.affiliateUrl}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
