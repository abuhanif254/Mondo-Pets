'use client';

import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/routing';

export function Navbar({locale}: {locale: string}) {
  const t = useTranslations('HomePage'); // Using HomePage just for a quick test, typically we'd have a 'Navbar' namespace
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl text-primary">Mondo Pets</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="/toys" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Toys
            </Link>
            <Link href="/food" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Food
            </Link>
            <Link href="/care" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Care & Treatment
            </Link>
            <Link href="/blog" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Blog
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 text-sm">
            <Link href={pathname} locale="en" className={`hover:text-primary ${locale === 'en' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>EN</Link>
            <Link href={pathname} locale="bn" className={`hover:text-primary ${locale === 'bn' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>BN</Link>
            <Link href={pathname} locale="hi" className={`hover:text-primary ${locale === 'hi' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>HI</Link>
            <Link href={pathname} locale="de" className={`hover:text-primary ${locale === 'de' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>DE</Link>
            <Link href={pathname} locale="es" className={`hover:text-primary ${locale === 'es' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>ES</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
