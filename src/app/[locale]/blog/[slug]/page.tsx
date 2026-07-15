import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { 
  getBlogBySlug, 
  getAllBlogSlugs,
  getRelatedBlogs,
  getMidArticleAffiliateProduct 
} from '@/app/actions';

// Components
import { BlogPostHero } from '@/components/BlogPostHero';
import { BlogReadingProgress } from '@/components/BlogReadingProgress';
import { BlogShareBar } from '@/components/BlogShareBar';
import { BlogTableOfContents } from '@/components/BlogTableOfContents';
import { BlogAuthorCard } from '@/components/BlogAuthorCard';
import { BlogRelatedPosts } from '@/components/BlogRelatedPosts';
import { BlogAffiliateCard } from '@/components/BlogAffiliateCard';
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure';
import { BlogViewTracker } from '@/components/BlogViewTracker';

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  const locales = ['en', 'bn', 'hi', 'de', 'es'];
  const params: { locale: string, slug: string }[] = [];
  
  locales.forEach(locale => {
    slugs.forEach(blog => {
      params.push({ locale, slug: blog.slug });
    });
  });
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const blog = await getBlogBySlug(slug);
  
  if (!blog) return { title: 'Not Found' };

  const title = blog.metaTitle || `${blog.title} | Mondo Pets`;
  const description = blog.metaDescription || blog.excerpt;
  const url = `https://mondopets.com/${locale}/blog/${slug}`;
  const imageUrl = blog.coverImageUrl || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&h=630&q=80';

  return {
    title,
    description,
    keywords: blog.tags,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: blog.publishedAt.toISOString(),
      modifiedTime: blog.updatedAt.toISOString(),
      authors: [blog.author.name],
      tags: blog.tags,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
      languages: {
        'en': `https://mondopets.com/en/blog/${slug}`,
        'bn': `https://mondopets.com/bn/blog/${slug}`,
        'hi': `https://mondopets.com/hi/blog/${slug}`,
        'de': `https://mondopets.com/de/blog/${slug}`,
        'es': `https://mondopets.com/es/blog/${slug}`,
      }
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogPage' });
  
  const blog = await getBlogBySlug(slug);
  
  if (!blog) {
    notFound();
  }



  const relatedBlogs = await getRelatedBlogs(blog.categoryId, slug, 3);
  const midArticleProduct = await getMidArticleAffiliateProduct(blog.categoryId);

  // Split content into two halves to insert the affiliate card in the middle
  // (Assuming basic HTML blocks; in a real app you might parse HTML properly)
  const paragraphs = blog.content.split('<h2>');
  let firstHalf = paragraphs[0];
  let secondHalf = '';
  
  if (paragraphs.length > 1) {
    const splitIndex = Math.ceil(paragraphs.length / 2);
    firstHalf = paragraphs.slice(0, splitIndex).join('<h2>');
    secondHalf = '<h2>' + paragraphs.slice(splitIndex).join('<h2>');
  }

  const url = `https://mondopets.com/${locale}/blog/${slug}`;

  // Structured Data
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    image: [blog.coverImageUrl],
    datePublished: blog.publishedAt.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    wordCount: blog.content.split(/\s+/).length,
    author: [{
      '@type': 'Person',
      name: blog.author.name,
      url: blog.author.websiteUrl || undefined,
      sameAs: [
        blog.author.twitterUrl,
        blog.author.websiteUrl
      ].filter(Boolean)
    }],
    publisher: {
      '@type': 'Organization',
      name: 'Mondo Pets',
      logo: { '@type': 'ImageObject', url: 'https://mondopets.com/logo.png' }
    }
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://mondopets.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Pet Advice', item: `https://mondopets.com/${locale}/blog` },
      { '@type': 'ListItem', position: 3, name: blog.category.name, item: `https://mondopets.com/${locale}/blog?category=${blog.category.slug}` },
      { '@type': 'ListItem', position: 4, name: blog.title, item: url }
    ],
  };

  // Auto-detect FAQ schema: extract h3 questions and the following paragraph answer
  const faqMatches = [...blog.content.matchAll(/<h3[^>]*>([^<]+\?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi)];
  const faqLd = faqMatches.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqMatches.map(match => ({
      '@type': 'Question',
      name: match[1].replace(/<[^>]+>/g, '').trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: match[2].replace(/<[^>]+>/g, '').trim()
      }
    }))
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      
      <BlogReadingProgress />
      <BlogViewTracker slug={slug} />

      <main className="min-h-screen bg-background pb-6 lg:pb-10 mobile-page-bottom">
        
        <BlogPostHero 
          title={blog.title}
          category={blog.category}
          author={blog.author}
          date={blog.createdAt}
          readTimeMinutes={blog.readTimeMinutes}
          coverImageUrl={blog.coverImageUrl}
        />

        <div className="max-w-7xl mx-auto px-0 sm:px-8 pt-4 md:pt-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            
            {/* Left Sidebar - Sticky ToC & Social */}
            <aside className="hidden lg:flex flex-col gap-8 w-64 flex-shrink-0">
              <div className="sticky top-[100px] space-y-8">
                <BlogShareBar url={url} title={blog.title} />
                <BlogTableOfContents content={blog.content} />
              </div>
            </aside>

            {/* Mobile Share Bar (fixed to bottom) */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
              <BlogShareBar url={url} title={blog.title} />
            </div>

            {/* Main Content Area */}
            <article className="flex-1 min-w-0 pb-8 md:pb-16 px-4 sm:px-0">
              <AffiliateDisclosure />
              
              {/* Premium Prose Styling */}
              <div id="article-content" className="
                prose prose-lg dark:prose-invert max-w-3xl mx-auto
                prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-li:text-muted-foreground prose-li:mb-2
                prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 dark:prose-blockquote:bg-indigo-950/20 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-foreground prose-blockquote:my-8
                prose-img:rounded-2xl prose-img:shadow-md
                prose-strong:font-bold prose-strong:text-foreground
              ">
                {/* First half of content */}
                <div dangerouslySetInnerHTML={{ __html: firstHalf }} />

                {/* Mid-Article Affiliate Conversion Block */}
                {midArticleProduct && (
                  <BlogAffiliateCard product={midArticleProduct} />
                )}

                {/* Second half of content */}
                {secondHalf && (
                  <div dangerouslySetInnerHTML={{ __html: secondHalf }} />
                )}
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="max-w-3xl mx-auto mt-12 pt-6 border-t border-border flex flex-wrap gap-2">
                  <span className="text-sm font-bold text-foreground mr-2 py-1">Tags:</span>
                  {blog.tags.map(tag => (
                    <a key={tag} href={`/blog?tag=${tag}`} className="text-sm font-semibold bg-muted hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-muted-foreground hover:text-indigo-700 dark:hover:text-indigo-300 px-3 py-1 rounded-full transition-colors">
                      #{tag}
                    </a>
                  ))}
                </div>
              )}

              {/* Author Bio */}
              <div className="max-w-3xl mx-auto">
                <BlogAuthorCard author={blog.author} />
              </div>
            </article>

          </div>
        </div>

        {/* Related Posts */}
        <BlogRelatedPosts blogs={relatedBlogs} />

      </main>
    </>
  );
}
