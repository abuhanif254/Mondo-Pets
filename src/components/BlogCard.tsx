'use client';

import { Link } from '@/i18n/routing';
import { JsonLd } from './JsonLd';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';

// Category badge config
const CATEGORY_CONFIG: Record<string, { color: string; dot: string; label: string }> = {
  dog:       { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',   dot: 'bg-amber-500',   label: 'Dogs' },
  cat:       { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300', dot: 'bg-purple-500', label: 'Cats' },
  nutrition: { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', dot: 'bg-emerald-500', label: 'Nutrition' },
  health:    { color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',       dot: 'bg-rose-500',    label: 'Health' },
  training:  { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',       dot: 'bg-blue-500',    label: 'Training' },
  grooming:  { color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',       dot: 'bg-pink-500',    label: 'Grooming' },
  bird:      { color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',           dot: 'bg-sky-500',     label: 'Birds' },
  default:   { color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300', dot: 'bg-indigo-500', label: 'Care' },
};

// Curated Unsplash fallbacks per category
const COVER_FALLBACKS: Record<string, string> = {
  dog:       'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&h=400&q=80',
  cat:       'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&h=400&q=80',
  nutrition: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=600&h=400&q=80',
  health:    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&h=400&q=80',
  training:  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&h=400&q=80',
  grooming:  'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=600&h=400&q=80',
  bird:      'https://images.unsplash.com/photo-1552728089-571ebd6a45ad?auto=format&fit=crop&w=600&h=400&q=80',
  default:   'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=600&h=400&q=80',
};

interface BlogCardProps {
  title: string;
  excerpt: string;
  authorName: string;
  authorCredential: string;
  date: string;
  slug: string;
  coverImageUrl?: string | null;
  readTimeMinutes?: number | null;
  tags?: string[];
  categoryName?: string | null;
  categorySlug?: string | null;
  isFeatured?: boolean;
}

export function BlogCard({
  title,
  excerpt,
  authorName,
  authorCredential,
  date,
  slug,
  coverImageUrl,
  readTimeMinutes,
  tags = [],
  categoryName,
  categorySlug,
  isFeatured = false,
}: BlogCardProps) {
  // Resolve category config
  const catKey = (categorySlug || categoryName || '').toLowerCase();
  const catConfig = CATEGORY_CONFIG[catKey] || CATEGORY_CONFIG.default;

  // Resolve cover image
  const imgSrc = coverImageUrl || COVER_FALLBACKS[catKey] || COVER_FALLBACKS.default;

  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    datePublished: date,
    image: imgSrc,
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: authorCredential,
    },
    keywords: tags.join(', '),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="group flex flex-col bg-card border border-border rounded-2xl app-card-feed overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-shadow duration-300 h-full"
      >
        {/* Cover Image */}
        <Link href={`/blog/${slug}`} className="block relative h-48 overflow-hidden bg-muted flex-shrink-0" tabIndex={-1} aria-hidden="true">
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge */}
          <span className={`absolute top-3 left-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm ${catConfig.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${catConfig.dot}`} />
            {catConfig.label}
          </span>

          {/* Read time badge */}
          {readTimeMinutes && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              {readTimeMinutes} min
            </span>
          )}

          {/* Featured ribbon */}
          {isFeatured && (
            <span className="absolute bottom-3 left-3 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
              ⭐ Featured
            </span>
          )}
        </Link>

        {/* Card Content */}
        <div className="flex flex-col flex-1 p-5">
          {/* Date */}
          <time dateTime={date} className="text-xs text-muted-foreground font-medium mb-2">
            {formattedDate}
          </time>

          {/* Title */}
          <h3 className="font-black text-base leading-snug text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 flex-1">
            <Link href={`/blog/${slug}`} className="stretched-link after:absolute after:inset-0">
              {title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {excerpt}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author row */}
          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
                {authorName.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{authorName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{authorCredential}</p>
              </div>
            </div>
            <span className="flex-shrink-0 flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400 text-xs font-bold group-hover:gap-1 transition-all">
              Read <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </motion.article>
    </>
  );
}
