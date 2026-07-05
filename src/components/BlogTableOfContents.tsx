'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function BlogTableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // We only parse the content on the client side since we need to inject IDs into the actual DOM
    // The main content area should have id="article-content"
    const article = document.getElementById('article-content');
    if (!article) return;

    const elements = article.querySelectorAll('h2, h3');
    const newHeadings: Heading[] = [];

    elements.forEach((el, index) => {
      // Create an ID if one doesn't exist
      if (!el.id) {
        el.id = `heading-${index}`;
      }
      newHeadings.push({
        id: el.id,
        text: el.textContent || '',
        level: parseInt(el.tagName.replace('H', ''), 10)
      });
    });

    setHeadings(newHeadings);

    // Setup intersection observer for active highlighting
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm sticky top-[100px]">
      <h3 className="font-black text-sm text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
        <span>Contents</span>
      </h3>
      <nav className="space-y-1">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`block text-sm transition-colors relative py-1
              ${heading.level === 3 ? 'ml-4' : 'font-semibold'}
              ${activeId === heading.id 
                ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {activeId === heading.id && (
              <motion.span
                layoutId="active-toc"
                className="absolute left-[-20px] top-[10px] w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
              />
            )}
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
