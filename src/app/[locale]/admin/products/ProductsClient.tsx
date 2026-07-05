'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, ExternalLink } from 'lucide-react';
import { deleteProduct } from '@/app/actions/products';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export function ProductsClient({ 
  initialProducts, 
  totalPages = 1,
  currentPage = 1,
  currentSearch = ''
}: { 
  initialProducts: any[],
  totalPages?: number,
  currentPage?: number,
  currentSearch?: string
}) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [search, setSearch] = useState(currentSearch);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setIsProcessing(true);
    const result = await deleteProduct(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.message);
    }
    setIsProcessing(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/en/admin/products?search=${encodeURIComponent(search)}&page=1`);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/en/admin/products?search=${encodeURIComponent(currentSearch)}&page=${newPage}`);
  };

  const filteredProducts = initialProducts;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Link 
          href="/en/admin/products/new"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border-b border-border">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button type="submit" className="hidden">Search</button>
          </form>
          <div className="flex items-center gap-2">
            {/* Filters will go here */}
          </div>
        </div>
        
        {/* Desktop Table View */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/10 border-b border-border">
                <th className="px-6 py-4 font-semibold text-sm w-16">Image</th>
                <th className="px-6 py-4 font-semibold text-sm">Product Info</th>
                <th className="px-6 py-4 font-semibold text-sm">Category</th>
                <th className="px-6 py-4 font-semibold text-sm">Price & Links</th>
                <th className="px-6 py-4 font-semibold text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-muted rounded-md relative overflow-hidden flex-shrink-0 border border-border">
                        <Image src={product.imageUrl || '/placeholder.jpg'} alt={product.title} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground line-clamp-1" title={product.title}>{product.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 font-mono">{product.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-medium">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-emerald-600 dark:text-emerald-400">
                        {product.price ? `$${product.price}` : 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {product.amazonUrl && (
                          <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                            Amazon <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {product.chewyUrl && (
                          <a href={product.chewyUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                            Chewy <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.inStock ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/en/admin/products/${product.id}/edit`}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          disabled={isProcessing}
                          className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No products found.
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-lg relative overflow-hidden flex-shrink-0 border border-border">
                    <Image src={product.imageUrl || '/placeholder.jpg'} alt={product.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-foreground line-clamp-1 text-sm">{product.title}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate">{product.slug}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-border">
                  <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md text-[11px] font-medium">
                    {product.category.name}
                  </span>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    {product.price ? `$${product.price}` : 'N/A'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  {product.inStock ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                      Out of Stock
                    </span>
                  )}
                  <div className="flex gap-2">
                    {product.amazonUrl && (
                      <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-500 hover:underline flex items-center gap-0.5">
                        Amazon <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {product.chewyUrl && (
                      <a href={product.chewyUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-500 hover:underline flex items-center gap-0.5">
                        Chewy <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-2 pt-2 border-t border-border">
                  <Link 
                    href={`/en/admin/products/${product.id}/edit`}
                    className="flex-grow flex items-center justify-center gap-1.5 py-2 text-xs bg-muted/30 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors border border-border font-bold text-foreground"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    disabled={isProcessing}
                    className="flex-grow flex items-center justify-center gap-1.5 py-2 text-xs bg-muted/30 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 rounded-xl transition-colors border border-border disabled:opacity-50 font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 border border-border rounded-md text-sm disabled:opacity-50 hover:bg-muted"
              >
                Previous
              </button>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 border border-border rounded-md text-sm disabled:opacity-50 hover:bg-muted"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
