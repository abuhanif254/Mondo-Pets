import { Link } from '@/i18n/routing';
import { Globe, ArrowRight } from 'lucide-react';

import Image from 'next/image';

const TwitterIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

interface BlogAuthorCardProps {
  author: {
    id: string;
    name: string;
    credentials: string;
    bio: string | null;
    avatarUrl: string | null;
    twitterUrl: string | null;
    websiteUrl: string | null;
    expertise: string[];
  };
}

export function BlogAuthorCard({ author }: BlogAuthorCardProps) {
  if (!author) return null;

  return (
    <div className="bg-card border-y sm:border sm:rounded-3xl border-border p-6 sm:p-10 my-16 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="font-black text-sm text-foreground uppercase tracking-wider">About the Author</h3>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
        {/* Avatar */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 border-4 border-background shadow-lg flex items-center justify-center text-4xl font-extrabold text-indigo-700 relative">
          {author.avatarUrl ? (
            <Image 
              src={author.avatarUrl} 
              alt={author.name} 
              fill
              sizes="(max-width: 640px) 96px, 128px"
              className="object-cover"
              loading="lazy"
            />
          ) : (
            author.name.charAt(0)
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left space-y-4">
          <div>
            <h4 className="text-2xl font-black text-foreground">{author.name}</h4>
            <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mt-1">{author.credentials}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            {author.bio || `${author.name} is a valued contributor to Mondo Pets.`}
          </p>

          {/* Socials & Expertise */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border">
            
            <div className="flex items-center justify-center sm:justify-start gap-3">
              {author.twitterUrl && (
                <a href={author.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-[#1DA1F2] hover:text-white transition-colors" aria-label="Twitter">
                  <TwitterIcon className="w-4 h-4" />
                </a>
              )}
              {author.websiteUrl && (
                <a href={author.websiteUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-emerald-500 hover:text-white transition-colors" aria-label="Website">
                  <Globe className="w-4 h-4" />
                </a>
              )}
              
              {author.expertise && author.expertise.length > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-4 border-l border-border">
                  <span className="text-xs font-semibold text-muted-foreground">Expert in:</span>
                  <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded-full">{author.expertise[0]}</span>
                </div>
              )}
            </div>

            <Link href="/blog" className="inline-flex items-center justify-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:gap-2 transition-all">
              More by {author.name.split(' ')[0]} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
