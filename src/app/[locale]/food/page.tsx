import {useTranslations} from 'next-intl';
import {ProductCard} from '@/components/ProductCard';

export default function FoodPage() {
  const t = useTranslations('FoodPage');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-muted/50 py-12 px-6 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{t('title')}</h1>
          <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
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
            <ProductCard 
              title="Puppy Milk Replacer" 
              price="$14.99" 
              imageUrl="/placeholder.jpg" 
              affiliateUrl="#" 
            />
            <ProductCard 
              title="Freeze-Dried Beef Liver Treats" 
              price="$9.50" 
              imageUrl="/placeholder.jpg" 
              affiliateUrl="#" 
            />
          </div>
        </div>
      </main>
    </div>
  );
}
