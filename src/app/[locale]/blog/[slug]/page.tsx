import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { JsonLd } from '@/components/JsonLd';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const post = await prisma.blog.findUnique({
    where: { slug },
    include: { author: true }
  });

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.credentials || undefined,
    },
    datePublished: post.createdAt.toISOString(),
  };

  return (
    <article className="min-h-screen bg-background pb-20">
      <JsonLd data={jsonLd} />
      
      <header className="bg-muted/30 py-16 px-6 border-b border-border">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
            {post.title}
          </h1>
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-lg font-medium text-foreground">
              By {post.author.name} {post.author.credentials && <span className="text-muted-foreground">({post.author.credentials})</span>}
            </p>
            <p className="text-sm text-muted-foreground">
              Published on {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-6 mt-12">
        <div className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none">
          <p className="lead text-xl text-muted-foreground mb-8">
            {post.excerpt}
          </p>
          
          <div 
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>
      </div>
    </article>
  );
}
