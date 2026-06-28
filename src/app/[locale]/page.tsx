import {useTranslations} from 'next-intl';
import {ProductCard} from '@/components/ProductCard';
import {BlogCard} from '@/components/BlogCard';
import {Link} from '@/i18n/routing';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-muted/50 py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">{t('title')}</h2>
          <p className="text-lg md:text-xl text-muted-foreground">{t('subtitle')}</p>
        </div>
      </section>

      {/* Featured Toys */}
      <section className="py-16 px-6 border-b border-border">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-foreground">{t('featuredToys')}</h3>
            <Link href="/toys" className="text-sm font-semibold text-primary hover:underline">{t('viewAll')} →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ProductCard 
              title="Interactive Dog Puzzle Toy" 
              price="$24.99" 
              imageUrl="/placeholder.jpg" 
              affiliateUrl="#" 
            />
            <ProductCard 
              title="Feather Teaser Cat Wand" 
              price="$9.99" 
              imageUrl="/placeholder.jpg" 
              affiliateUrl="#" 
            />
            <ProductCard 
              title="Durable Chew Ring (Large)" 
              price="$15.50" 
              imageUrl="/placeholder.jpg" 
              affiliateUrl="#" 
            />
            <ProductCard 
              title="Parrot Foraging Block" 
              price="$12.00" 
              imageUrl="/placeholder.jpg" 
              affiliateUrl="#" 
            />
          </div>
        </div>
      </section>

      {/* Featured Food */}
      <section className="py-16 px-6 bg-muted/20 border-b border-border">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-foreground">{t('featuredFood')}</h3>
            <Link href="/food" className="text-sm font-semibold text-primary hover:underline">{t('viewAll')} →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ProductCard 
              title="Premium Grain-Free Dog Kibble" 
              price="$54.99" 
              imageUrl="/placeholder.jpg" 
              affiliateUrl="#" 
            />
            <ProductCard 
              title="Organic Salmon Cat Pate" 
              price="$3.50" 
              imageUrl="/placeholder.jpg" 
              affiliateUrl="#" 
            />
            <ProductCard 
              title="High-Protein Bird Seed Mix" 
              price="$18.99" 
              imageUrl="/placeholder.jpg" 
              affiliateUrl="#" 
            />
            <ProductCard 
              title="Rabbit Timothy Hay" 
              price="$22.00" 
              imageUrl="/placeholder.jpg" 
              affiliateUrl="#" 
            />
          </div>
        </div>
      </section>

      {/* Latest Medical Advice */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-foreground">{t('latestAdvice')}</h3>
            <Link href="/care" className="text-sm font-semibold text-primary hover:underline">{t('viewAll')} →</Link>
          </div>
          <div className="flex flex-col gap-6">
            <BlogCard 
              title="Recognizing Early Signs of Arthritis in Older Dogs"
              excerpt="Arthritis is common in senior dogs. Learn how to spot the early signs, including stiffness, reluctance to climb stairs, and behavioral changes, so you can consult your vet early."
              authorName="Dr. Sarah Jenkins"
              authorCredential="DVM, Veterinary Orthopedics"
              date="2026-06-25"
              slug="signs-of-arthritis-dogs"
            />
            <BlogCard 
              title="Proper Dietary Ratios for Feline Kidney Health"
              excerpt="Chronic kidney disease affects many older cats. A specialized diet low in phosphorus and moderate in high-quality protein can significantly slow disease progression."
              authorName="Dr. Marcus Thorne"
              authorCredential="DVM, Feline Nutrition Specialist"
              date="2026-06-20"
              slug="feline-kidney-health-diet"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
