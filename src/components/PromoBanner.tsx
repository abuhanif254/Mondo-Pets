'use client';

import * as React from 'react';
import { Tag, X, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';

interface Coupon {
  id: string;
  code: string;
  description: string;
  retailerName: string;
  discountValue: string;
  affiliateUrl: string;
}

export function PromoBanner({ coupon }: { coupon: Coupon | null }) {
  const [isVisible, setIsVisible] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  if (!coupon || !isVisible) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-primary text-primary-foreground relative z-50 overflow-hidden"
      >
        <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-center sm:justify-between text-sm">
          
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <Tag className="w-4 h-4 hidden sm:block" />
            <span className="font-bold">{coupon.retailerName}:</span>
            <span>{coupon.description}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-primary-foreground/10 rounded overflow-hidden border border-primary-foreground/20">
              <span className="px-3 py-1 font-mono font-bold tracking-wider">{coupon.code}</span>
              <button 
                onClick={handleCopy}
                className="px-3 py-1 bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors flex items-center justify-center border-l border-primary-foreground/20"
                title="Copy code"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <a 
              href={coupon.affiliateUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-bold hover:underline"
            >
              Shop Now <ExternalLink className="w-3 h-3" />
            </a>

            <button 
              onClick={() => setIsVisible(false)}
              className="ml-2 p-1 hover:bg-primary-foreground/20 rounded-full transition-colors hidden sm:block"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
