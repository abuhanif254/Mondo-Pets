import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Star, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export async function generateMetadata({ params: { locale, slug } }: { params: { locale: string, slug: string } }): Promise<Metadata> {
  const listicle = await prisma.listicle.findUnique({
    where: { slug }
  });

  if (!listicle) {
    return { title: 'Not Found' };
  }

  return {
    title: listicle.seoTitle || `${listicle.title} - Mondo Pets`,
    description: listicle.seoDesc || listicle.description || `Read our expert recommendations for ${listicle.title}.`,
  };
}

export default async function ListiclePage({ params: { locale, slug } }: { params: { locale: string, slug: string } }) {
  const t = await getTranslations({ locale, namespace: 'common' });
  const listicle = await prisma.listicle.findUnique({
    where: { slug }
  });

  if (!listicle) {
    notFound();
  }

  // Construct query based on listicle filters
  const whereClause: any = {};
  if (listicle.petType) whereClause.petType = listicle.petType;
  if (listicle.productType) whereClause.type = listicle.productType;
  if (listicle.minRating) whereClause.editorRating = { gte: listicle.minRating };
  if (listicle.dietaryNeeds) whereClause.dietaryNeeds = { contains: listicle.dietaryNeeds, mode: 'insensitive' };

  // Fetch products
  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: { editorRating: 'desc' },
    take: 15,
  });

  return (
    <div className="bg-muted/30 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight tracking-tight">
            {listicle.title}
          </h1>
          {listicle.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {listicle.description}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4" /> Unbiased Expert Reviews
            </span>
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4" /> Updated {new Date(listicle.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Products List */}
        <div className="space-y-12">
          {products.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold">No products found yet</h3>
              <p className="text-muted-foreground mt-2">We are currently testing and reviewing products for this category. Check back soon!</p>
            </div>
          ) : (
            products.map((product, index) => (
              <article key={product.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col md:flex-row">
                
                {/* Product Image & Rank */}
                <div className="md:w-1/3 relative bg-muted/20 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-border">
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-md">
                    #{index + 1}
                  </div>
                  <div className="relative w-48 h-48">
                    <Image
                      src={product.imageUrl || '/placeholder.png'}
                      alt={product.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6 md:p-8 md:w-2/3 flex flex-col justify-between">
                  <div>
                    {product.brand && (
                      <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        {product.brand}
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-foreground mb-3 hover:text-primary transition-colors">
                      <Link href={`/${locale}/products/${product.id}`}>
                        {product.title}
                      </Link>
                    </h2>
                    
                    {product.editorRating && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < Math.floor(Number(product.editorRating)) ? 'fill-current' : 'fill-muted text-muted'}`} />
                          ))}
                        </div>
                        <span className="font-bold">{product.editorRating.toString()} Stars</span>
                      </div>
                    )}
                    
                    {product.description && (
                      <p className="text-muted-foreground line-clamp-3 mb-6">
                        {product.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link 
                      href={`/${locale}/products/${product.id}`}
                      className="flex-1 bg-secondary text-secondary-foreground text-center py-3 rounded-xl font-bold hover:bg-secondary/90 transition-colors"
                    >
                      Read Full Review
                    </Link>
                    
                    {product.amazonUrl && (
                      <a 
                        href={`/api/go/${product.id}?target=amazon`}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="flex-1 bg-[#FF9900] text-black text-center py-3 rounded-xl font-bold hover:bg-[#FF9900]/90 transition-colors flex items-center justify-center gap-2"
                      >
                        Check Amazon Price
                      </a>
                    )}
                    {!product.amazonUrl && product.chewyUrl && (
                      <a 
                        href={`/api/go/${product.id}?target=chewy`}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="flex-1 bg-[#1c49c2] text-white text-center py-3 rounded-xl font-bold hover:bg-[#1c49c2]/90 transition-colors flex items-center justify-center gap-2"
                      >
                        Check Chewy Price
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
