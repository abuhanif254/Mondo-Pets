import { getTranslations } from 'next-intl/server';
import { ProductCard } from '@/components/ProductCard';
import { Link } from '@/i18n/routing';
import {
  getFeaturedToys, getProducts, getTrendingDeals, getNewArrivals,
  getTopRatedProducts, getGroomingEssentials, getSiteFeedback,
  getLatestBlogs, getCoupons, getHeroSlides, getListicles
} from '@/app/actions';
import { FadeIn } from '@/components/FadeIn';
import { FeedbackClient } from '@/components/FeedbackClient';
import { NewsletterClient } from '@/components/NewsletterClient';
import { PartnersMarquee } from '@/components/PartnersMarquee';
import { HeroCarouselClient } from '@/components/HeroCarouselClient';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  Bone, Carrot, Stethoscope, Scissors, ShieldCheck, RefreshCcw,
  Headphones, Star, Package, Sparkles, Flame, ArrowRight,
  BookOpen, CheckCircle, TrendingUp, Award, Zap, Heart,
  ChevronRight, PawPrint, Shield,
} from 'lucide-react';
import Image from 'next/image';



const PET_CATEGORIES = [
  { label: 'Dogs',     emoji: '🐕', href: '/toys/dog',   color: 'from-amber-400 to-orange-500',   bg: 'bg-amber-50 dark:bg-amber-950/30',  icon: Bone },
  { label: 'Cats',     emoji: '🐈', href: '/toys/cat',   color: 'from-violet-400 to-purple-600',  bg: 'bg-violet-50 dark:bg-violet-950/30', icon: Sparkles },
  { label: 'Birds',    emoji: '🦜', href: '/food/bird',  color: 'from-sky-400 to-blue-600',       bg: 'bg-sky-50 dark:bg-sky-950/30',      icon: Zap },
  { label: 'Fish',     emoji: '🐠', href: '/food/fish',  color: 'from-cyan-400 to-teal-600',     bg: 'bg-cyan-50 dark:bg-cyan-950/30',    icon: TrendingUp },
  { label: 'Rabbits',  emoji: '🐇', href: '/food/rabbit',color: 'from-pink-400 to-rose-500',     bg: 'bg-pink-50 dark:bg-pink-950/30',   icon: Heart },
  { label: 'Reptiles', emoji: '🦎', href: '/food/reptile',color:'from-emerald-400 to-green-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: Shield },
];

const TRUST_PILLARS = [
  {
    icon: Award,
    title: 'Expert-Reviewed',
    desc: 'Every product tested and reviewed by certified pet care professionals.',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    icon: ShieldCheck,
    title: 'Unbiased & Honest',
    desc: 'We only recommend products we genuinely believe in. Always disclosed.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
  },
  {
    icon: TrendingUp,
    title: 'Updated Daily',
    desc: 'Prices, deals, and recommendations refreshed every 24 hours.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  const session = await getSession();
  let userFirstName = '';

  if (session?.userId) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: { pets: true },
    });
    if (user) userFirstName = user.name.split(' ')[0];
  }

  const [toys, allFood, trendingDeals, newArrivals, topRated, groomingEssentials,
    initialFeedback, latestBlogs, allCoupons, heroSlides, listicles] = await Promise.all([
    getFeaturedToys(),
    getProducts('food'),
    getTrendingDeals(),
    getNewArrivals(),
    getTopRatedProducts(),
    getGroomingEssentials(),
    getSiteFeedback(),
    getLatestBlogs(),
    getCoupons(),
    getHeroSlides(),
    getListicles(),
  ]);

  const food = allFood.slice(0, 4);
  const topCoupons = allCoupons.slice(0, 2);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://mondopets.com/#website',
        url: 'https://mondopets.com/',
        name: 'Mondo Pets',
        description: 'Expert Pet Advice, Product Reviews & Care Guides',
        publisher: { '@id': 'https://mondopets.com/#organization' },
        potentialAction: [{
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://mondopets.com/search?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }]
      },
      {
        '@type': 'Organization',
        '@id': 'https://mondopets.com/#organization',
        name: 'Mondo Pets',
        url: 'https://mondopets.com/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://mondopets.com/logo.png',
          width: 512,
          height: 512
        },
        sameAs: [
          'https://twitter.com/mondopets',
          'https://facebook.com/mondopets',
          'https://instagram.com/mondopets'
        ]
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen mobile-page-bottom">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ═══════════════════════════════════════════════════════
          1. HERO CAROUSEL  (existing — kept intact)
          ═══════════════════════════════════════════════════════ */}
      <section className="w-full">
        <div className="max-w-[1440px] mx-auto px-0 sm:px-4 md:px-8 pt-3 sm:pt-6 pb-2">
          {/* Personalised greeting */}
          {userFirstName && (
            <div className="px-4 sm:px-0 mb-3">
              <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                <PawPrint className="w-4 h-4 text-primary" />
                Welcome back, <span className="text-foreground font-bold">{userFirstName}!</span> Here are today's top picks for you.
              </p>
            </div>
          )}
          <FadeIn>
            <HeroCarouselClient slides={heroSlides} />
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. SOCIAL PROOF / TRUST BAR
          ═══════════════════════════════════════════════════════ */}
      <FadeIn delay={0.05}>
        <section className="border-y border-border bg-muted/30">
          <div className="max-w-[1440px] mx-auto px-0 sm:px-4 md:px-8 py-2.5 md:py-4">
            <div className="flex items-center overflow-x-auto scrollbar-hide gap-6 justify-between md:flex-wrap md:justify-between px-4 sm:px-0">
              {[
                { icon: TrendingUp, value: '50,000+', label: 'Monthly Readers' },
                { icon: Star,       value: '500+',    label: 'Products Reviewed' },
                { icon: CheckCircle,value: '100%',    label: 'Independent Reviews' },
                { icon: Award,      value: '5 Years', label: 'of Pet Expertise' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-black text-foreground text-sm leading-tight">{value}</p>
                    <p className="text-[11px] text-muted-foreground">{label}</p>
                  </div>
                </div>
              ))}
              <Link
                href="/login"
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-sm flex-shrink-0"
              >
                {session ? 'My Account' : 'Join Free →'}
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════════════════════════════════════════════════
          3. SHOP BY PET TYPE — Visual Icon Grid
          ═══════════════════════════════════════════════════════ */}
      <FadeIn delay={0.1}>
        <section className="max-w-[1440px] mx-auto px-0 sm:px-4 md:px-8 app-section-dense">
          <div className="flex items-end justify-between mb-4 px-4 sm:px-0">
            <div>
              <span className="section-label">Browse by Pet</span>
              <h2 className="section-title mt-1">Shop by Pet Type</h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm font-bold text-primary hover:underline">
              All products <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4 px-4 sm:px-0">
            {PET_CATEGORIES.map(({ label, emoji, href, color, bg }) => (
              <Link
                key={label}
                href={href}
                className={`group flex flex-col items-center gap-2.5 p-4 rounded-2xl ${bg} border border-transparent hover:border-border hover:shadow-md transition-all duration-200`}
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl md:text-3xl shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-200`}>
                  {emoji}
                </div>
                <span className="text-xs md:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ═══════════════════════════════════════════════════════
          4. FEATURED DEAL SPOTLIGHT
          ═══════════════════════════════════════════════════════ */}
      {topCoupons.length > 0 && (
        <FadeIn delay={0.15}>
          <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-y border-border">
            <div className="max-w-[1440px] mx-auto px-0 sm:px-4 md:px-8 app-section-dense">
              <div className="flex items-end justify-between mb-4 px-4 sm:px-0">
                <div>
                  <span className="section-label">
                    <Flame className="w-3 h-3" /> Limited Time
                  </span>
                  <h2 className="section-title mt-1">Exclusive Partner Deals</h2>
                </div>
                <Link href="/deals" className="hidden sm:flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                  All deals <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {topCoupons.map((coupon) => (
                  <div key={coupon.id} className="relative bg-card rounded-2xl app-card-feed border border-border shadow-sm overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    {/* Gradient accent strip */}
                    <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
                    <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      <div className="flex-1">
                        <span className="inline-block bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold px-3 py-1 rounded-full text-xs mb-3">
                          {coupon.retailerName}
                        </span>
                        <p className="text-3xl font-black text-foreground mb-1">{coupon.discountValue}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{coupon.description}</p>
                      </div>
                      <div className="w-full sm:w-auto flex-shrink-0 space-y-3 px-6 pb-6 sm:p-0">
                        <div className="border-2 border-dashed border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 rounded-xl px-4 py-2 text-center">
                          <span className="font-mono font-black text-lg text-amber-700 dark:text-amber-400 tracking-widest select-all">
                            {coupon.code}
                          </span>
                        </div>
                        <a
                          href={coupon.affiliateUrl}
                          target="_blank"
                          rel="nofollow noopener sponsored"
                          className="btn btn-affiliate w-full justify-center text-sm"
                        >
                          Use Deal <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      {/* ═══════════════════════════════════════════════════════
          5. TRENDING DEALS
          ═══════════════════════════════════════════════════════ */}
      {trendingDeals.length > 0 && (
        <FadeIn delay={0.2}>
          <section className="max-w-[1440px] mx-auto px-0 sm:px-4 md:px-8 app-section-dense">
            <div className="flex items-end justify-between mb-4 px-4 sm:px-0">
              <div>
                <span className="section-label text-red-600 bg-red-50 dark:bg-red-950/30">
                  <Flame className="w-3 h-3" /> Hot Right Now
                </span>
                <h2 className="section-title mt-1">Trending Deals</h2>
              </div>
              <Link href="/deals" className="hidden sm:flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex overflow-x-auto pb-4 scroll-snap-x gap-4 md:grid md:grid-cols-4 md:gap-6 px-4 sm:px-0">
              {trendingDeals.map((product) => (
                <div key={product.id} className="snap-start flex-shrink-0 w-[240px] sm:w-[260px] md:w-auto">
                  <ProductCard
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    imageUrl={product.imageUrl || '/placeholder.jpg'}
                  />
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ═══════════════════════════════════════════════════════
          6. BEST DEALS / FEATURED TOYS
          ═══════════════════════════════════════════════════════ */}
      {toys.length > 0 && (
        <FadeIn delay={0.25}>
          <section className="bg-muted/30 border-y border-border">
            <div className="max-w-[1440px] mx-auto px-0 sm:px-4 md:px-8 app-section-dense">
              <div className="flex items-end justify-between mb-4 px-4 sm:px-0">
                <div>
                  <span className="section-label">
                    <Star className="w-3 h-3" /> Editor's Picks
                  </span>
                  <h2 className="section-title mt-1">Best Deals for You</h2>
                </div>
                <Link href="/deals" className="hidden sm:flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex overflow-x-auto pb-4 scroll-snap-x gap-4 md:grid md:grid-cols-4 md:gap-6 px-4 sm:px-0">
                {toys.map((product) => (
                  <div key={product.id} className="snap-start flex-shrink-0 w-[240px] sm:w-[260px] md:w-auto">
                    <ProductCard
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      imageUrl={product.imageUrl || '/placeholder.jpg'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      {/* ═══════════════════════════════════════════════════════
          7. EXPERT RECOMMENDATIONS (Listicles)
          ═══════════════════════════════════════════════════════ */}
      {listicles.length > 0 && (
        <FadeIn delay={0.3}>
          <section className="max-w-[1440px] mx-auto px-0 sm:px-4 md:px-8 app-section-dense">
            <div className="flex items-end justify-between mb-4 px-4 sm:px-0">
              <div>
                <span className="section-label">
                  <Award className="w-3 h-3" /> Expert Picks
                </span>
                <h2 className="section-title mt-1">Expert Recommendations</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {listicles.slice(0, 3).map((listicle, idx) => (
                <Link
                  key={listicle.id}
                  href={`/${locale}/best/${listicle.slug}`}
                  className="group relative bg-card rounded-2xl app-card-feed border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Rank accent */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center">
                    #{idx + 1}
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 pr-8">
                        {listicle.title}
                      </h3>
                      {listicle.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {listicle.description}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-primary font-bold text-sm group-hover:gap-2 transition-all mt-auto">
                      Read the full list <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ═══════════════════════════════════════════════════════
          8. RECOMMENDED FOOD
          ═══════════════════════════════════════════════════════ */}
      {food.length > 0 && (
        <FadeIn delay={0.33}>
          <section className="max-w-[1440px] mx-auto px-0 sm:px-4 md:px-8 app-section-dense">
            <div className="flex items-end justify-between mb-4 px-4 sm:px-0">
              <div>
                <span className="section-label">
                  <Carrot className="w-3 h-3" /> Nutrition
                </span>
                <h2 className="section-title mt-1">Recommended Food</h2>
              </div>
              <Link href="/food" className="hidden sm:flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex overflow-x-auto pb-4 scroll-snap-x gap-4 md:grid md:grid-cols-4 md:gap-6 px-4 sm:px-0">
              {food.map((product) => (
                <div key={product.id} className="snap-start flex-shrink-0 w-[240px] sm:w-[260px] md:w-auto">
                  <ProductCard
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    imageUrl={product.imageUrl || '/placeholder.jpg'}
                  />
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ═══════════════════════════════════════════════════════
          9. NEW ARRIVALS
          ═══════════════════════════════════════════════════════ */}
      {newArrivals.length > 0 && (
        <FadeIn delay={0.36}>
          <section className="bg-muted/30 border-y border-border">
            <div className="max-w-[1440px] mx-auto px-0 sm:px-4 md:px-8 app-section-dense">
              <div className="flex items-end justify-between mb-4 px-4 sm:px-0">
                <div>
                  <span className="section-label">
                    <Sparkles className="w-3 h-3" /> Just In
                  </span>
                  <h2 className="section-title mt-1">New Arrivals</h2>
                </div>
                <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex overflow-x-auto pb-4 scroll-snap-x gap-4 md:grid md:grid-cols-4 md:gap-6 px-4 sm:px-0">
                {newArrivals.map((product) => (
                  <div key={product.id} className="snap-start flex-shrink-0 w-[240px] sm:w-[260px] md:w-auto">
                    <ProductCard
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      imageUrl={product.imageUrl || '/placeholder.jpg'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      {/* ═══════════════════════════════════════════════════════
          10. TOP RATED
          ═══════════════════════════════════════════════════════ */}
      {topRated.length > 0 && (
        <FadeIn delay={0.39}>
          <section className="max-w-[1440px] mx-auto px-0 sm:px-4 md:px-8 app-section-dense">
            <div className="flex items-end justify-between mb-4 px-4 sm:px-0">
              <div>
                <span className="section-label">
                  <Star className="w-3 h-3" /> Community Loved
                </span>
                <h2 className="section-title mt-1">Top Rated Favorites</h2>
              </div>
              <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex overflow-x-auto pb-4 scroll-snap-x gap-4 md:grid md:grid-cols-4 md:gap-6 px-4 sm:px-0">
              {topRated.map((product) => (
                <div key={product.id} className="snap-start flex-shrink-0 w-[240px] sm:w-[260px] md:w-auto">
                  <ProductCard
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    imageUrl={product.imageUrl || '/placeholder.jpg'}
                  />
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ═══════════════════════════════════════════════════════
          11. GROOMING ESSENTIALS
          ═══════════════════════════════════════════════════════ */}
      {groomingEssentials.length > 0 && (
        <FadeIn delay={0.42}>
          <section className="bg-muted/30 border-y border-border">
            <div className="max-w-[1440px] mx-auto px-0 sm:px-4 md:px-8 app-section-dense">
              <div className="flex items-end justify-between mb-4 px-4 sm:px-0">
                <div>
                  <span className="section-label">
                    <Scissors className="w-3 h-3" /> Grooming
                  </span>
                  <h2 className="section-title mt-1">Essential Grooming</h2>
                </div>
                <Link href="/grooming" className="hidden sm:flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex overflow-x-auto pb-4 scroll-snap-x gap-4 md:grid md:grid-cols-4 md:gap-6 px-4 sm:px-0">
                {groomingEssentials.map((product) => (
                  <div key={product.id} className="snap-start flex-shrink-0 w-[240px] sm:w-[260px] md:w-auto">
                    <ProductCard
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      imageUrl={product.imageUrl || '/placeholder.jpg'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      {/* ═══════════════════════════════════════════════════════
          12. LATEST PET ADVICE BLOG
          ═══════════════════════════════════════════════════════ */}
      {latestBlogs.length > 0 && (
        <FadeIn delay={0.45}>
          <section className="max-w-[1440px] mx-auto px-0 sm:px-4 md:px-8 app-section-dense">
            <div className="flex items-end justify-between mb-4 px-4 sm:px-0">
              <div>
                <span className="section-label">
                  <BookOpen className="w-3 h-3" /> From the Experts
                </span>
                <h2 className="section-title mt-1">Latest Pet Advice</h2>
                <p className="section-subtitle mt-2">
                  Vet-reviewed guides, product breakdowns, and care tips.
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold hover:bg-primary/20 transition-colors"
              >
                All Articles <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mobile-grid-2 px-4 sm:px-0">
              {latestBlogs.map((blog, idx) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group bg-card border border-border rounded-2xl app-card-feed overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Featured badge on first */}
                  {idx === 0 && (
                    <div className="h-1 w-full bg-gradient-to-r from-primary to-violet-500" />
                  )}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge badge-primary">
                        Pet Advice
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2 flex-grow">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-5">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        {blog.author.avatarUrl ? (
                          <img
                            src={blog.author.avatarUrl}
                            alt={blog.author.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {blog.author.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-xs font-semibold text-foreground">{blog.author.name}</span>
                      </div>
                      <span className="text-xs font-bold text-primary group-hover:gap-2 flex items-center gap-1 transition-all">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 sm:hidden text-center px-4">
              <Link href="/blog" className="btn btn-outline btn-sm w-full">
                View All Articles
              </Link>
            </div>
          </section>
        </FadeIn>
      )}

      {/* ═══════════════════════════════════════════════════════
          13. WHY TRUST US — 3 Credibility Pillars
          ═══════════════════════════════════════════════════════ */}
      <FadeIn delay={0.48}>
        <section className="border-y border-border bg-card">
          <div className="max-w-[1440px] mx-auto px-0 sm:px-4 md:px-8 app-section-dense">
            <div className="text-center mb-6 px-4 sm:px-0">
              <span className="section-label mx-auto">Our Promise</span>
              <h2 className="section-title mt-2">Why 50,000 Pet Owners Trust Us</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TRUST_PILLARS.map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="flex flex-col items-center text-center p-6 rounded-2xl app-card-feed border border-border hover:shadow-md transition-shadow">
                  <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed px-4">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════════════════════════════════════════════════
          14. COMMUNITY FEEDBACK
          ═══════════════════════════════════════════════════════ */}
      <FadeIn delay={0.5}>
        <section className="max-w-[1440px] mx-auto px-0 sm:px-4 md:px-8 app-section-dense">
          <div className="mb-4 px-4 sm:px-0">
            <span className="section-label">Real Readers</span>
            <h2 className="section-title mt-1">Community Feedback</h2>
            <p className="section-subtitle mt-2">See what pet lovers are saying — and share your own experience.</p>
          </div>
          <div className="px-4 sm:px-0">
            <FeedbackClient initialFeedback={initialFeedback} />
          </div>
        </section>
      </FadeIn>

      {/* ═══════════════════════════════════════════════════════
          15. AFFILIATE PARTNERS MARQUEE
          ═══════════════════════════════════════════════════════ */}
      <FadeIn delay={0.52}>
        <section className="border-y border-border bg-muted/20">
          <div className="py-8">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Trusted Partner Retailers
            </p>
            <PartnersMarquee />
          </div>
        </section>
      </FadeIn>

      {/* ═══════════════════════════════════════════════════════
          16. NEWSLETTER — Full-width CTA
          ═══════════════════════════════════════════════════════ */}
      <FadeIn delay={0.54}>
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 lg:py-16">
          <NewsletterClient />
        </section>
      </FadeIn>

      {/* ═══════════════════════════════════════════════════════
          17. TRUST BADGES — Bottom bar
          ═══════════════════════════════════════════════════════ */}
      <FadeIn delay={0.56}>
        <section className="border-t border-border">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 md:py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: ShieldCheck, label: 'Secure & Safe',   sub: 'FTC-compliant affiliate links', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
                { icon: RefreshCcw,  label: 'Always Updated',  sub: 'Prices refreshed daily',         color: 'text-emerald-500',bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
                { icon: Headphones,  label: '24/7 Support',    sub: 'Contact us anytime',             color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/30' },
                { icon: Star,        label: '4.9★ Rated',      sub: 'By 10,000+ readers',             color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-950/30' },
              ].map(({ icon: Icon, label, sub, color, bg }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground leading-tight mb-0.5">{label}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Bottom spacing for mobile bottom nav */}
      <div className="h-20 lg:h-0" />
    </div>
  );
}
