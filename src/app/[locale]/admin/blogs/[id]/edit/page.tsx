import { BlogForm } from '../../BlogForm';
import { getCategories } from '@/app/actions/categories';
import { getAuthors } from '@/app/actions/authors';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Blog | Admin',
};

export const dynamic = 'force-dynamic';

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const categories = await getCategories();
  const authors = await getAuthors();
  const blog = await prisma.blog.findUnique({
    where: { id: params.id }
  });

  if (!blog) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/en/admin/blogs"
          className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
      </div>
      
      <BlogForm categories={categories} authors={authors} initialData={blog} />
    </div>
  );
}
