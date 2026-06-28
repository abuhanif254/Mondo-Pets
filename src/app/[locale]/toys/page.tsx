import {useTranslations} from 'next-intl';
import {ProductCard} from '@/components/ProductCard';

export default function ToysPage() {
  const t = useTranslations('ToysPage');

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
            <ProductCard 
              title="Squeaky Plush Fox" 
              price="$8.99" 
              imageUrl="/placeholder.jpg" 
              affiliateUrl="#" 
            />
            <ProductCard 
              title="Hamster Exercise Ball" 
              price="$11.99" 
              imageUrl="/placeholder.jpg" 
              affiliateUrl="#" 
            />
          </div>
        </div>
      </main>
    </div>
  );
}
