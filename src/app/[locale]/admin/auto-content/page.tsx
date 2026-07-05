import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { AutoContentClient } from './AutoContentClient';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Auto Content (AI) | Admin',
};

export default async function AutoContentPage() {
  // Fetch initial select options for Category and Author
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  const authors = await prisma.author.findMany({
    select: { id: true, name: true, credentials: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2 text-foreground">
            <Sparkles className="w-8 h-8 text-emerald-500" />
            Auto Content Engine
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Bulk-generate programmatic product details and draft high-converting affiliate articles.
          </p>
        </div>
      </div>

      <AutoContentClient categories={categories} authors={authors} />
    </div>
  );
}
