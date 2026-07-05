import { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { BlogCard } from '@/components/BlogCard';
import { BlogCategoryFilter } from '@/components/BlogCategoryFilter';
import { BlogSidebar } from '@/components/BlogSidebar';
import { getBlogs } from '@/app/actions';
import { Link } from '@/i18n/routing';
import { BookOpen, Search, Clock, Rss } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogPage' });
  
  const title = `${t('title')} | Mondo Pets`;
  const description = t('subtitle');

  return {
    title,
    description,
    keywords: [
      'pet advice', 'dog health tips', 'cat care guide', 'pet nutrition',
      'veterinary advice', 'pet training', 'pet grooming tips', 'animal health'
    ],
    openGraph: {
      title,
      description,
      url: `https://mondopets.com/${locale}/blog`,
      siteName: 'Mondo Pets',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&h=630&q=80',
          width: 1200,
          height: 630,
          alt: 'Pet Advice by Mondo Pets',
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&h=630&q=80'],
    },
    alternates: {
      canonical: `https://mondopets.com/${locale}/blog`,
      languages: {
        'en': 'https://mondopets.com/en/blog',
        'bn': 'https://mondopets.com/bn/blog',
        'hi': 'https://mondopets.com/hi/blog',
        'de': 'https://mondopets.com/de/blog',
        'es': 'https://mondopets.com/es/blog',
      },
    },
  };
}

// Topic stat pills for the hero
const TOPIC_STATS = [
  { icon: '🐕', label: 'Dog Care', count: '120+ guides' },
  { icon: '🐈', label: 'Cat Health', count: '90+ articles' },
  { icon: '🥗', label: 'Nutrition', count: '80+ reviews' },
  { icon: '🏥', label: 'Vet Advice', count: '60+ tips' },
];

