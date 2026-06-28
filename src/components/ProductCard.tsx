import Image from 'next/image';
import { JsonLd } from './JsonLd';

interface ProductCardProps {
  title: string;
  price: string;
  imageUrl: string;
  affiliateUrl: string;
}

export function ProductCard({ title, price, imageUrl, affiliateUrl }: ProductCardProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    image: imageUrl,
    offers: {
      '@type': 'Offer',
      price: price.replace(/[^0-9.]/g, ''),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: affiliateUrl
    }
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-white p-4 hover:shadow-md transition-shadow">
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted mb-4">
        {/* Placeholder image rendering for now */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
          Image
        </div>
        {/* Replace with actual Image when integrating:
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-cover transition-transform group-hover:scale-105" 
        />
        */}
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-medium text-foreground line-clamp-2">{title}</h3>
        <p className="mt-1 text-sm font-bold text-primary">{price}</p>
      </div>
      <a 
        href={affiliateUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="mt-4 flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Buy Now
      </a>
    </div>
    </>
  );
}
