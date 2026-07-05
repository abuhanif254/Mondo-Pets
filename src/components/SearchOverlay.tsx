'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, ExternalLink } from 'lucide-react';
import { searchGlobal } from '@/app/actions';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { triggerHaptic } from '@/lib/haptic';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const t = useTranslations('SearchOverlay');
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<{products: any[], blogs: any[]}>({ products: [], blogs: [] });
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults({ products: [], blogs: [] });
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  React.useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults({ products: [], blogs: [] });
        return;
      }
      setIsLoading(true);
      try {
        const data = await searchGlobal(query);
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex justify-center items-start pt-0 sm:pt-24 px-0 sm:px-4"
          onClick={() => {
            triggerHaptic(10);
            onClose();
          }}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full h-full sm:h-auto max-w-3xl bg-card border-none sm:border border-border rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-4 border-b border-border flex-shrink-0">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.length % 3 === 0) triggerHaptic(5);
                }}
                placeholder={t('placeholder')}
                className="flex-1 bg-transparent text-lg focus:outline-none placeholder:text-muted-foreground/60"
              />
              <button 
                onClick={() => {
                  triggerHaptic(10);
                  onClose();
                }}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 sm:max-h-[60vh] overflow-y-auto p-4 sm:p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>{t('searching')}</span>
                </div>
              ) : query.length >= 2 && results.products.length === 0 && results.blogs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {t('noResults')} "{query}"
                </div>
              ) : query.length < 2 ? (
                <div className="text-center py-12 text-muted-foreground/60">
                  {t('typeMore')}
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Products Results */}
                  {results.products.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">{t('products')}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {results.products.map(product => (
                          <Link 
                            key={product.id} 
                            href={`/products/${product.id}`} 
                            onClick={onClose}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-card hover:shadow-md border border-transparent hover:border-border transition-all group"
                          >
                            <div className="h-16 w-16 relative rounded-md overflow-hidden flex-shrink-0 bg-muted">
                              <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{product.title}</h4>
                              
                              <div className="flex items-center gap-2 mt-0.5 text-xs">
                                {product.petType && (
                                  <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-medium">
                                    {product.petType}
                                  </span>
                                )}
                                {product.editorRating && (
                                  <span className="flex items-center text-amber-500 font-bold">
                                    ★ {Number(product.editorRating).toFixed(1)}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-bold text-primary">${Number(product.price).toFixed(2)}</span>
                                {product.originalPrice && (
                                  <span className="text-xs text-muted-foreground line-through">${Number(product.originalPrice).toFixed(2)}</span>
                                )}
                              </div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blogs Results */}
                  {results.blogs.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">{t('articles')}</h3>
                      <div className="space-y-3">
                        {results.blogs.map(blog => (
                          <Link 
                            key={blog.id} 
                            href={`/blog/${blog.slug}`} 
                            onClick={onClose}
                            className="block p-4 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-all group"
                          >
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{blog.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{blog.excerpt}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
