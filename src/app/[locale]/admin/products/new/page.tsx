import { ProductForm } from '../ProductForm';
import { getCategories } from '@/app/actions/categories';
import { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Add New Product | Admin',
};

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/en/admin/products"
          className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
      </div>
      
      <ProductForm categories={categories} />
    </div>
  );
}
