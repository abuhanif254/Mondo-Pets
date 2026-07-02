'use client';

import * as React from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';

interface SidebarFiltersProps {
  categories: { id: string; name: string; slug: string }[];
  currentCategorySlug?: string;
  basePath: string; // e.g. '/toys' or '/food'
}

export function SidebarFilters({ categories, currentCategorySlug, basePath }: SidebarFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current filters
  const sort = searchParams.get('sort') || '';
  const brand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const lifeStage = searchParams.get('lifeStage') || '';
  const petType = searchParams.get('petType') || '';
  const minRating = searchParams.get('minRating') || '';

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  };

  const handleFilterChange = (name: string, value: string) => {
    const queryString = createQueryString(name, value);
    router.push(`${pathname}?${queryString}`);
  };

  const handlePriceRangeChange = (min: string, max: string) => {
    let params = new URLSearchParams(searchParams.toString());
    if (min) params.set('minPrice', min); else params.delete('minPrice');
    if (max) params.set('maxPrice', max); else params.delete('maxPrice');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
      
      {/* Categories */}
      <div>
        <h3 className="font-bold text-lg mb-4">Categories</h3>
        <div className="flex flex-col space-y-2">
          <button 
            onClick={() => router.push(basePath + (sort ? `?sort=${sort}` : ''))}
            className={`text-left text-sm ${!currentCategorySlug ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => router.push(`${basePath}/${cat.slug}${sort ? `?sort=${sort}` : ''}`)}
              className={`text-left text-sm ${currentCategorySlug === cat.slug ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground transition-colors'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="font-bold text-lg mb-4">Sort By</h3>
        <div className="flex flex-col space-y-2">
          <button onClick={() => handleFilterChange('sort', '')} className={`text-left text-sm ${!sort ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
            Newest First
          </button>
          <button onClick={() => handleFilterChange('sort', 'most_popular')} className={`text-left text-sm ${sort === 'most_popular' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
            Most Popular
          </button>
          <button onClick={() => handleFilterChange('sort', 'biggest_discount')} className={`text-left text-sm ${sort === 'biggest_discount' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
            Biggest Discount
          </button>
          <button onClick={() => handleFilterChange('sort', 'price_asc')} className={`text-left text-sm ${sort === 'price_asc' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
            Price: Low to High
          </button>
          <button onClick={() => handleFilterChange('sort', 'price_desc')} className={`text-left text-sm ${sort === 'price_desc' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
            Price: High to Low
          </button>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-lg mb-4">Price Range</h3>
        <div className="flex flex-col space-y-2">
          <button onClick={() => handlePriceRangeChange('', '')} className={`text-left text-sm flex items-center gap-2 ${!minPrice && !maxPrice ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
            <span className={`w-3 h-3 rounded-full border ${!minPrice && !maxPrice ? 'border-primary bg-primary' : 'border-muted-foreground'}`} /> Any Price
          </button>
          <button onClick={() => handlePriceRangeChange('', '25')} className={`text-left text-sm flex items-center gap-2 ${!minPrice && maxPrice === '25' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
            <span className={`w-3 h-3 rounded-full border ${!minPrice && maxPrice === '25' ? 'border-primary bg-primary' : 'border-muted-foreground'}`} /> Under $25
          </button>
          <button onClick={() => handlePriceRangeChange('25', '50')} className={`text-left text-sm flex items-center gap-2 ${minPrice === '25' && maxPrice === '50' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
            <span className={`w-3 h-3 rounded-full border ${minPrice === '25' && maxPrice === '50' ? 'border-primary bg-primary' : 'border-muted-foreground'}`} /> $25 - $50
          </button>
          <button onClick={() => handlePriceRangeChange('50', '')} className={`text-left text-sm flex items-center gap-2 ${minPrice === '50' && !maxPrice ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
            <span className={`w-3 h-3 rounded-full border ${minPrice === '50' && !maxPrice ? 'border-primary bg-primary' : 'border-muted-foreground'}`} /> Over $50
          </button>
        </div>
      </div>

      {/* Editor Rating */}
      <div>
        <h3 className="font-bold text-lg mb-4">Editor Rating</h3>
        <div className="flex flex-col space-y-2">
          {[
            { value: '', label: 'Any Rating' },
            { value: '4', label: '4+ Stars' },
            { value: '4.5', label: '4.5+ Stars' },
            { value: '5', label: '5 Stars Only' }
          ].map((rating) => {
            const isActive = minRating === rating.value;
            return (
              <button 
                key={rating.value}
                onClick={() => handleFilterChange('minRating', rating.value)} 
                className={`text-left text-sm flex items-center gap-2 ${isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <span className={`w-3 h-3 rounded-full border ${isActive ? 'border-primary bg-primary' : 'border-muted-foreground'}`} /> {rating.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pet Type */}
      <div>
        <h3 className="font-bold text-lg mb-4">Pet Type</h3>
        <div className="flex flex-col space-y-2">
          {['Dog', 'Cat', 'Bird', 'Small Pet'].map((type) => {
            const isActive = petType === type;
            return (
              <button 
                key={type}
                onClick={() => handleFilterChange('petType', isActive ? '' : type)} 
                className={`text-left text-sm flex items-center gap-2 ${isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <span className={`w-4 h-4 rounded border flex items-center justify-center ${isActive ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                  {isActive && <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-white"><path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </span>
                {type}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-4">Life Stage</h3>
        <div className="flex flex-col space-y-2">
          {['Puppy/Kitten', 'Adult', 'Senior'].map((stage) => {
            const isActive = lifeStage === stage;
            return (
              <button 
                key={stage}
                onClick={() => handleFilterChange('lifeStage', isActive ? '' : stage)} 
                className={`text-left text-sm flex items-center gap-2 ${isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <span className={`w-4 h-4 rounded border flex items-center justify-center ${isActive ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                  {isActive && <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-white"><path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </span>
                {stage}
              </button>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
