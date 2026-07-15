import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import type { Metadata } from 'next';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';



interface PageProps {
  params: Promise<{
    locale: string;
    petType: string;
    category: string;
  }>;
}

// Generate SEO Metadata dynamically based on the URL params
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, petType, category } = await params;
  
  // Format strings for presentation: 'dog' -> 'Dog', 'food' -> 'Food'
  const formattedPetType = petType.charAt(0).toUpperCase() + petType.slice(1);
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  const title = `Best ${formattedCategory} for ${formattedPetType}s (2026 Reviews)`;
  const description = `Looking for the best ${category} for your ${petType}? Read our expert reviews, compare prices, and find the perfect match for your pet.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://mondopets.com/${locale}/shop/${petType}/${category}`
    }
  };
}

export default async function ProgrammaticDirectoryPage({ params }: PageProps) {
  const { petType, category } = await params;

  // Format strings
  const formattedPetType = petType.charAt(0).toUpperCase() + petType.slice(1);
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  // Query database for matching products
  const products = await prisma.product.findMany({
    where: {
      petType: { equals: petType, mode: 'insensitive' },
      type: { equals: category, mode: 'insensitive' }
    },
    orderBy: { editorRating: 'desc' },
    take: 24
  });

  if (products.length === 0) {
    // If no products match this combination, return 404 to avoid thin content SEO penalties
    notFound();
  }

  // Serialize Decimal types for client components
  const serializedProducts = products.map(p => ({
    ...p,
    price: p.price.toString(),
    commissionRate: p.commissionRate?.toString() || '0',
    estimatedMargin: p.estimatedMargin?.toString() || '0',
    proteinPercent: p.proteinPercent?.toString() || null,
    fatPercent: p.fatPercent?.toString() || null,
    fiberPercent: p.fiberPercent?.toString() || null,
    moisturePercent: p.moisturePercent?.toString() || null,
    editorRating: p.editorRating?.toString() || null
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      
      {/* SEO Optimized Header */}
      <div className="bg-emerald-900 text-white rounded-[3rem] p-10 md:p-16 mb-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1548767797-d8c844163c4c')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-transparent"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/50 backdrop-blur text-emerald-300 font-bold text-sm mb-6 uppercase tracking-widest border border-emerald-700/50">
            <Sparkles className="w-4 h-4" /> Top Rated
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            The Best {formattedCategory} for {formattedPetType}s
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 font-medium mb-8">
            Expert-reviewed and community-tested {category} tailored specifically for your {petType}. Find exactly what you need at the best price.
          </p>
          
          <Link href="/quiz" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl shadow-emerald-900/20">
            Take the Gift Finder Quiz <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Top {serializedProducts.length} Results</h2>
        <div className="text-sm text-muted-foreground">Sorted by Expert Rating</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {serializedProducts.map(product => (
          <ProductCard 
            key={product.id} 
            id={product.id}
            title={product.title}
            price={Number(product.price)}
            imageUrl={product.imageUrl || ''}
            brand={product.brand}
          />
        ))}
      </div>

      {/* SEO Footer Content (Good for long-tail rankings) */}
      <div className="mt-20 p-10 bg-card border border-border rounded-3xl">
        <h3 className="text-2xl font-bold mb-4">How We Choose the Best {formattedCategory} for {formattedPetType}s</h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Finding the right {category} for your {petType} can be overwhelming with thousands of options on the market. Our team of pet experts and veterinary consultants rigorously review products based on quality, safety, ingredients, and real-world durability.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          We constantly update this directory to ensure you're getting the most accurate pricing and recall information. When you click through our affiliate links, we may earn a small commission that helps support our unbiased reviews.
        </p>
      </div>

    </div>
  );
}
