import { ProductsClient } from './ProductsClient';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Products | Admin',
};

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: { searchParams: { page?: string, search?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const take = 20;
  const skip = (page - 1) * take;
  const search = searchParams.search || '';

  const where = search ? {
    OR: [
      { title: { contains: search, mode: 'insensitive' as const } },
    ]
  } : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } }
      }
    }),
    prisma.product.count({ where })
  ]);

  const totalPages = Math.ceil(total / take);

  return <ProductsClient 
    initialProducts={JSON.parse(JSON.stringify(products))} 
    totalPages={totalPages}
    currentPage={page}
    currentSearch={search}
  />;
}
