import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Clock, Calendar } from 'lucide-react';

interface BlogPostHeroProps {
  title: string;
  category: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
    avatarUrl: string | null;
  };
  date: Date;
  readTimeMinutes: number | null;
  coverImageUrl: string | null;
}

export function BlogPostHero({ title, category, author, date, readTimeMinutes, coverImageUrl }: BlogPostHeroProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <header className="relative w-full bg-indigo-950 text-white overflow-hidden pb-8 pt-16 md:pb-12 md:pt-32">
      {/* Background Image with Parallax-feel */}
      {coverImageUrl && (
        <>
          <Image 
            src={coverImageUrl} 
            alt={title} 
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/60 to-transparent" />
        </>
      )}

      <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center space-y-6">
        
        {/* Category Pill */}
        <Link 
          href={`/blog?category=${category.slug}`}
          className="inline-flex items-center gap-1.5 bg-indigo-600/80 hover:bg-indigo-500 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-colors"
        >
          {category.name}
        </Link>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight md:leading-[1.1] text-balance">
          {title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-6 text-sm text-indigo-200 font-medium">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-500/50 border border-indigo-400/30 overflow-hidden flex items-center justify-center text-xs font-bold text-white relative">
              {author.avatarUrl ? (
                <Image src={author.avatarUrl} alt={author.name} fill sizes="32px" className="object-cover" />
              ) : (
                author.name.charAt(0)
              )}
            </div>
            <span className="text-white font-bold">{author.name}</span>
          </div>

          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-indigo-500/50" />

          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <time dateTime={date.toISOString()}>{formattedDate}</time>
          </div>

          {readTimeMinutes && (
            <>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{readTimeMinutes} min read</span>
              </div>
            </>
          )}

        </div>
      </div>
    </header>
  );
}
