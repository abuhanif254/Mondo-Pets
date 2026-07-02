import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import ProductsClient from './ProductsClient';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: `Products Catalog - Mondo Pets`,
    description: `Browse all products across categories and brands.`,
  };
}

function serializeProduct(product: any) {
  return {
    ...product,
    price: product.price ? Number(product.price) : 0,
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    commissionRate: product.commissionRate ? Number(product.commissionRate) : null,
    estimatedMargin: product.estimatedMargin ? Number(product.estimatedMargin) : null,
    editorRating: product.editorRating ? Number(product.editorRating) : null,
    proteinPercent: product.proteinPercent ? Number(product.proteinPercent) : null,
    fatPercent: product.fatPercent ? Number(product.fatPercent) : null,
    fiberPercent: product.fiberPercent ? Number(product.fiberPercent) : null,
    moisturePercent: product.moisturePercent ? Number(product.moisturePercent) : null,
  };
}

export default async function ProductsPage() {
  // Fetch all categories (pets)
  const petTypes = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  // Fetch all products
  const products = await prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Extract unique brands
  const brandsSet = new Set<string>();
  products.forEach(p => {
    if (p.brand) brandsSet.add(p.brand);
  });
  const brands = Array.from(brandsSet).sort();

  // Extract unique product types (e.g. food, toy, medicine)
  const typesSet = new Set<string>();
  products.forEach(p => {
    if (p.type) typesSet.add(p.type);
  });
  const productTypes = Array.from(typesSet).sort();

  return (
    <div className="bg-muted/30 min-h-screen">
      <ProductsClient 
        initialProducts={products.map(serializeProduct)}
        brands={brands}
        productTypes={productTypes}
        petTypes={petTypes}
      />
    </div>
  );
}
