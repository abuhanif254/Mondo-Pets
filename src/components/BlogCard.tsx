import {Link} from '@/i18n/routing';
import { JsonLd } from './JsonLd';

interface BlogCardProps {
  title: string;
  excerpt: string;
  authorName: string;
  authorCredential: string;
  date: string;
  slug: string;
}

export function BlogCard({ title, excerpt, authorName, authorCredential, date, slug }: BlogCardProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    abstract: excerpt,
    datePublished: date,
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: authorCredential
    }
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <article className="group flex flex-col items-start justify-between border-b border-border py-6 sm:py-8">
      <div className="flex items-center gap-x-4 text-xs">
        <time dateTime={date} className="text-muted-foreground">
          {new Date(date).toLocaleDateString()}
        </time>
        <span className="relative z-10 rounded-full bg-muted px-3 py-1.5 font-medium text-foreground">
          Treatment
        </span>
      </div>
      <div className="group relative max-w-xl">
        <h3 className="mt-3 text-lg font-semibold leading-6 text-foreground group-hover:text-primary transition-colors">
          <Link href={`/blog/${slug}`}>
            <span className="absolute inset-0" />
            {title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {excerpt}
        </p>
      </div>
      <div className="relative mt-4 flex items-center gap-x-4">
        {/* Placeholder for Author Avatar */}
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
          {authorName.charAt(0)}
        </div>
        <div className="text-sm leading-6">
          <p className="font-semibold text-foreground">
            {authorName}
          </p>
          <p className="text-muted-foreground">{authorCredential}</p>
        </div>
      </div>
    </article>
    </>
  );
}