export default async function BlogPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'BlogPage' });
  
  // Fetch blogs based on selected category (or all)
  const allBlogsCount = (await getBlogs()).length; // Unfiltered count for the tabs
  const filteredBlogs = await getBlogs(category);

  // The DB query now sorts by isFeatured DESC, then date DESC.
  // We'll take the first one as featured if we're not filtering by a specific category,
  // or if the first one is actually flagged as featured.
  const featuredBlog = (!category || category === 'all') && filteredBlogs.length > 0 
    ? (filteredBlogs.find(b => b.isFeatured) || filteredBlogs[0])
    : null;

  const restBlogs = featuredBlog 
    ? filteredBlogs.filter(b => b.id !== featuredBlog.id)
    : filteredBlogs;

  // JSON-LD for the listing page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${t('title')} | Mondo Pets`,
    description: t('subtitle'),
    url: `https://mondopets.com/${locale}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Mondo Pets',
      logo: {
        '@type': 'ImageObject',
        url: 'https://mondopets.com/logo.png',
      },
    },
    blogPost: filteredBlogs.slice(0, 5).map(b => ({
      '@type': 'BlogPosting',
      headline: b.title,
      description: b.excerpt,
      url: `https://mondopets.com/${locale}/blog/${b.slug}`,
      datePublished: b.createdAt,
      author: { '@type': 'Person', name: b.author.name },
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('breadcrumbHome'), item: `https://mondopets.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: t('breadcrumbBlog'), item: `https://mondopets.com/${locale}/blog` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="flex flex-col min-h-screen mobile-page-bottom">
        {/* ═══════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════ */}
        <header className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 text-white">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120,119,198,0.5) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(255,180,100,0.3) 0%, transparent 40%),
                              url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-6 lg:pt-14 lg:pb-12">
            
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-indigo-300 text-sm mb-4 lg:mb-8 font-medium">
              <Link href="/" className="hover:text-white transition-colors">{t('breadcrumbHome')}</Link>
              <span className="text-indigo-500">/</span>
              <span className="text-white font-semibold">{t('breadcrumbBlog')}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-bold text-indigo-200 uppercase tracking-widest backdrop-blur-sm">
                    <BookOpen className="w-3.5 h-3.5" /> {t('heroEyebrow')}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
                  {t('title')}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mt-1">
                    by Mondo Pets
                  </span>
                </h1>

                <p className="text-indigo-200 text-lg leading-relaxed max-w-lg">
                  {t('subtitle')}
                </p>

                <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 backdrop-blur-sm max-w-md hover:bg-white/15 transition-colors group">
                  <Search className="w-4 h-4 text-indigo-300 group-hover:text-white transition-colors flex-shrink-0" />
                  <input
                    type="search"
                    id="blog-search"
                    placeholder={t('searchPlaceholder')}
                    className="bg-transparent border-none outline-none text-white placeholder:text-indigo-400 text-sm flex-1 w-full"
                    aria-label={t('searchPlaceholder')}
                  />
                </div>

                <a
                  href="/feed.xml"
                  className="inline-flex items-center gap-1.5 text-indigo-300 hover:text-amber-300 transition-colors text-xs font-semibold"
                >
                  <Rss className="w-3.5 h-3.5" /> Subscribe via RSS
                </a>
              </div>

              <div className="hidden lg:grid grid-cols-2 gap-3">
                {TOPIC_STATS.map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/15 transition-all hover:scale-105 cursor-default"
                  >
                    <span className="text-3xl">{s.icon}</span>
                    <p className="mt-3 font-black text-white text-lg leading-tight">{s.label}</p>
                    <p className="text-indigo-300 text-sm font-semibold mt-0.5">{s.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 40" className="w-full fill-background" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" />
            </svg>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════
            CATEGORY FILTER TABS
        ═══════════════════════════════════════════════ */}
        <div className="sticky top-[56px] lg:top-[64px] z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-0 md:px-8">
            <BlogCategoryFilter totalCount={allBlogsCount} />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            MAIN CONTENT AREA
        ═══════════════════════════════════════════════ */}
        <main className="flex-1 app-section-dense px-0 sm:px-4 md:px-8 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
              {/* Left Column (Posts) */}
              <div className="flex-1 min-w-0 space-y-6 lg:space-y-12">
                
                {/* ── FEATURED POST ─────────────────────────── */}
                {featuredBlog && (
                  <section aria-labelledby="featured-post-heading">
                    <div className="flex items-center gap-2 mb-4 px-4 sm:px-0">
                      <span className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        ⭐ {t('featuredLabel')}
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <Link
                      href={`/blog/${featuredBlog.slug}`}
                      className="group grid md:grid-cols-5 gap-0 bg-card border border-border rounded-3xl app-card-feed overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
                      id="featured-post-heading"
                    >
                      <div className="md:col-span-3 relative h-64 md:h-auto min-h-[300px] bg-muted overflow-hidden">
                        <img
                          src={featuredBlog.coverImageUrl || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&h=500&q=80'}
                          alt={featuredBlog.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        
                        {/* Category badge */}
                        <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                          {(featuredBlog as any).category?.name || 'Care'}
                        </span>
                      </div>

                      <div className="md:col-span-2 p-4 sm:p-6 md:p-8 flex flex-col justify-between font-medium">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                            <time dateTime={featuredBlog.createdAt.toISOString()}>
                              {new Date(featuredBlog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </time>
                            {featuredBlog.readTimeMinutes && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featuredBlog.readTimeMinutes} {t('readTime')}</span>
                              </>
                            )}
                          </div>

                          <h2 className="text-2xl md:text-3xl font-black leading-tight text-foreground group-hover:text-indigo-600 transition-colors">
                            {featuredBlog.title}
                          </h2>

                          <p className="text-muted-foreground leading-relaxed line-clamp-3">
                            {featuredBlog.excerpt}
                          </p>

                          {/* Tags */}
                          {featuredBlog.tags && featuredBlog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {featuredBlog.tags.slice(0, 3).map((tag: string) => (
                                <span key={tag} className="text-[10px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-700 overflow-hidden flex items-center justify-center text-sm font-extrabold text-indigo-700 relative">
                              {(featuredBlog as any).author.avatarUrl ? (
                                <Image src={(featuredBlog as any).author.avatarUrl} alt={(featuredBlog as any).author.name} fill sizes="40px" className="object-cover" />
                              ) : (
                                (featuredBlog as any).author.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-foreground">{(featuredBlog as any).author.name}</p>
                              <p className="text-[10px] text-muted-foreground">{(featuredBlog as any).author.credentials}</p>
                            </div>
                          </div>

                          <span className="hidden sm:inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm font-bold group-hover:gap-2 transition-all">
                            {t('readMore')} →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </section>
                )}

                {/* ── MASONRY-STYLE GRID ─────────────────────── */}
                {restBlogs.length > 0 && (
                  <section aria-labelledby="all-articles-heading">
                    <div className="flex items-center gap-2 mb-4 px-4 sm:px-0">
                      <h2 id="all-articles-heading" className="text-lg font-black text-foreground">
                        {category && category !== 'all' ? `${category.charAt(0).toUpperCase() + category.slice(1)} Articles` : t('latestArticles')}
                      </h2>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* CSS Column layout for masonry effect */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mobile-grid-2 px-4 sm:px-0">
                      {restBlogs.map((blog: any) => (
                        <BlogCard
                          key={blog.id}
                          title={blog.title}
                          excerpt={blog.excerpt}
                          authorName={blog.author.name}
                          authorCredential={blog.author.credentials || ''}
                          date={blog.createdAt.toISOString().split('T')[0]}
                          slug={blog.slug}
                          coverImageUrl={blog.coverImageUrl}
                          readTimeMinutes={blog.readTimeMinutes}
                          tags={blog.tags}
                          categoryName={blog.category?.name}
                          categorySlug={blog.category?.slug}
                        />
                      ))}
                    </div>

                    {restBlogs.length >= 5 && (
                      <div className="mt-10 flex justify-center">
                        <button
                          className="inline-flex items-center gap-2 px-8 py-3 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-400 transition-all"
                        >
                          {t('loadMore')}
                        </button>
                      </div>
                    )}
                  </section>
                )}

                {filteredBlogs.length === 0 && (
                  <div className="py-20 text-center space-y-4">
                    <div className="text-6xl">🐾</div>
                    <p className="text-muted-foreground font-semibold text-lg">{t('noResults')}</p>
                    {category && (
                      <Link href="/blog" className="text-indigo-600 font-bold hover:underline">
                        View all articles
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column (Sidebar) */}
              <div className="hidden lg:block w-80 flex-shrink-0">
                <div className="sticky top-[140px]">
                  <BlogSidebar />
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
