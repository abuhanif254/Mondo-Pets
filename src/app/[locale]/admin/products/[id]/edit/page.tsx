import { ProductForm } from '../../ProductForm';
import { getCategories } from '@/app/actions/categories';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Product | Admin',
};

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const categories = await getCategories();
  const product = await prisma.product.findUnique({
    where: { id: params.id }
  });

  if (!product) {
    notFound();
  }

  // Convert decimal to string for input fields
  const serializedProduct = {
    ...product,
    price: product.price?.toString() || '',
    commissionRate: product.commissionRate?.toString() || '',
    estimatedMargin: product.estimatedMargin?.toString() || '',
    proteinPercent: product.proteinPercent?.toString() || '',
    fatPercent: product.fatPercent?.toString() || '',
    fiberPercent: product.fiberPercent?.toString() || '',
    moisturePercent: product.moisturePercent?.toString() || '',
    editorRating: product.editorRating?.toString() || '',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/en/admin/products"
          className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
      </div>
      
      <ProductForm categories={categories} initialData={serializedProduct} />
    </div>
  );
}
