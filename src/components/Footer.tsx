import * as React from 'react';
import { getTranslations } from 'next-intl/server';
import { NewsletterForm } from './NewsletterForm';
import { Link } from '@/i18n/routing';
import { HeadphonesIcon } from 'lucide-react';

export async function Footer() {
  const tr = await getTranslations('RightSidebar');
  const tl = await getTranslations('LeftSidebar');

  return (
    <footer className="bg-zinc-950 dark:bg-zinc-950 text-zinc-300 border-t border-zinc-900 pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* Brand & Support */}
          <div className="space-y-6 lg:col-span-3">
            <Link href="/" className="flex flex-shrink-0 items-center space-x-2 text-white">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-2xl leading-none">
                M
              </div>
              <span className="font-extrabold text-2xl tracking-tight">
                Mondo Pets
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Premium pet care, toys, and food for your beloved companions. We bring you the best deals from top retailers.
            </p>
            <div className="flex items-center gap-4 text-emerald-500">
              <HeadphonesIcon className="w-8 h-8" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{tl('needHelp')}</p>
                <p className="font-semibold text-white">{tl('supportCenter')}</p>
              </div>
            </div>
          </div>

          {/* Shop & Deals */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-lg mb-6">Shop & Deals</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/deals" className="hover:text-emerald-400 transition-colors">Today's Deals</Link></li>
              <li><Link href="/brands" className="hover:text-emerald-400 transition-colors">Top Brands</Link></li>
              <li><Link href="/products" className="hover:text-emerald-400 transition-colors">All Products</Link></li>
              <li><Link href="/food" className="hover:text-emerald-400 transition-colors">Pet Food</Link></li>
              <li><Link href="/toys" className="hover:text-emerald-400 transition-colors">Toys & Accessories</Link></li>
            </ul>
          </div>

          {/* Learn & Connect */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-lg mb-6">Learn & Connect</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">Pet Care Blog</Link></li>
              <li><Link href="/forum" className="hover:text-emerald-400 transition-colors">Community Forum</Link></li>
              <li><Link href="/care" className="hover:text-emerald-400 transition-colors">Care Guides</Link></li>
              <li><Link href="/tool/dog-cat-calorie-calculator" className="hover:text-emerald-400 transition-colors">Free Calculators 📈</Link></li>
              <li><Link href="/quiz" className="hover:text-emerald-400 transition-colors">Gift Finder Quiz</Link></li>
            </ul>
          </div>

          {/* Account & Info */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-lg mb-6">Account & Info</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/account" className="hover:text-emerald-400 transition-colors">My Account</Link></li>
              <li><Link href="/wishlist" className="hover:text-emerald-400 transition-colors">Wishlist</Link></li>
              <li><Link href="/compare" className="hover:text-emerald-400 transition-colors">Compare Products</Link></li>
              <li><Link href="/methodology" className="hover:text-emerald-400 transition-colors font-semibold text-emerald-500">Our Methodology</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-zinc-900/50 p-6 border border-zinc-800">
              <h4 className="text-white font-bold text-lg mb-2">{tr('joinClubTitle')}</h4>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                {tr('joinClubDesc')}
              </p>
              <NewsletterForm translations={{ placeholder: tr('emailPlaceholder'), button: tr('joinBtn') }} />
            </div>
          </div>
          
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Mondo Pets. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/affiliate-disclosure" className="hover:text-white transition-colors">Affiliate Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
