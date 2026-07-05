import * as React from 'react';
import { getTranslations } from 'next-intl/server';
import { NewsletterForm } from './NewsletterForm';
import { Link } from '@/i18n/routing';
import { PawPrint, Mail, ArrowUpRight, Rss, BookOpen, Shield } from 'lucide-react';

const SHOP_LINKS = [
  { href: '/deals',    label: "Today's Deals",     badge: '🔥' },
  { href: '/products', label: 'All Products' },
  { href: '/food',     label: 'Pet Food' },
  { href: '/toys',     label: 'Toys & Accessories' },
  { href: '/grooming', label: 'Grooming & Health' },
  { href: '/brands',   label: 'Top Brands' },
];

const ADVICE_LINKS = [
  { href: '/blog',     label: 'Pet Advice Blog',    badge: '✍️' },
  { href: '/forum',    label: 'Community Forum' },
  { href: '/care',     label: 'Care Guides' },
  { href: '/compare',  label: 'Compare Products' },
  { href: '/quiz',     label: 'Gift Finder Quiz',   badge: '🎁' },
  { href: '/tool/dog-cat-calorie-calculator', label: 'Calorie Calculator' },
];

const TRUST_LINKS = [
  { href: '/about',               label: 'About Us',             icon: Shield },
  { href: '/contact',             label: 'Contact Us' },
  { href: '/methodology',         label: 'Our Methodology'       },
  { href: '/affiliate-disclosure',label: 'Affiliate Disclosure'  },
  { href: '/account',             label: 'My Account' },
  { href: '/wishlist',            label: 'Wishlist' },
  { href: '/privacy',             label: 'Privacy Policy' },
  { href: '/terms',               label: 'Terms of Service' },
];

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SOCIAL_LINKS = [
  {
    href:  'https://twitter.com/mondopets',
    label: 'Twitter / X',
    icon:  TwitterIcon,
    color: 'hover:bg-zinc-700',
  },
  {
    href:  'https://youtube.com/@mondopets',
    label: 'YouTube',
    icon:  YoutubeIcon,
    color: 'hover:bg-red-600',
  },
  {
    href:  '/feed.xml',
    label: 'RSS Feed',
    icon:  Rss,
    color: 'hover:bg-amber-600',
  },
  {
    href:  'mailto:hello@mondopets.com',
    label: 'Email Us',
    icon:  Mail,
    color: 'hover:bg-indigo-600',
  },
];

export async function Footer() {
  const tr = await getTranslations('RightSidebar');

  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-900">

      {/* ── MAIN FOOTER GRID ── */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pt-10 pb-8 md:pt-16 md:pb-12">
        <div className="grid grid-cols-2 xl:grid-cols-12 gap-x-6 gap-y-10 xl:gap-12 mb-8 md:mb-14">

          {/* Col 1 — Brand */}
          <div className="col-span-2 md:col-span-1 xl:col-span-3 space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/50">
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tight text-white">
                Mondo<span className="text-indigo-400"> Pets</span>
              </span>
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              Independent pet product reviews and expert care advice. We earn commissions on qualifying purchases — at no extra cost to you.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: '50K+',  label: 'Monthly Readers' },
                { value: '500+',  label: 'Products Reviewed' },
                { value: '5 yrs', label: 'of Expertise' },
                { value: '100%',  label: 'Independent' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-2.5">
                  <p className="font-black text-white text-lg leading-tight">{value}</p>
                  <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon, color }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 rounded-xl bg-zinc-800 ${color} text-zinc-300 flex items-center justify-center transition-all duration-200 hover:text-white hover:scale-110`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Shop */}
          <div className="col-span-1 xl:col-span-2">
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-3 md:mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-indigo-500 rounded-full" />
              Shop & Deals
            </h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map(({ href, label, badge }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
                  >
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 group-hover:ml-0 transition-all text-indigo-400" />
                    {label}
                    {badge && <span>{badge}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Pet Advice */}
          <div className="col-span-1 xl:col-span-2">
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-3 md:mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-amber-500 rounded-full" />
              Pet Advice
            </h4>
            <ul className="space-y-2.5">
              {ADVICE_LINKS.map(({ href, label, badge }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
                  >
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 group-hover:ml-0 transition-all text-amber-400" />
                    {label}
                    {badge && <span>{badge}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Trust & Legal */}
          <div className="col-span-1 xl:col-span-2">
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-3 md:mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full" />
              Company
            </h4>
            <ul className="space-y-2.5">
              {TRUST_LINKS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
                  >
                    {Icon
                      ? <Icon className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      : <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 group-hover:ml-0 transition-all text-emerald-400" />
                    }
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5 — Newsletter */}
          <div className="col-span-2 md:col-span-1 xl:col-span-3">
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-3 md:mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-violet-500 rounded-full" />
              Join the Pack 🐾
            </h4>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <p className="text-sm text-zinc-400 leading-relaxed">
                Get weekly pet care tips, exclusive deals, and new product alerts. No spam — just good stuff for pet lovers.
              </p>
              <NewsletterForm
                translations={{
                  placeholder: tr('emailPlaceholder'),
                  button: tr('joinBtn'),
                }}
              />
              <div className="flex items-start gap-2 text-xs text-zinc-600">
                <Shield className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-emerald-700" />
                <span>We respect your privacy. Unsubscribe anytime.</span>
              </div>
            </div>

            {/* Latest from blog teaser */}
            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <Link href="/blog" className="hover:text-white transition-colors">
                Read the latest Pet Advice →
              </Link>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="border-t border-zinc-900 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
            <span>© {new Date().getFullYear()} Mondo Pets. All rights reserved.</span>
            <span className="hidden md:inline w-px h-3 bg-zinc-800" />
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Independent & Unbiased Reviews
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 justify-center">
            <Link href="/privacy"              className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms"                className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/affiliate-disclosure" className="hover:text-white transition-colors">Affiliate Disclosure</Link>
            <Link href="/sitemap.xml"          className="hover:text-white transition-colors">Sitemap</Link>
            <a
              href="/feed.xml"
              className="flex items-center gap-1 hover:text-amber-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Rss className="w-3 h-3" /> RSS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
