'use client';

import { useState, useEffect, useRef } from 'react';
import { ExternalLink, ChevronDown } from 'lucide-react';

interface MobileStickyBarProps {
  title: string;
  price: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Show bar only after user has scrolled past px from top */
  showAfterPx?: number;
}

/**
 * Mobile-only sticky CTA bar that slides up from the bottom
 * after the user scrolls past the hero section.
 * Hidden on lg+ screens via CSS (lg:hidden).
 */
export function MobileStickyBar({
  title,
  price,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  showAfterPx = 300,
}: MobileStickyBarProps) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > showAfterPx);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterPx]);

  if (!visible) return null;

  return (
    <div
      className="lg:hidden mobile-sticky-cta animate-fade-in-up"
      style={{ bottom: 'calc(64px + env(safe-area-inset-bottom))' }} // above mobile bottom nav
    >
      {/* Product snapshot */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate font-medium">{title}</p>
        <p className="text-base font-black text-foreground">{price}</p>
      </div>

      {/* CTAs */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {secondaryHref && secondaryLabel && (
          <a
            href={secondaryHref}
            target="_blank"
            rel="nofollow noopener sponsored"
            className="flex items-center gap-1 px-3 py-2.5 bg-muted text-foreground text-xs font-bold rounded-xl border border-border transition-colors hover:bg-primary/10 hover:text-primary"
          >
            {secondaryLabel}
          </a>
        )}
        <a
          href={primaryHref}
          target="_blank"
          rel="nofollow noopener sponsored"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white text-sm font-black rounded-xl shadow-lg shadow-primary/25 active:scale-95 transition-all"
        >
          {primaryLabel} <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
