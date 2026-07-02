import { getTranslations } from 'next-intl/server';
import { ProductCard } from '@/components/ProductCard';
import { Link } from '@/i18n/routing';
import { getFeaturedToys, getProducts, getTrendingDeals, getNewArrivals, getTopRatedProducts, getGroomingEssentials, getSiteFeedback, getLatestBlogs, getCoupons, getHeroSlides, getListicles } from '@/app/actions';
import { FadeIn } from '@/components/FadeIn';
import { FeedbackClient } from '@/components/FeedbackClient';
import { NewsletterClient } from '@/components/NewsletterClient';
import { PartnersMarquee } from '@/components/PartnersMarquee';
import { HeroCarouselClient } from '@/components/HeroCarouselClient';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Bone, Carrot, Stethoscope, Scissors, ShoppingBag, Plus, ShieldCheck, RefreshCcw, Headphones, Star, Package, Sparkles, Flame, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export const revalidate = 3600; // Revalidate every hour for max performance

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  
  // Personalization Logic
  const session = await getSession();
  let userPetTypes: string[] = [];
  let userFirstName = '';
  
  if (session && session.userId) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: { pets: true }
    });
    if (user) {
      userFirstName = user.name.split(' ')[0];
      userPetTypes = user.pets.map(p => p.type.toLowerCase());
    }
  }

  // If user has a dog, prioritize dog items. (Simple personalization)
  const isDogOwner = userPetTypes.includes('dog');
  const isCatOwner = userPetTypes.includes('cat');

  // We don't have getFeaturedToys filtering by animal yet, but let's pass a hint if we update actions later.
  // For now, we'll just show the user's name if logged in.
  const toys = await getFeaturedToys();
  const allFood = await getProducts('food');
  const food = allFood.slice(0, 4);
  const trendingDeals = await getTrendingDeals();
  const newArrivals = await getNewArrivals();
  const topRated = await getTopRatedProducts();
  const groomingEssentials = await getGroomingEssentials();
  const initialFeedback = await getSiteFeedback();
  const latestBlogs = await getLatestBlogs();
  const allCoupons = await getCoupons();
  const topCoupons = allCoupons.slice(0, 2);
  const heroSlides = await getHeroSlides();
  const listicles = await getListicles();

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-8 py-6 max-w-[1440px] mx-auto space-y-12 w-full">
      
      {/* Hero Group with reduced spacing */}
      <div className="flex flex-col gap-4 w-full">
        {/* Top Promo Bar (Chewy Style) */}
        <div className="bg-[#e6f4ca] text-[#2c5305] text-center py-2.5 px-4 font-bold text-sm rounded-lg shadow-sm">
          Free $20 eGift card with your first $49+ order
        </div>

        {/* Hero Carousel Section */}
        <FadeIn>
          <HeroCarouselClient slides={heroSlides} />
        </FadeIn>

      {/* Quick Actions Bar (Chewy Style) */}
      <FadeIn delay={0.1}>
        <div className="bg-[#f0f0f0] rounded-xl p-3 md:p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-xl md:text-2xl font-black">
              {userFirstName ? `Hey, ${userFirstName}!` : 'Hey, friend!'}
            </span>
            {!session && (
              <Link href="/login" className="bg-[#1d4ed8] hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Sign in
              </Link>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link href="/deals" className="bg-white rounded-2xl p-3 flex items-center gap-4 flex-1 hover:shadow-md transition-shadow">
              <div className="text-[#1d4ed8]">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-black leading-tight text-slate-900">Save 35% on first order</p>
                <p className="text-xs text-[#1d4ed8]">Set up an Autoship</p>
              </div>
            </Link>
            <Link href="/health" className="bg-white rounded-2xl p-3 flex items-center gap-4 flex-1 hover:shadow-md transition-shadow">
              <div className="text-[#1d4ed8]">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-black leading-tight text-slate-900">Save 50% on first Pharmacy order</p>
                <p className="text-xs text-[#1d4ed8]">Set up a prescription Autoship</p>
              </div>
            </Link>
          </div>
        </div>
      </FadeIn>
      </div>

      {/* Top Listicles Section */}
      {listicles.length > 0 && (
        <FadeIn delay={0.2}>
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-3xl font-black text-foreground flex items-center gap-2">
                <Star className="text-primary w-8 h-8 fill-primary" /> Expert Recommendations
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listicles.slice(0, 3).map((listicle) => (
                <Link key={listicle.id} href={`/${locale}/best/${listicle.slug}`} className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                  <div className="p-6 flex-grow flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                      {listicle.title}
                    </h3>
                    {listicle.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {listicle.description}
                      </p>
                    )}
                    <span className="text-primary font-bold text-sm flex items-center gap-1 mt-auto group-hover:translate-x-1 transition-transform">
                      Read the full list <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* Promo Cards */}
      <FadeIn delay={0.2}>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-[#fdf2e9] p-6 relative overflow-hidden group cursor-pointer shadow-sm">
            <h4 className="font-extrabold text-orange-900 text-xl">Flash Sale</h4>
            <p className="text-xs font-semibold text-orange-700/80 mt-1 mb-4">Limited time deals</p>
            <p className="text-sm font-bold text-orange-500 mb-6">Up to 70% Off</p>
            <div className="flex gap-2">
              <span className="bg-white text-orange-600 font-bold text-xs px-2 py-1 rounded">02</span>:
              <span className="bg-white text-orange-600 font-bold text-xs px-2 py-1 rounded">45</span>:
              <span className="bg-white text-orange-600 font-bold text-xs px-2 py-1 rounded">18</span>
            </div>
          </div>
          
          <div className="rounded-3xl bg-[#eff9f0] p-6 relative overflow-hidden group cursor-pointer shadow-sm">
            <h4 className="font-extrabold text-green-900 text-xl">Free Shipping</h4>
            <p className="text-xs font-semibold text-green-700/80 mt-1 mb-6">On orders over $50</p>
            <Link href="/shipping" className="text-xs font-bold text-green-800 flex items-center gap-1 group-hover:underline">Shop now &rarr;</Link>
            <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-50">
               <Package className="w-full h-full text-green-600" />
            </div>
          </div>

          <div className="rounded-3xl bg-[#f0f4ff] p-6 relative overflow-hidden group cursor-pointer shadow-sm">
            <h4 className="font-extrabold text-blue-900 text-xl">New Arrivals</h4>
            <p className="text-xs font-semibold text-blue-700/80 mt-1 mb-6">Check out the latest trends</p>
            <Link href="/new" className="text-xs font-bold text-blue-800 flex items-center gap-1 group-hover:underline">Shop now &rarr;</Link>
            <div className="absolute right-0 bottom-0 w-24 h-24 opacity-30">
               <Sparkles className="w-full h-full text-blue-600" />
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Trending Deals Section */}
      {trendingDeals.length > 0 && (
        <FadeIn delay={0.25}>
          <section className="bg-emerald-50/50 dark:bg-emerald-950/20 -mx-6 lg:-mx-10 px-6 lg:px-10 py-12 border-y border-emerald-100 dark:border-emerald-900/50">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 mb-8">
                <Flame className="w-6 h-6 text-orange-500" />
                <h3 className="text-2xl font-bold tracking-tight">Trending Deals</h3>
                <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded ml-2 uppercase tracking-wider">Hot</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {trendingDeals.map((product) => (
                  <ProductCard 
                    key={product.id}
                    id={product.id}
                    title={product.title} 
                    price={product.price} 
                    imageUrl={product.imageUrl || '/placeholder.jpg'} 
                  />
                ))}
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      {/* Best Deals For You */}
      <FadeIn delay={0.3}>
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold tracking-tight">Best Deals for You</h3>
            <Link href="/deals" className="text-xs font-bold bg-muted px-3 py-1.5 rounded-full hover:bg-muted/80 transition-colors">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {toys.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                title={product.title} 
                price={product.price} 
                imageUrl={product.imageUrl || '/placeholder.jpg'} 
              />
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Recommended For You */}
      <FadeIn delay={0.4}>
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold tracking-tight">Recommended for You</h3>
            <Link href="/food" className="text-xs font-bold bg-muted px-3 py-1.5 rounded-full hover:bg-muted/80 transition-colors">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {food.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                title={product.title} 
                price={product.price} 
                imageUrl={product.imageUrl || '/placeholder.jpg'} 
              />
            ))}
          </div>
        </section>
      </FadeIn>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <FadeIn delay={0.45}>
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold tracking-tight">New Arrivals</h3>
              <Link href="/new" className="text-xs font-bold bg-muted px-3 py-1.5 rounded-full hover:bg-muted/80 transition-colors">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  title={product.title} 
                  price={product.price} 
                  imageUrl={product.imageUrl || '/placeholder.jpg'} 
                />
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* Top Rated Products */}
      {topRated.length > 0 && (
        <FadeIn delay={0.5}>
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold tracking-tight">Top Rated Favorites</h3>
              <Link href="/categories" className="text-xs font-bold bg-muted px-3 py-1.5 rounded-full hover:bg-muted/80 transition-colors">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {topRated.map((product) => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  title={product.title} 
                  price={product.price} 
                  imageUrl={product.imageUrl || '/placeholder.jpg'} 
                />
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* Essential Grooming */}
      {groomingEssentials.length > 0 && (
        <FadeIn delay={0.55}>
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Scissors className="w-5 h-5 text-pink-500" />
                Essential Grooming
              </h3>
              <Link href="/grooming" className="text-xs font-bold bg-muted px-3 py-1.5 rounded-full hover:bg-muted/80 transition-colors">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {groomingEssentials.map((product) => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  title={product.title} 
                  price={product.price} 
                  imageUrl={product.imageUrl || '/placeholder.jpg'} 
                />
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* Global Feedback Section */}
      <FadeIn delay={0.6}>
        <section className="pt-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold tracking-tight">Community Feedback</h3>
            <p className="text-muted-foreground mt-2">See what other pet lovers are saying, and share your own experience!</p>
          </div>
          <FeedbackClient initialFeedback={initialFeedback} />
        </section>
      </FadeIn>

      {/* Latest Blogs / Pet Care Guides */}
      {latestBlogs.length > 0 && (
        <FadeIn delay={0.65}>
          <section className="pt-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Pet Care Guides</h3>
                <p className="text-muted-foreground mt-2">Expert advice and tips for your furry friends.</p>
              </div>
              <Link href="/blog" className="text-sm font-bold bg-muted px-4 py-2 rounded-full hover:bg-muted/80 transition-colors hidden sm:block">View All Articles</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestBlogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} className="group block">
                  <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                    <div className="p-6 flex-grow">
                      <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-blue-600">
                        <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">{blog.title}</h4>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6">{blog.excerpt}</p>
                    </div>
                    <div className="p-6 pt-0 border-t border-border/10 mt-auto flex items-center gap-3">
                      {blog.author.avatarUrl ? (
                        <img src={blog.author.avatarUrl} alt={blog.author.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                          {blog.author.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-foreground leading-none">{blog.author.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{blog.author.credentials}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* Exclusive Partner Deals (Coupons) */}
      {topCoupons.length > 0 && (
        <FadeIn delay={0.68}>
          <section className="pt-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  Exclusive Partner Deals
                </h3>
                <p className="text-muted-foreground mt-2">Special discount codes from our top brands.</p>
              </div>
              <Link href="/deals" className="text-sm font-bold bg-muted px-4 py-2 rounded-full hover:bg-muted/80 transition-colors hidden sm:block">View All Deals</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topCoupons.map((coupon) => (
                <div key={coupon.id} className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-1 overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                  <div className="bg-card rounded-[22px] p-6 h-full flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex-1 text-center sm:text-left">
                      <div className="inline-block bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full text-xs mb-3">
                        {coupon.retailerName}
                      </div>
                      <h4 className="text-2xl font-black mb-2">{coupon.discountValue}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{coupon.description}</p>
                    </div>
                    <div className="w-full sm:w-auto">
                      <div className="border-2 border-dashed border-orange-200 bg-orange-50 rounded-xl p-3 text-center mb-3">
                        <span className="font-mono font-bold text-lg text-orange-600 tracking-wider select-all">{coupon.code}</span>
                      </div>
                      <a href={coupon.affiliateUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-foreground text-background font-bold py-2 px-4 rounded-lg hover:bg-foreground/90 transition-colors">
                        Use Deal
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* Affiliate Partners Marquee */}
      <FadeIn delay={0.685}>
        <section className="pt-8">
          <PartnersMarquee />
        </section>
      </FadeIn>

      {/* Newsletter Section */}
      <FadeIn delay={0.69}>
        <section className="pt-8 pb-4">
          <NewsletterClient />
        </section>
      </FadeIn>

      {/* Trust Badges */}
      <FadeIn delay={0.7}>
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 mt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-50 text-blue-600"><ShieldCheck className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-bold">Secure Payment</p>
              <p className="text-[10px] text-muted-foreground">100% secure payment</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-emerald-50 text-emerald-600"><RefreshCcw className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-bold">Easy Returns</p>
              <p className="text-[10px] text-muted-foreground">30-day return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-50 text-purple-600"><Headphones className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-bold">24/7 Support</p>
              <p className="text-[10px] text-muted-foreground">Dedicated support</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-50 text-amber-600"><Star className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-bold">Trusted Store</p>
              <p className="text-[10px] text-muted-foreground">4.9 average rating</p>
            </div>
          </div>
        </section>
      </FadeIn>

    </div>
  );
}
