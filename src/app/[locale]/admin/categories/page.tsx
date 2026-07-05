import { getCategories } from '@/app/actions/categories';
import { CategoryClient } from './CategoryClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Categories | Admin',
};

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return <CategoryClient initialCategories={categories} />;
}
