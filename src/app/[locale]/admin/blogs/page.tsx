import { BlogsClient } from './BlogsClient';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Blogs | Admin',
};

export const dynamic = 'force-dynamic';

export default async function BlogsPage({ searchParams }: { searchParams: { page?: string, search?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const take = 20;
  const skip = (page - 1) * take;
  const search = searchParams.search || '';

  const where = search ? {
    OR: [
      { title: { contains: search, mode: 'insensitive' as const } },
      { author: { name: { contains: search, mode: 'insensitive' as const } } }
    ]
  } : {};

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        author: { select: { name: true } }
      }
    }),
    prisma.blog.count({ where })
  ]);

  const totalPages = Math.ceil(total / take);

  return <BlogsClient 
    initialBlogs={JSON.parse(JSON.stringify(blogs))} 
    totalPages={totalPages}
    currentPage={page}
    currentSearch={search}
  />;
}
