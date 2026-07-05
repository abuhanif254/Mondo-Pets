import { getPopularBlogs, getSidebarAffiliateProducts } from '@/app/actions';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { NewsletterForm } from '@/components/NewsletterForm';
import { TrendingUp, Clock, ChevronRight, Award, ShieldCheck, Rss, PawPrint } from 'lucide-react';

// Curated cover fallbacks per pet category
const COVER_FALLBACKS: Record<string, string> = {
  dog:     'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&h=140&q=75',
  cat:     'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=200&h=140&q=75',
  default: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=200&h=140&q=75',
};

export async function BlogSidebar() {
  const [popularPosts, affiliatePicks] = await Promise.all([
    getPopularBlogs(5),
    getSidebarAffiliateProducts(3).catch(() => []),
  ]);

  return (
    <aside className="space-y-5" aria-label="Blog sidebar">

      {/* ── Popular This Week ─────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-border bg-muted/30 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
          <h3 className="font-black text-xs uppercase tracking-widest text-foreground">Popular This Week</h3>
        </div>

        <div className="divide-y divide-border">
          {popularPosts.length > 0 ? popularPosts.map((post, index) => {
            const catKey = (post.category?.slug || '').toLowerCase();
            const img = post.coverImageUrl || COVER_FALLBACKS[catKey] || COVER_FALLBACKS.default;

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex items-start gap-3 p-4 hover:bg-muted/40 transition-colors group"
              >
                {/* Rank */}
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black mt-0.5 ${
                  index === 0 ? 'bg-amber-500 text-white' :
                  index === 1 ? 'bg-zinc-400 text-white' :
                  index === 2 ? 'bg-orange-700 text-white' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </span>
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </p>
                  {post.readTimeMinutes && (
                    <p className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground font-medium">
                      <Clock className="w-2.5 h-2.5" /> {post.readTimeMinutes} min read
                    </p>
                  )}
                </div>
              </Link>
            );
          }) : (
            <p className="p-5 text-sm text-muted-foreground text-center">No articles yet.</p>
          )}
        </div>
      </div>

      {/* ── Newsletter Signup ────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-violet-600 rounded-2xl p-5 text-white shadow-lg shadow-primary/20 dark:shadow-primary/10">
        {/* Decorative blobs */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl" aria-hidden="true" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10 blur-xl" aria-hidden="true" />

        <div className="relative space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-base leading-tight">Get Weekly Pet Tips</h3>
            <p className="text-white/75 text-xs mt-1 leading-relaxed">
              Expert advice, product picks & health alerts — free, every week.
            </p>
          </div>
          <NewsletterForm variant="sidebar" />
          <a
            href="/feed.xml"
            className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-[11px] font-semibold"
          >
            <Rss className="w-3 h-3" /> Subscribe via RSS
          </a>
        </div>
      </div>

      {/* ── Editor's Affiliate Picks ──────────────────── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-border bg-amber-50/50 dark:bg-amber-950/20 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <h3 className="font-black text-xs uppercase tracking-widest text-foreground">Editor's Picks</h3>
          <span className="ml-auto text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
            Affiliate
          </span>
        </div>

        <div className="p-3 space-y-1">
          {affiliatePicks.length > 0 ? affiliatePicks.map((pick: any, i: number) => {
            const badges = ["🏆 Best Seller", "⭐ Top Rated", "💰 Best Value"];
            const badge = badges[i % badges.length];
            const price = Number(pick.price).toFixed(2);
            const href = pick.amazonUrl
              ? `/api/go/${pick.id}?vendor=amazon`
              : pick.chewyUrl
              ? `/api/go/${pick.id}?vendor=chewy`
              : pick.affiliateUrl || `/api/go/${pick.id}`;

            return (
              <a
                key={pick.id}
                href={href}
                target="_blank"
                rel="nofollow noopener sponsored"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted border border-border">
                  <img
                    src={pick.imageUrl || '/placeholder.jpg'}
                    alt={pick.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">{badge}</span>
                  <p className="text-xs font-bold text-foreground line-clamp-1 mt-0.5 group-hover:text-primary transition-colors">
                    {pick.title}
                  </p>
                  <p className="text-xs font-black text-success mt-0.5">${price}</p>
                </div>
                <ChevronRight className="flex-shrink-0 w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            );
          }) : (
            // Fallback curated picks
            [
              { name: 'KONG Classic Dog Toy', price: '$13.99', img: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=80&h=80&q=75', badge: '🏆 Best Seller', href: '#' },
              { name: 'Blue Buffalo Dog Food', price: '$60.98', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=80&h=80&q=75', badge: '⭐ Top Rated', href: '#' },
              { name: 'Purina Pro Plan Cat Food', price: '$42.48', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=80&h=80&q=75', badge: '💰 Best Value', href: '#' },
            ].map((pick) => (
              <a key={pick.name} href={pick.href} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted border border-border relative">
                  <Image src={pick.img} alt={pick.name} fill sizes="48px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">{pick.badge}</span>
                  <p className="text-xs font-bold text-foreground line-clamp-1 mt-0.5 group-hover:text-primary transition-colors">{pick.name}</p>
                  <p className="text-xs font-black text-success mt-0.5">{pick.price}</p>
                </div>
                <ChevronRight className="flex-shrink-0 w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))
          )}

          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-2 border-t border-border px-2">
            <ShieldCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            We may earn a commission from affiliate links.
          </div>
        </div>
      </div>

      {/* ── Browse Topics ─────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-border bg-muted/30 flex items-center gap-2">
          <h3 className="font-black text-xs uppercase tracking-widest text-foreground">Browse Topics</h3>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { label: '🐕 Dogs',    href: '/blog?category=dog' },
              { label: '🐈 Cats',    href: '/blog?category=cat' },
              { label: '🥗 Nutrition',href: '/blog?category=nutrition' },
              { label: '🏥 Health',  href: '/blog?category=health' },
              { label: '🎓 Training',href: '/blog?category=training' },
              { label: '✂️ Grooming',href: '/blog?category=grooming' },
              { label: '🦜 Birds',   href: '/blog?category=bird' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-xs font-semibold bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground px-3 py-1.5 rounded-full transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </aside>
  );
}
