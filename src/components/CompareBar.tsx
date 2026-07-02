'use client';

import * as React from 'react';
import { useCompare } from '@/context/CompareContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from '@/i18n/routing';

export function CompareBar() {
  const { items, removeItem, clearItems } = useCompare();
  const router = useRouter();

  if (items.length === 0) return null;

  const handleCompareClick = () => {
    const ids = items.map(i => i.id).join(',');
    router.push(`/compare?ids=${ids}`);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="bg-popover border border-border shadow-2xl rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
            
            <div className="flex items-center gap-4 flex-1 w-full overflow-x-auto pb-2 sm:pb-0">
              <div className="flex items-center gap-2 text-sm font-bold shrink-0">
                <Scale className="w-5 h-5 text-indigo-500" />
                <span className="hidden sm:inline">Compare</span>
                <span className="bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {items.length}
                </span>
              </div>
              
              <div className="h-8 w-px bg-border shrink-0 mx-2 hidden sm:block"></div>

              <div className="flex gap-3">
                {items.map((item) => (
                  <div key={item.id} className="relative group shrink-0 w-12 h-12 rounded-lg border border-border overflow-hidden bg-background">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {/* Empty slots placeholders */}
                {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="shrink-0 w-12 h-12 rounded-lg border border-dashed border-border flex items-center justify-center bg-muted/30">
                    <span className="text-muted-foreground text-xs font-medium">Add</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <button 
                onClick={clearItems}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
              >
                Clear
              </button>
              <button 
                onClick={handleCompareClick}
                disabled={items.length < 2}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  items.length >= 2 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Compare Now
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
