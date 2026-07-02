'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname.endsWith('/login');

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(pathname.replace(/\/admin.*$/, '/admin/login'));
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-muted/30 border-r border-border p-6 flex flex-col hidden md:flex">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-2 flex-1">
          <a href="#" className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-md font-medium">
            Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors">
            Products
          </a>
          <a href="#" className="flex items-center px-4 py-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors">
            Categories
          </a>
          <a href="#" className="flex items-center px-4 py-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors">
            Blog Posts
          </a>
          <a href={`/${pathname.split('/')[1]}/admin/auto-content`} className="flex items-center px-4 py-2 hover:bg-muted rounded-md text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
            Auto Content (AI)
          </a>
        </nav>
        
        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center justify-center w-full px-4 py-2 border border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10">
        <div className="md:hidden flex justify-end mb-6">
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
          >
            Logout
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
