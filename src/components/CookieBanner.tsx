'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { X, Cookie } from 'lucide-react';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const hasConsented = localStorage.getItem('mondopets_cookie_consent');
    if (!hasConsented) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('mondopets_cookie_consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50 md:max-w-sm animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Cookie className="w-5 h-5 text-indigo-500" />
            Cookie Settings
          </div>
          <button 
            onClick={() => setShow(false)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          We use cookies to improve your experience, analyze site traffic, and serve tailored ads. By continuing to use our site, you agree to our 
          <Link href="/privacy" className="mx-1 text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            Privacy Policy
          </Link>.
        </p>

        <div className="flex items-center gap-3 mt-1">
          <button 
            onClick={handleAccept}
            className="flex-1 bg-foreground text-background font-bold py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            Accept All
          </button>
          <button 
            onClick={() => setShow(false)}
            className="flex-1 bg-muted text-muted-foreground font-bold py-2.5 rounded-xl text-sm hover:bg-muted/80 hover:text-foreground transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
