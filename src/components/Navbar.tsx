'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/routing';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '@/lib/haptic';
import {
  Search, ChevronDown, Globe, Bone, Carrot, Stethoscope,
  BookOpen, Menu, X, Heart, Flame, User, LogOut,
  Package, Sparkles, Star, Home, ShoppingBag, PawPrint,
  Shield, Zap, TrendingUp,
} from 'lucide-react';
import { SearchOverlay } from '@/components/SearchOverlay';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

const TRUST_ITEMS = [
  { icon: Shield, label: 'Vet-Reviewed Content' },
  { icon: Zap,    label: 'Updated Daily' },
  { icon: TrendingUp, label: '50K+ Monthly Readers' },
];

const LANGUAGES = [
  { code: 'en', label: 'English',  flag: '🇺🇸' },
  { code: 'bn', label: 'বাংলা',    flag: '🇧🇩' },
  { code: 'hi', label: 'हिन्दी',   flag: '🇮🇳' },
  { code: 'de', label: 'Deutsch',  flag: '🇩🇪' },
  { code: 'es', label: 'Español',  flag: '🇪🇸' },
];

const SHOP_MENU = [
  { href: '/toys',     icon: Bone,        label: 'Premium Toys',      desc: 'Keep them entertained',  color: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' },
  { href: '/food',     icon: Carrot,      label: 'Nutritious Food',   desc: 'Healthy, tasty diets',   color: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' },
  { href: '/grooming', icon: Stethoscope, label: 'Grooming & Health', desc: 'Care essentials',        color: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' },
];

const BOTTOM_NAV = [
  { href: '/',        icon: Home,        label: 'Home'    },
  { href: '/products',icon: ShoppingBag, label: 'Shop'    },
  { href: '/blog',    icon: BookOpen,    label: 'Blog'    },
  { href: '/wishlist',icon: Heart,       label: 'Saved'   },
];

export function Navbar({ locale }: { locale: string }) {
  const tn = useTranslations('Navbar');
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const { items } = useWishlist();
  const { user, logout } = useAuth();
  const wishlistCount = items.length;

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  const currentLang = LANGUAGES.find(l => l.code === locale) || LANGUAGES[0];

  return (
    <>
      {/* ─────────────────────────────────────────────────────────
          MAIN HEADER
          ───────────────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-lg shadow-lg border-b border-border'
          : 'bg-background border-b border-border'
      }`}>

        {/* ── TRUST BAR (desktop only) ── */}
        <div className="hidden lg:flex items-center justify-center gap-8 px-4 py-1.5 bg-primary text-white text-[11px] font-semibold tracking-wide">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 opacity-90">
              <Icon className="w-3 h-3" />
              {label}
            </span>
          ))}
          <span className="mx-2 opacity-40">|</span>
          <a href="/affiliate-disclosure" className="underline underline-offset-2 opacity-75 hover:opacity-100 transition-opacity">
            Affiliate Disclosure
          </a>
        </div>

        {/* ── TOP UTILITY BAR (desktop) ── */}
        <div className="hidden md:flex items-center justify-between gap-6 px-4 md:px-8 py-2 max-w-[1440px] mx-auto border-b border-border/60">

          {/* Search */}
          <div
            className="flex-1 max-w-xl flex items-center relative group cursor-text"
            onClick={() => setSearchOpen(true)}
          >
            <input
              readOnly
              type="text"
              placeholder="Search products, brands, articles…"
              className="w-full h-9 bg-muted border border-border rounded-full pl-4 pr-10 text-sm text-muted-foreground outline-none cursor-text transition-all group-hover:border-primary/50 group-hover:shadow-sm"
            />
            <button
              aria-label="Open search"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Utility links */}
          <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground flex-shrink-0">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="flex items-center gap-1.5 hover:text-primary transition-colors relative"
            >
              <Heart className="h-4 w-4" />
              <span className="uppercase tracking-widest">Wishlist</span>
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-sm ring-2 ring-background">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <span className="w-px h-3 bg-border" />

            {/* Language switcher */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setActiveDropdown('lang')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Globe className="h-3.5 w-3.5" />
                <span className="uppercase">{locale}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              <AnimatePresence>
                {activeDropdown === 'lang' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full right-0 mt-2 w-36 rounded-xl border border-border bg-popover shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-1 flex flex-col gap-0.5">
                      {LANGUAGES.map((l) => (
                        <a
                          key={l.code}
                          href={`/${l.code}${pathname === '/' ? '' : pathname}`}
                          className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors ${
                            locale === l.code
                              ? 'bg-primary/10 text-primary font-bold'
                              : 'hover:bg-muted text-foreground'
                          }`}
                        >
                          <span>{l.flag}</span>
                          {l.label}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="w-px h-3 bg-border" />
            <ThemeToggle />
            <span className="w-px h-3 bg-border" />

            {/* Auth */}
            {mounted && user ? (
              <div
                className="relative flex items-center cursor-pointer"
                onMouseEnter={() => setActiveDropdown('user')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span className="hover:text-foreground transition-colors">
                  Hi, {user.name.split(' ')[0]}
                </span>
                <AnimatePresence>
                  {activeDropdown === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full right-0 mt-2 w-48 rounded-xl border border-border bg-popover shadow-xl overflow-hidden z-50 text-foreground"
                    >
                      <div className="p-2 flex flex-col gap-1">
                        <Link href="/account" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-sm">
                          <User className="h-4 w-4" /> My Account
                        </Link>
                        <button
                          onClick={logout}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-500/10 text-red-500 text-sm text-left w-full"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : mounted ? (
              <Link href="/login" className="hover:text-foreground transition-colors">
                Sign In
              </Link>
            ) : <span className="w-16" />}
          </div>
        </div>

        {/* ── MAIN NAV BAR ── */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between gap-4 py-1.5 lg:py-3.5 app-header-compact lg:h-auto">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                <PawPrint className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <span className="font-black text-lg lg:text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                Mondo<span className="text-primary"> Pets</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center" aria-label="Main navigation">

              {/* Deals */}
              <Link
                href="/deals"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
              >
                <Flame className="w-4 h-4 fill-current" />
                Deals
              </Link>

              {/* Shop Mega Menu */}
              <div
                className="relative flex items-center"
                onMouseEnter={() => setActiveDropdown('shop')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold rounded-xl transition-all ${
                  activeDropdown === 'shop'
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted'
                }`}>
                  Shop by Pet <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'shop' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'shop' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 w-[680px] mt-3 z-50"
                    >
                      <div className="bg-popover border border-border rounded-2xl shadow-2xl overflow-hidden flex">
                        {/* Categories */}
                        <div className="w-1/2 p-5 bg-muted/30">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">
                            Shop Categories
                          </p>
                          <div className="flex flex-col gap-2">
                            {SHOP_MENU.map(({ href, icon: Icon, label, desc, color }) => (
                              <Link
                                key={href}
                                href={href}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-background border border-transparent hover:border-border transition-all group/item"
                              >
                                <div className={`p-2 rounded-lg transition-transform group-hover/item:scale-110 ${color}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-bold text-foreground text-sm">{label}</p>
                                  <p className="text-xs text-muted-foreground">{desc}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                        {/* Featured banner */}
                        <div className="w-1/2 p-5">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">
                            Featured This Week
                          </p>
                          <Link
                            href="/deals"
                            className="relative block rounded-xl overflow-hidden h-44 bg-zinc-900 group/img"
                          >
                            <Image
                              fill
                              src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=75"
                              alt="Featured pet products"
                              sizes="280px"
                              className="object-cover opacity-60 group-hover/img:opacity-80 group-hover/img:scale-105 transition-all duration-500"
                            />
                            <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                              <span className="text-white font-black text-lg drop-shadow-md">Summer Deals</span>
                              <span className="text-amber-400 font-bold text-sm flex items-center gap-1 group-hover/img:gap-2 transition-all">
                                Up to 40% Off →
                              </span>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/products" className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-foreground hover:bg-muted rounded-xl transition-colors">
                Products
                <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md text-[10px] uppercase font-black tracking-wider">
                  New
                </span>
              </Link>

              <Link href="/blog" className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-foreground hover:bg-muted rounded-xl transition-colors">
                <BookOpen className="w-4 h-4 text-primary" />
                Pet Advice
              </Link>

              <Link href="/brands" className="px-3 py-2 text-sm font-bold text-foreground hover:bg-muted rounded-xl transition-colors">
                Brands
              </Link>

              <Link href="/compare" className="px-3 py-2 text-sm font-bold text-foreground hover:bg-muted rounded-xl transition-colors">
                Compare
              </Link>

              {/* Community dropdown */}
              <div
                className="relative flex items-center"
                onMouseEnter={() => setActiveDropdown('community')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold rounded-xl transition-all ${
                  activeDropdown === 'community'
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted'
                }`}>
                  Community <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'community' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'community' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full right-0 w-56 mt-3 z-50"
                    >
                      <div className="bg-popover border border-border rounded-2xl shadow-2xl p-2 flex flex-col gap-1">
                        <Link href="/forum" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group/link">
                          <div className="p-2 bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-lg group-hover/link:scale-110 transition-transform">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">Forum</p>
                            <p className="text-xs text-muted-foreground">Connect with owners</p>
                          </div>
                        </Link>
                        <Link href="/quiz" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group/link">
                          <div className="p-2 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg group-hover/link:scale-110 transition-transform">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">Gift Finder</p>
                            <p className="text-xs text-muted-foreground">Find the perfect gift</p>
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Desktop right side CTA */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <Link
                href="/blog/new"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-sm shadow-primary/20"
              >
                <Star className="w-4 h-4" />
                Pet Advice
              </Link>
            </div>

            {/* Mobile right actions */}
            <div className="flex items-center gap-0.5 lg:hidden flex-shrink-0">
              <button
                aria-label="Search"
                className="p-2 text-foreground hover:bg-muted rounded-xl transition-colors"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4.5 w-4.5" />
              </button>
              <button
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="p-2 text-foreground hover:bg-muted rounded-xl transition-colors"
                onClick={() => {
                  triggerHaptic(15);
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-border bg-background overflow-hidden absolute top-full left-0 right-0 z-40 shadow-xl"
            >
              <div className="flex flex-col p-5 gap-5 max-h-[80vh] overflow-y-auto">

                {/* User section */}
                <div className="flex items-center justify-between border-b border-border pb-5">
                  {mounted && user ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white font-black flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{user.name}</p>
                        <Link href="/account" className="text-xs font-semibold text-primary hover:underline">View Account</Link>
                      </div>
                    </div>
                  ) : (
                    <Link href="/login" className="font-black text-lg text-primary">
                      Sign In / Register →
                    </Link>
                  )}
                  <ThemeToggle />
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-2 gap-3">
                  {SHOP_MENU.map(({ href, icon: Icon, label, color }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2.5 p-3 bg-muted/50 hover:bg-muted rounded-xl transition-colors"
                    >
                      <div className={`p-1.5 rounded-lg ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-foreground">{label.split(' ')[0]}</span>
                    </Link>
                  ))}
                  <Link href="/blog" className="flex items-center gap-2.5 p-3 bg-muted/50 hover:bg-muted rounded-xl transition-colors">
                    <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-foreground">Pet Advice</span>
                  </Link>
                </div>

                {/* Main links */}
                <div className="flex flex-col gap-1 border-t border-border pt-4">
                  <Link href="/deals" className="flex items-center gap-2 px-3 py-3 font-black text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors">
                    <Flame className="w-5 h-5 fill-current" /> Today's Deals
                  </Link>
                  <Link href="/products" className="flex items-center justify-between px-3 py-3 font-bold text-foreground hover:bg-muted rounded-xl transition-colors">
                    All Products
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[10px] uppercase font-black tracking-wider">New</span>
                  </Link>
                  <Link href="/brands"  className="px-3 py-3 font-bold text-foreground hover:bg-muted rounded-xl transition-colors">Top Brands</Link>
                  <Link href="/compare" className="px-3 py-3 font-bold text-foreground hover:bg-muted rounded-xl transition-colors">Compare Products</Link>
                  <Link href="/forum"   className="px-3 py-3 font-bold text-foreground hover:bg-muted rounded-xl transition-colors">Community Forum</Link>
                  <Link href="/quiz"    className="flex items-center gap-2 px-3 py-3 font-bold text-foreground hover:bg-muted rounded-xl transition-colors">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Gift Finder
                  </Link>
                </div>

                {/* Language */}
                <div className="border-t border-border pt-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  {currentLang.flag} {currentLang.label}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─────────────────────────────────────────────────────────
          MOBILE BOTTOM NAVIGATION BAR
          ───────────────────────────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border shadow-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {BOTTOM_NAV.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => triggerHaptic(12)}
                className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {/* Active dot */}
                {isActive && (
                  <motion.span
                    layoutId="mobile-nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'fill-primary/20' : ''}`} />
                <span className="text-[10px] font-bold relative z-10 tracking-wide">{label}</span>
                {/* Wishlist badge */}
                {href === '/wishlist' && mounted && wishlistCount > 0 && (
                  <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-sm ring-2 ring-background z-20">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            );
          })}
          {/* More button */}
          <button
            onClick={() => {
              triggerHaptic(15);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-wide">More</span>
          </button>
        </div>
      </nav>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
