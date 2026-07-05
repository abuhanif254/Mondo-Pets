import { Info } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function AffiliateDisclosure() {
  return (
    <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl p-4 my-6 flex gap-3 text-sm text-indigo-900 dark:text-indigo-200">
      <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
      <div>
        <p className="font-medium leading-relaxed">
          <strong>Affiliate Disclosure:</strong> Mondo Pets is reader-supported. When you buy through links on our site, we may earn an affiliate commission at no extra cost to you. 
          <Link href="/affiliate-disclosure" className="ml-1 underline underline-offset-2 hover:text-indigo-600 dark:hover:text-indigo-300">
            Learn more
          </Link>.
        </p>
      </div>
    </div>
  );
}
