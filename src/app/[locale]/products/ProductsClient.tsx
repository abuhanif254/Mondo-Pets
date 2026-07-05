'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard';
import { Search, SlidersHorizontal, ChevronDown, Check, Cat, Dog, Bird, Fish, Rabbit, Bug, PawPrint, X } from 'lucide-react';
import { Category, Product } from '@prisma/client';
import { triggerHaptic } from '@/lib/haptic';

type ProductWithCategory = Product & {
  category: Category;
};

interface ProductsClientProps {
  initialProducts: ProductWithCategory[];
  brands: string[];
  productTypes: string[];
  petTypes: Category[];
}

const getPetIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('dog')) return Dog;
  if (n.includes('cat')) return Cat;
  if (n.includes('bird') || n.includes('chicken')) return Bird;
  if (n.includes('fish')) return Fish;
  if (n.includes('small') || n.includes('rabbit') || n.includes('guinea')) return Rabbit;
  if (n.includes('wild')) return Bug;
  return PawPrint;
};

export default function ProductsClient({ initialProducts, brands, productTypes, petTypes }: ProductsClientProps) {
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const toggleType = (t: string) => {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const toggleBrand = (b: string) => {
    setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  };

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      // Pet Type Filter
      if (selectedPet && p.categoryId !== selectedPet) return false;
      // Product Type Filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(p.type)) return false;
      // Brand Filter
      if (selectedBrands.length > 0 && (!p.brand || !selectedBrands.includes(p.brand))) return false;
      // Search
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !(p.brand || '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // newest
    });
  }, [initialProducts, selectedPet, selectedTypes, selectedBrands, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 app-section-dense">
      {/* Top Pet Bar Filter */}
      <div className="mb-6 px-4 sm:px-0">
        <h1 className="text-2xl font-black mb-4">Find the Perfect Product</h1>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-4 sm:px-0">
          <button
            onClick={() => setSelectedPet(null)}
            className={`flex flex-col items-center justify-center min-w-[90px] h-[90px] rounded-2xl transition-all snap-start shadow-sm border ${!selectedPet ? 'bg-primary text-primary-foreground border-primary shadow-primary/20 scale-105' : 'bg-background hover:bg-muted border-border'}`}
          >
            <PawPrint className="w-8 h-8 mb-2" />
            <span className="text-xs font-bold">All Pets</span>
          </button>
          
          {petTypes.map((pet) => {
            const Icon = getPetIcon(pet.name);
            const isSelected = selectedPet === pet.id;
            return (
              <button
                key={pet.id}
                onClick={() => setSelectedPet(isSelected ? null : pet.id)}
                className={`flex flex-col items-center justify-center min-w-[90px] h-[90px] rounded-2xl transition-all snap-start shadow-sm border ${isSelected ? 'bg-primary text-primary-foreground border-primary shadow-primary/20 scale-105' : 'bg-background hover:bg-muted border-border'}`}
              >
                <Icon className="w-8 h-8 mb-2" />
                <span className="text-xs font-bold truncate max-w-[80px] px-1">{pet.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-4 px-4">
          <button 
            onClick={() => {
              triggerHaptic(15);
              setIsMobileFiltersOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-background font-semibold shadow-sm active:scale-95 transition-transform"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {selectedTypes.length + selectedBrands.length > 0 && `(${selectedTypes.length + selectedBrands.length})`}
          </button>
          
          <select 
            value={sortBy} 
            onChange={(e) => {
              triggerHaptic(10);
              setSortBy(e.target.value as any);
            }}
            className="px-4 py-2 border border-border rounded-lg bg-background font-semibold shadow-sm text-sm outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Mobile Filter Bottom Sheet Drawer */}
        <AnimatePresence>
          {isMobileFiltersOpen && (
            <>
              {/* Dark blur overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bottom-sheet-overlay lg:hidden"
                onClick={() => {
                  triggerHaptic(8);
                  setIsMobileFiltersOpen(false);
                }}
              />
              
              {/* Bottom drawer container */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="bottom-sheet lg:hidden max-h-[85vh] flex flex-col"
              >
                <div className="bottom-sheet-handle" />
                
                <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                  <h2 className="text-lg font-black flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                    Filters {selectedTypes.length + selectedBrands.length > 0 && `(${selectedTypes.length + selectedBrands.length})`}
                  </h2>
                  <button 
                    onClick={() => {
                      triggerHaptic(10);
                      setIsMobileFiltersOpen(false);
                    }}
                    className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable sheet content */}
                <div className="flex-1 overflow-y-auto space-y-6 pb-6 pr-1">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Search products..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    />
                  </div>

                  {/* Categories */}
                  <div className="bg-muted/30 border border-border/60 rounded-2xl p-4">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">Category</h3>
                    <div className="space-y-3">
                      {productTypes.map(type => (
                        <label 
                          key={type} 
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => triggerHaptic(8)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => toggleType(type)}
                            className="hidden"
                          />
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedTypes.includes(type) ? 'bg-primary border-primary' : 'border-input bg-background'}`}>
                            {selectedTypes.includes(type) && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                          </div>
                          <span className="text-sm font-medium capitalize text-foreground/80">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Brands */}
                  {brands.length > 0 && (
                    <div className="bg-muted/30 border border-border/60 rounded-2xl p-4">
                      <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">Brand</h3>
                      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
                        {brands.map(brand => (
                          <label 
                            key={brand} 
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => triggerHaptic(8)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={() => toggleBrand(brand)}
                              className="hidden"
                            />
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(brand) ? 'bg-primary border-primary' : 'border-input bg-background'}`}>
                              {selectedBrands.includes(brand) && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                            </div>
                            <span className="text-sm font-medium text-foreground/80 line-clamp-1">{brand}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Apply/Clear drawer footers */}
                <div className="pt-4 border-t border-border flex gap-3">
                  <button 
                    onClick={() => {
                      triggerHaptic(12);
                      setSelectedTypes([]);
                      setSelectedBrands([]);
                      setSearchQuery('');
                    }}
                    className="flex-1 py-3 border border-border rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear All
                  </button>
                  <button 
                    onClick={() => {
                      triggerHaptic(15);
                      setIsMobileFiltersOpen(false);
                    }}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Sidebar Filters (Desktop Only) */}
        <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0 space-y-8">
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
              Category
            </h3>
            <div className="space-y-3">
              {productTypes.map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedTypes.includes(type) ? 'bg-primary border-primary' : 'border-input bg-background group-hover:border-primary'}`}>
                    {selectedTypes.includes(type) && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                  </div>
                  <span className="text-sm font-medium capitalize text-foreground/80 group-hover:text-foreground transition-colors">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {brands.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Brand</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(brand) ? 'bg-primary border-primary' : 'border-input bg-background group-hover:border-primary'}`}>
                      {selectedBrands.includes(brand) && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                    </div>
                    <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors line-clamp-1">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="hidden lg:flex items-center justify-between mb-6">
            <p className="text-muted-foreground font-medium">
              Showing <span className="text-foreground font-bold">{filteredProducts.length}</span> products
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-3 pr-8 py-1.5 border border-border rounded-lg bg-background font-semibold shadow-sm text-sm outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl border-dashed">
              <Search className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground text-center max-w-sm">We couldn't find any products matching your current filters. Try removing some filters or searching for something else.</p>
              <button 
                onClick={() => {
                  setSelectedPet(null);
                  setSelectedTypes([]);
                  setSelectedBrands([]);
                  setSearchQuery('');
                }}
                className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/90 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mobile-grid-2 px-4 sm:px-0">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(product => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    key={product.id}
                  >
                    <ProductCard 
                      id={product.id}
                      title={product.title}
                      price={Number(product.price)}
                      imageUrl={product.imageUrl || '/placeholder.png'}
                      affiliateUrl={product.affiliateUrl || undefined}
                      brand={product.brand || undefined}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
