'use client';

import {Link} from '@/i18n/routing';
import { JsonLd } from './JsonLd';
import { motion } from 'framer-motion';

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
      <motion.article 
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group flex flex-col items-start justify-between rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 h-full"
      >
        <div className="flex items-center gap-x-4 text-xs">
          <time dateTime={date} className="text-muted-foreground font-medium">
            {new Date(date).toLocaleDateString()}
          </time>
          <span className="relative z-10 rounded-sm bg-accent/20 px-2 py-1 font-bold text-accent-foreground uppercase tracking-wide text-[10px]">
            Care
          </span>
        </div>
        <div className="group relative max-w-xl flex-1 mt-4">
          <h3 className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
            <Link href={`/blog/${slug}`}>
              <span className="absolute inset-0" />
              {title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {excerpt}
          </p>
        </div>
        <div className="relative mt-6 flex items-center gap-x-3 pt-4 border-t border-border/50 w-full">
          {/* Placeholder for Author Avatar */}
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-extrabold text-primary border border-primary/20">
            {authorName.charAt(0)}
          </div>
          <div className="text-sm leading-6">
            <p className="font-semibold text-foreground">
              {authorName}
            </p>
            <p className="text-xs text-muted-foreground">{authorCredential}</p>
          </div>
        </div>
      </motion.article>
    </>
  );
}
