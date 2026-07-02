'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, Home, LayoutDashboard, Package } from 'lucide-react';

export function AdminHeader() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
            M
          </div>
          <h1 className="font-bold text-lg hidden sm:block">Admin Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/en" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
            View Site
          </Link>
          <div className="h-4 w-px bg-border mx-2" />
          <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="px-6 flex items-center gap-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                isActive 
                  ? 'border-primary text-primary font-semibold' 
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
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
