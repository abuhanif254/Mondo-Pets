import {Link} from '@/i18n/routing';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto flex flex-col gap-4 py-10 px-4 md:flex-row md:justify-between md:items-center text-sm text-muted-foreground">
        <div>
          <p>© {new Date().getFullYear()} Mondo Pets. All rights reserved.</p>
          <p className="mt-1 text-xs">Premium pet care, toys, and food.</p>
        </div>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-foreground hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-foreground hover:underline">Terms of Service</Link>
          <Link href="/disclaimer" className="hover:text-foreground hover:underline">Medical Disclaimer</Link>
          <Link href="/contact" className="hover:text-foreground hover:underline">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}
