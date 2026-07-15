'use client';

import { useEffect } from 'react';
import { incrementBlogViewCount } from '@/app/actions';

export function BlogViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Fire-and-forget view count increment on the client
    incrementBlogViewCount(slug).catch((err) => {
      console.error('Failed to increment view count:', err);
    });
  }, [slug]);

  return null;
}
