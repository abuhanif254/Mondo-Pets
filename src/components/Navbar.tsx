'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/routing';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ChevronDown, Globe, Bone, Carrot, Stethoscope, BookOpen, Menu, X, Heart, Flame, User, LogOut, Phone, HelpCircle, Package, ShoppingCart, Sparkles, Star
} from 'lucide-react';
import { SearchOverlay } from '@/components/SearchOverlay';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

export function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('HomePage'); 
  const tn = useTranslations('Navbar');
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  
  const { items } = useWishlist();
  const { user, logout } = useAuth();
  const wishlistCount = items.length;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'de', label: 'Deutsch' },
    { code: 'es', label: 'Español' },
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  return (
    <header className={`sticky top-0 z-50 w-full bg-background transition-all duration-300 ${isScrolled ? 'shadow-md supports-[backdrop-filter]:bg-background/95 backdrop-blur-md' : 'border-b border-border shadow-sm supports-[backdrop-filter]:bg-background/100'}`}>
      
      {/* TIER 1: Top Bar (Search, Wishlist, Language, Theme, Auth) */}
      <div className="w-full bg-muted/40 border-b border-border transition-all duration-300 py-2 hidden md:block">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-full flex items-center justify-between gap-6">
          
          {/* LARGE SEARCH BAR */}
          <div className="flex-1 max-w-2xl flex items-center relative group" onClick={() => setSearchOpen(true)}>
            <input 
              type="text" 
              placeholder="Search for products, brands and more..." 
              className="w-full h-10 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-500 rounded-full pl-5 pr-12 text-sm shadow-sm group-hover:shadow transition-all text-foreground outline-none cursor-text pointer-events-none"
              readOnly
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-sm pointer-events-auto">
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground flex-shrink-0">
            {/* Wishlist */}
            <Link href="/wishlist" className="flex items-center justify-center gap-1.5 hover:text-blue-600 transition-colors relative group">
              <Heart className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="font-bold uppercase tracking-widest">Wishlist</span>
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white shadow-sm ring-2 ring-background">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <span className="w-px h-3 bg-border"></span>

            {/* Language Dropdown */}
            <div className="relative h-full flex items-center" onMouseEnter={() => setActiveDropdown('lang')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-1 py-1 hover:text-foreground transition-colors h-full">
                <Globe className="h-3.5 w-3.5" />
                <span className="uppercase">{locale}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              <AnimatePresence>
                {activeDropdown === 'lang' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.15 }} className="absolute top-full right-0 mt-0 w-32 rounded-lg border border-border bg-popover shadow-xl overflow-hidden z-50">
                    <div className="p-1 flex flex-col">
                      {languages.map((l) => (
                        <a key={l.code} href={`/${l.code}${pathname === '/' ? '' : pathname}`} className={`px-3 py-2 text-xs rounded-md transition-colors ${locale === l.code ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted text-foreground'}`}>
                          {l.label}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="w-px h-3 bg-border"></span>
            
            <ThemeToggle />

            {/* Auth Link */}
            <span className="w-px h-3 bg-border"></span>
            {mounted && user ? (
              <div className="relative group cursor-pointer h-full flex items-center" onMouseEnter={() => setActiveDropdown('user')} onMouseLeave={() => setActiveDropdown(null)}>
                <span className="hover:text-foreground transition-colors py-1">Hi, {user.name.split(' ')[0]}</span>
                <AnimatePresence>
                  {activeDropdown === 'user' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.15 }} className="absolute top-full right-0 mt-0 w-48 rounded-lg border border-border bg-popover shadow-xl overflow-hidden z-50 text-foreground">
                      <div className="p-2 flex flex-col gap-1">
                        <Link href="/account" className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm"><User className="h-4 w-4" /> My Account</Link>
                        <button onClick={logout} className="flex items-center gap-2 p-2 rounded-md hover:bg-red-500/10 text-red-500 text-sm text-left w-full"><LogOut className="h-4 w-4" /> Sign Out</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : mounted ? (
              <Link href="/login" className="hover:text-foreground transition-colors py-1">Sign In / Register</Link>
            ) : <span className="w-24"></span>}
          </div>
        </div>
      </div>

      {/* TIER 2: Main Middle Bar (Logo, Nav Links, Mobile Actions) */}
      <div className={`max-w-[1440px] mx-auto px-4 md:px-8 transition-all duration-300 py-3 md:py-4`}>
        <div className="flex items-center justify-between gap-4 md:gap-8 lg:gap-12">
          
          {/* LOGO */}
          <Link href="/" className="flex flex-shrink-0 items-center space-x-2 lg:space-x-3 group">
            <span className="font-black text-2xl md:text-3xl tracking-tight text-foreground group-hover:text-blue-600 transition-colors">
              Mondo Pets
            </span>
          </Link>

          {/* MAIN NAV LINKS (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center">
            <Link href="/deals" className="flex items-center gap-1.5 text-sm font-black text-red-600 dark:text-red-500 hover:text-red-700 transition-colors">
              <Flame className="w-4 h-4 fill-current" />
              Today's Deals
            </Link>

            {/* Mega Menu Dropdown: Shop by Pet */}
            <div className="h-full flex items-center relative group" onMouseEnter={() => setActiveDropdown('shop')} onMouseLeave={() => setActiveDropdown(null)}>
              <div className={`flex items-center gap-1.5 text-sm font-bold cursor-pointer transition-colors border-b-2 border-transparent py-1 ${activeDropdown === 'shop' ? 'text-blue-600 border-blue-600' : 'text-foreground group-hover:text-blue-600'}`}>
                Shop by Pet <ChevronDown className="h-4 w-4" />
              </div>
              
              <AnimatePresence>
                {activeDropdown === 'shop' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.15 }} className="absolute top-full left-0 w-[700px] mt-4 z-50">
                    <div className="bg-popover border border-border rounded-2xl shadow-2xl overflow-hidden flex">
                      <div className="w-1/2 p-6 bg-muted/20">
                        <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Categories</h4>
                        <div className="flex flex-col gap-2">
                          <Link href="/toys" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-zinc-800 shadow-sm border border-transparent hover:border-border transition-all group/link">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover/link:scale-110 transition-transform"><Bone className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
                            <div><p className="font-bold text-foreground">Premium Toys</p><p className="text-xs text-muted-foreground">Keep them entertained</p></div>
                          </Link>
                          <Link href="/food" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-zinc-800 shadow-sm border border-transparent hover:border-border transition-all group/link">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover/link:scale-110 transition-transform"><Carrot className="w-5 h-5 text-orange-600 dark:text-orange-400" /></div>
                            <div><p className="font-bold text-foreground">Nutritious Food</p><p className="text-xs text-muted-foreground">Healthy, tasty diets</p></div>
                          </Link>
                          <Link href="/grooming" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-zinc-800 shadow-sm border border-transparent hover:border-border transition-all group/link">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover/link:scale-110 transition-transform"><Stethoscope className="w-5 h-5 text-green-600 dark:text-green-400" /></div>
                            <div><p className="font-bold text-foreground">Grooming & Health</p><p className="text-xs text-muted-foreground">Care essentials</p></div>
                          </Link>
                        </div>
                      </div>
                      <div className="w-1/2 p-6">
                         <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Featured Collection</h4>
                         <Link href="/new" className="rounded-xl overflow-hidden relative group/img cursor-pointer h-48 bg-zinc-900 block">
                           <Image fill src="/placeholder.jpg" className="object-cover opacity-60 group-hover/img:opacity-80 group-hover/img:scale-105 transition-all duration-500" alt="Featured" sizes="(max-width: 768px) 100vw, 33vw" />
                           <div className="absolute inset-0 p-5 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                             <span className="text-white font-black text-xl drop-shadow-md">Spring Collection</span>
                             <span className="text-emerald-400 font-bold text-sm drop-shadow-md flex items-center gap-1 group-hover/img:gap-2 transition-all">Up to 40% Off &rarr;</span>
                           </div>
                         </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/products" className="text-sm font-bold text-foreground hover:text-blue-600 transition-colors flex items-center gap-2">
               Products
               <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-black tracking-widest">New</span>
            </Link>

            <Link href="/brands" className="text-sm font-bold text-foreground hover:text-blue-600 transition-colors">
               Brands
            </Link>

            <Link href="/compare" className="text-sm font-bold text-foreground hover:text-blue-600 transition-colors">
               Compare
            </Link>

            <Link href="/blog" className="text-sm font-bold text-foreground hover:text-blue-600 transition-colors flex items-center gap-1">
               <BookOpen className="w-4 h-4 text-indigo-500" /> Blog
            </Link>

            <div className="h-full flex items-center relative group" onMouseEnter={() => setActiveDropdown('learn')} onMouseLeave={() => setActiveDropdown(null)}>
              <div className={`flex items-center gap-1.5 text-sm font-bold cursor-pointer transition-colors py-1 border-b-2 border-transparent ${activeDropdown === 'learn' ? 'text-blue-600 border-blue-600' : 'text-foreground group-hover:text-blue-600'}`}>
                Community <ChevronDown className="h-4 w-4" />
              </div>
              <AnimatePresence>
                {activeDropdown === 'learn' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.15 }} className="absolute top-full right-0 w-64 mt-4 z-50">
                    <div className="bg-popover border border-border rounded-2xl shadow-2xl overflow-hidden p-3 flex flex-col gap-2">
                      <Link href="/forum" className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors group/link">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover/link:scale-110 transition-transform"><Package className="w-5 h-5 text-purple-600 dark:text-purple-400" /></div>
                        <div><p className="font-bold text-foreground">Community Forum</p><p className="text-xs text-muted-foreground mt-0.5">Connect with owners</p></div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* MOBILE ACTIONS */}
          <div className="flex items-center gap-1 md:gap-2 lg:hidden flex-shrink-0">
            {/* Mobile Search Toggle */}
            <button className="p-2 text-foreground" onClick={() => setSearchOpen(true)}>
              <Search className="h-6 w-6" />
            </button>
            
            {/* Wishlist Mobile */}
            <Link href="/wishlist" className="flex items-center justify-center p-2 text-muted-foreground hover:text-blue-600 transition-colors relative">
              <Heart className="h-6 w-6" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button className="p-2 ml-1 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (Slide Down) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="lg:hidden border-t border-border bg-background overflow-hidden shadow-inner absolute top-full left-0 right-0 z-40">
            <div className="flex flex-col p-6 space-y-6 max-h-[85vh] overflow-y-auto">
              
              {/* User mobile section */}
              <div className="flex items-center justify-between border-b border-border pb-6">
                 {mounted && user ? (
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xl">{user.name.charAt(0)}</div>
                     <div>
                       <p className="font-bold text-foreground text-lg">{user.name}</p>
                       <Link href="/account" className="text-sm font-semibold text-blue-600 hover:underline">View Account</Link>
                     </div>
                   </div>
                 ) : (
                   <Link href="/login" className="font-black text-xl text-blue-600">Sign In / Register &rarr;</Link>
                 )}
                 <ThemeToggle />
              </div>

              <Link href="/quiz" className="font-semibold text-sm hover:text-emerald-500 transition-colors flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-4 h-4" /> Gift Finder
              </Link>
              <Link href="/compare" className="font-semibold text-sm hover:text-emerald-500 transition-colors">Compare</Link>
              <Link href="/blog" className="font-semibold text-sm hover:text-emerald-500 transition-colors flex items-center gap-1"><BookOpen className="w-4 h-4"/> Blog</Link>
              <Link href="/wishlist" className="font-semibold text-sm hover:text-emerald-500 transition-colors flex items-center gap-1"><Star className="w-4 h-4"/> Wishlist</Link>

              <div className="flex flex-col gap-5">
                <Link href="/deals" className="font-black text-xl text-red-600 flex items-center gap-2"><Flame className="w-6 h-6" /> Today's Deals</Link>
                <Link href="/products" className="font-black text-xl text-foreground flex items-center justify-between">All Products <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs uppercase tracking-widest">New</span></Link>
                <Link href="/brands" className="font-black text-xl text-foreground">Top Brands</Link>
              </div>

              <div className="pt-6 border-t border-border">
                <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Shop Categories</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/toys" className="bg-muted/50 hover:bg-muted p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors"><Bone className="w-8 h-8 text-blue-500" /><span className="font-bold text-sm">Toys</span></Link>
                  <Link href="/food" className="bg-muted/50 hover:bg-muted p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors"><Carrot className="w-8 h-8 text-orange-500" /><span className="font-bold text-sm">Food</span></Link>
                  <Link href="/grooming" className="bg-muted/50 hover:bg-muted p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors"><Stethoscope className="w-8 h-8 text-green-500" /><span className="font-bold text-sm">Health</span></Link>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border flex justify-end text-muted-foreground text-sm font-semibold">
                <span className="flex items-center gap-2"><Globe className="w-4 h-4"/> {currentLang.label}</span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
