'use client';

import { useState } from 'react';
import { searchProductsForCompare } from '@/app/actions';
import Image from 'next/image';
import { Search, X, Check, XCircle, Star } from 'lucide-react';

type CompareProduct = {
  id: string;
  title: string;
  imageUrl: string | null;
  brand: string | null;
  price: number;
  editorRating: number | null;
  proteinPercent: number | null;
  fatPercent: number | null;
  fiberPercent: number | null;
  moisturePercent: number | null;
  ingredients: string | null;
  amazonUrl: string | null;
  chewyUrl: string | null;
  dietaryNeeds: string | null;
};

function ProductSearch({ 
  onSelect, 
  selectedProduct, 
  label 
}: { 
  onSelect: (p: CompareProduct | null) => void;
  selectedProduct: CompareProduct | null;
  label: string;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CompareProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    const res = await searchProductsForCompare(val);
    setResults(res as CompareProduct[]);
    setIsSearching(false);
  };

  if (selectedProduct) {
    return (
      <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden">
            <Image src={selectedProduct.imageUrl || '/placeholder.png'} alt={selectedProduct.title} fill className="object-contain" />
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase">{selectedProduct.brand}</div>
            <div className="font-bold text-foreground line-clamp-1">{selectedProduct.title}</div>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-full" onClick={() => onSelect(null)}>
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          placeholder={label}
          value={query}
          onChange={handleSearch}
          className="pl-10 h-14 w-full text-lg rounded-xl bg-card border border-border"
        />
      </div>
      
      {query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
          {isSearching && <div className="p-4 text-center text-muted-foreground">Searching...</div>}
          {!isSearching && results.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">No products found.</div>
          )}
          {results.map(product => (
            <button
              key={product.id}
              onClick={() => {
                onSelect(product);
                setQuery('');
                setResults([]);
              }}
              className="w-full text-left p-4 hover:bg-muted transition-colors flex items-center gap-4 border-b border-border last:border-0"
            >
              <div className="relative w-12 h-12 bg-white rounded overflow-hidden">
                <Image src={product.imageUrl || '/placeholder.png'} alt={product.title} fill className="object-contain" />
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase">{product.brand}</div>
                <div className="font-bold">{product.title}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CompareClient() {
  const [product1, setProduct1] = useState<CompareProduct | null>(null);
  const [product2, setProduct2] = useState<CompareProduct | null>(null);

  const formatPercent = (val: number | null) => val ? `${val}%` : 'N/A';
  const formatList = (str: string | null) => {
    if (!str) return 'N/A';
    return str.split(',').map(s => s.trim()).join(', ');
  };

  return (
    <div className="space-y-8">
      {/* Search Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductSearch 
          label="Search for the first product..." 
          selectedProduct={product1} 
          onSelect={setProduct1} 
        />
        <ProductSearch 
          label="Search for the second product..." 
          selectedProduct={product2} 
          onSelect={setProduct2} 
        />
      </div>

      {/* Comparison Matrix */}
      {product1 && product2 && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-3 border-b border-border divide-x divide-border">
            <div className="p-6 bg-muted/20 flex items-center justify-center font-bold text-lg text-muted-foreground">
              Feature
            </div>
            <div className="p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image src={product1.imageUrl || '/placeholder.png'} alt={product1.title} fill className="object-contain" />
              </div>
              <h3 className="font-bold text-lg line-clamp-2 h-14">{product1.title}</h3>
              <div className="mt-4 font-black text-2xl text-primary">${product1.price}</div>
            </div>
            <div className="p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image src={product2.imageUrl || '/placeholder.png'} alt={product2.title} fill className="object-contain" />
              </div>
              <h3 className="font-bold text-lg line-clamp-2 h-14">{product2.title}</h3>
              <div className="mt-4 font-black text-2xl text-primary">${product2.price}</div>
            </div>
          </div>

          <div className="divide-y divide-border">
            {/* Editor Rating */}
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="p-4 font-semibold text-muted-foreground flex items-center">Editor Rating</div>
              <div className="p-4 flex items-center justify-center gap-1 font-bold">
                {product1.editorRating ? (
                  <>
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> {product1.editorRating}
                  </>
                ) : 'N/A'}
              </div>
              <div className="p-4 flex items-center justify-center gap-1 font-bold">
                {product2.editorRating ? (
                  <>
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> {product2.editorRating}
                  </>
                ) : 'N/A'}
              </div>
            </div>

            {/* Protein */}
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="p-4 font-semibold text-muted-foreground flex items-center">Protein</div>
              <div className={`p-4 text-center font-bold ${(product1.proteinPercent || 0) > (product2.proteinPercent || 0) ? 'text-emerald-600' : ''}`}>
                {formatPercent(product1.proteinPercent)}
              </div>
              <div className={`p-4 text-center font-bold ${(product2.proteinPercent || 0) > (product1.proteinPercent || 0) ? 'text-emerald-600' : ''}`}>
                {formatPercent(product2.proteinPercent)}
              </div>
            </div>

            {/* Fat */}
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="p-4 font-semibold text-muted-foreground flex items-center">Fat</div>
              <div className="p-4 text-center font-bold">{formatPercent(product1.fatPercent)}</div>
              <div className="p-4 text-center font-bold">{formatPercent(product2.fatPercent)}</div>
            </div>

            {/* Fiber */}
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="p-4 font-semibold text-muted-foreground flex items-center">Fiber</div>
              <div className="p-4 text-center font-bold">{formatPercent(product1.fiberPercent)}</div>
              <div className="p-4 text-center font-bold">{formatPercent(product2.fiberPercent)}</div>
            </div>

            {/* Dietary Needs */}
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="p-4 font-semibold text-muted-foreground flex items-center">Dietary Profile</div>
              <div className="p-4 text-sm text-center">
                {product1.dietaryNeeds ? (
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
                    {product1.dietaryNeeds}
                  </span>
                ) : 'N/A'}
              </div>
              <div className="p-4 text-sm text-center">
                {product2.dietaryNeeds ? (
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
                    {product2.dietaryNeeds}
                  </span>
                ) : 'N/A'}
              </div>
            </div>

            {/* Top Ingredients */}
            <div className="grid grid-cols-3 divide-x divide-border bg-muted/5">
              <div className="p-4 font-semibold text-muted-foreground pt-6">Top Ingredients</div>
              <div className="p-4 text-sm text-muted-foreground leading-relaxed pt-6">
                {product1.ingredients ? (
                  <ul className="list-disc pl-4 space-y-1">
                    {product1.ingredients.split(',').slice(0, 5).map((ing, i) => (
                      <li key={i} className={i < 2 ? 'font-bold text-foreground' : ''}>{ing.trim()}</li>
                    ))}
                  </ul>
                ) : 'N/A'}
              </div>
              <div className="p-4 text-sm text-muted-foreground leading-relaxed pt-6">
                {product2.ingredients ? (
                  <ul className="list-disc pl-4 space-y-1">
                    {product2.ingredients.split(',').slice(0, 5).map((ing, i) => (
                      <li key={i} className={i < 2 ? 'font-bold text-foreground' : ''}>{ing.trim()}</li>
                    ))}
                  </ul>
                ) : 'N/A'}
              </div>
            </div>

            {/* CTA */}
            <div className="grid grid-cols-3 divide-x divide-border bg-muted/10">
              <div className="p-4"></div>
              <div className="p-6">
                {product1.amazonUrl ? (
                  <a href={`/api/go/${product1.id}?target=amazon`} target="_blank" className="block w-full bg-[#FF9900] text-black text-center py-3 rounded-xl font-bold hover:bg-[#FF9900]/90 transition-colors">
                    Check Price
                  </a>
                ) : (
                  <a href={`/en/products/${product1.id}`} className="block w-full bg-primary text-primary-foreground text-center py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                    View Product
                  </a>
                )}
              </div>
              <div className="p-6">
                {product2.amazonUrl ? (
                  <a href={`/api/go/${product2.id}?target=amazon`} target="_blank" className="block w-full bg-[#FF9900] text-black text-center py-3 rounded-xl font-bold hover:bg-[#FF9900]/90 transition-colors">
                    Check Price
                  </a>
                ) : (
                  <a href={`/en/products/${product2.id}`} className="block w-full bg-primary text-primary-foreground text-center py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                    View Product
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
      
      {!product1 && !product2 && (
        <div className="text-center py-24 bg-card rounded-2xl border border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Waiting for selection...</h3>
          <p className="text-muted-foreground mt-2">Search and select two products above to compare their stats.</p>
        </div>
      )}
    </div>
  );
}
