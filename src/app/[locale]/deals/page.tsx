import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getCoupons } from '@/app/actions';
import { Tag, ExternalLink, Scissors, Clock } from 'lucide-react';
import { Link } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Pet Deals & Coupons',
    description: 'Discover the latest promo codes, discounts, and deals for premium pet toys and food from top retailers.',
    openGraph: {
      title: 'Pet Deals & Coupons | Mondo Pets',
      description: 'Discover the latest promo codes, discounts, and deals for premium pet toys and food from top retailers.',
      url: `https://mondopets.com/${locale}/deals`,
      siteName: 'Mondo Pets',
      type: 'website',
    },
  };
}

export default async function CouponsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const coupons = await getCoupons();
  
  // Note: Since this is a server component, we will render a client component for the copy interaction
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-16 px-6 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto text-center relative z-10 max-w-2xl">
          <Tag className="w-12 h-12 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Mondo Pets Deals & Coupons</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80">Save on the best pet food, toys, and accessories with our curated promo codes.</p>
        </div>
      </header>

      <main className="flex-1 py-16 px-6 container mx-auto max-w-6xl">
        {coupons.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
            <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Active Deals Right Now</h2>
            <p className="text-muted-foreground mb-6">Check back soon for new promo codes and discounts!</p>
            <Link href="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Client component for the interactive parts
import { CopyButton } from './CopyButton';

function CouponCard({ coupon }: { coupon: any }) {
  const isExpiringSoon = coupon.expiresAt && new Date(coupon.expiresAt).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500"></div>

      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <span className="bg-secondary text-secondary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
            {coupon.retailerName}
          </span>
          {isExpiringSoon && (
            <span className="flex items-center text-xs font-bold text-destructive bg-destructive/10 px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3 mr-1" /> Expiring Soon
            </span>
          )}
        </div>
        <h3 className="text-2xl font-black text-foreground mt-3">{coupon.discountValue}</h3>
        <p className="text-muted-foreground mt-1 leading-snug">{coupon.description}</p>
      </div>
      
      <div className="mt-auto pt-6">
        <div className="border-t border-dashed border-border mb-6"></div>
        <div className="flex items-center gap-3">
          <CopyButton code={coupon.code} />
          <a 
            href={coupon.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 px-4 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Shop Deal <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
