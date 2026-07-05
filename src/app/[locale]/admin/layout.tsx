'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  FolderHeart, 
  FileText, 
  Users, 
  ShieldAlert, 
  MessageSquare, 
  Cpu, 
  FileDown, 
  Sliders, 
  LogOut, 
  Menu, 
  X, 
  PawPrint 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const isLoginPage = pathname.endsWith('/login');

  const locale = pathname.split('/')[1] || 'en';

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(pathname.replace(/\/admin.*$/, '/admin/login'));
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const menuItems = [
    { href: `/${locale}/admin`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${locale}/admin/products`, label: 'Products', icon: Package },
    { href: `/${locale}/admin/categories`, label: 'Categories', icon: FolderHeart },
    { href: `/${locale}/admin/blogs`, label: 'Blog Posts', icon: FileText },
    { href: `/${locale}/admin/authors`, label: 'Authors', icon: Users },
    { href: `/${locale}/admin/users`, label: 'Users & Pets', icon: Users },
    { href: `/${locale}/admin/moderation`, label: 'Moderation Queue', icon: ShieldAlert },
    { href: `/${locale}/admin/messages`, label: 'Messages', icon: MessageSquare },
    { href: `/${locale}/admin/auto-content`, label: 'Auto Content (AI)', icon: Cpu, extraClasses: 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700' },
    { href: `/${locale}/admin/import-export`, label: 'Import / Export', icon: FileDown },
    { href: `/${locale}/admin/layout-settings`, label: 'Layout Settings', icon: Sliders },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      
      {/* ── MOBILE HEADER ── */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 bg-background border-b border-border z-40 sticky top-0">
        <Link href={`/${locale}/admin`} className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
            <PawPrint className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg tracking-tight text-foreground">
            Mondo<span className="text-indigo-600 dark:text-indigo-400">Admin</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg border border-border text-foreground bg-muted/40 active:scale-95 transition-all"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── MOBILE MENU DRAWER (SLIDE DOWN / OVERLAY) ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-background/95 backdrop-blur-sm pt-14 animate-in fade-in duration-200">
          <nav className="flex flex-col h-[calc(100vh-56px)] p-6 overflow-y-auto">
            <div className="space-y-1.5 flex-1">
              {menuItems.map(link => {
                const isActive = link.href === `/${locale}/admin` 
                  ? pathname === link.href 
                  : pathname.startsWith(link.href);
                const Icon = link.icon;

                return (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/10' 
                        : `hover:bg-muted text-muted-foreground hover:text-foreground ${link.extraClasses || ''}`
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
            
            <button 
              onClick={handleLogout}
              className="mt-6 flex items-center justify-center gap-2 w-full px-4 py-3 border border-border text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="w-64 bg-muted/20 border-r border-border p-6 flex flex-col hidden md:flex flex-shrink-0 sticky top-0 h-screen">
        <Link href={`/${locale}/admin`} className="flex items-center gap-2.5 group mb-8">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
            <PawPrint className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-foreground">
            Mondo<span className="text-indigo-600 dark:text-indigo-400">Admin</span>
          </span>
        </Link>
        
        <nav className="space-y-1 flex-1 overflow-y-auto pr-1 scrollbar-thin">
          {menuItems.map(link => {
            const isActive = link.href === `/${locale}/admin` 
              ? pathname === link.href 
              : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/10' 
                    : `hover:bg-muted/80 text-muted-foreground hover:text-foreground ${link.extraClasses || ''}`
                }`}
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <button 
          onClick={handleLogout}
          className="mt-6 flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-colors"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
