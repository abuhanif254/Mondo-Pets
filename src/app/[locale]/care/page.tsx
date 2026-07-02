import { getTranslations } from 'next-intl/server';
import { BlogCard } from '@/components/BlogCard';
import { getBlogs } from '@/app/actions';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CarePage' });

  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} | Mondo Pets`,
      description: t('subtitle'),
      url: `https://mondopets.com/${locale}/care`,
      siteName: 'Mondo Pets',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&h=630&q=80',
          width: 1200,
          height: 630,
          alt: 'Mondo Pets Care & Medical Advice',
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | Mondo Pets`,
      description: t('subtitle'),
      images: ['https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&h=630&q=80'],
    }
  };
}

export default async function CarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CarePage' });
  const blogs = await getBlogs();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-muted/50 py-12 px-6 border-b border-border">
        <div className="container mx-auto max-w-4xl space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{t('title')}</h1>
          <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                title={blog.title}
                excerpt={blog.excerpt}
                authorName={blog.author.name}
                authorCredential={blog.author.credentials || ''}
                date={blog.createdAt.toISOString().split('T')[0]}
                slug={blog.slug}
              />
            ))}
          </div>

          {blogs.length === 0 && (
            <div className="py-12 text-center text-muted-foreground border border-dashed rounded-lg mt-8">
              No medical advice articles found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
