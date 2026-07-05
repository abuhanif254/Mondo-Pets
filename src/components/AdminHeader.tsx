'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, Home, LayoutDashboard, Package, FileText, Settings, ShieldAlert } from 'lucide-react';

export function AdminHeader() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 glass">
      <div className="flex items-center justify-between py-4 px-6 max-w-7xl mx-auto w-full">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-black shadow-brand">
            M
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-lg leading-none tracking-tight">Admin Console</h1>
            <p className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase mt-0.5 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-emerald-500" /> Authorized Access Only
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/en" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors bg-muted/50 px-3 py-1.5 rounded-lg border border-transparent hover:border-border">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">View Site</span>
          </Link>
          <div className="h-5 w-px bg-border mx-1" />
          <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-red-500 transition-colors">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="px-6 max-w-7xl mx-auto w-full flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                isActive 
                  ? 'border-primary text-primary font-black bg-primary/5' 
                  : 'border-transparent text-muted-foreground font-semibold hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
