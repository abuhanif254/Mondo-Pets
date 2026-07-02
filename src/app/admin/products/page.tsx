'use client';

import * as React from 'react';
import { Upload, RefreshCw, AlertCircle, CheckCircle2, Plus } from 'lucide-react';
import Link from 'next/link';

import { getAdminProducts } from '@/app/actions';

export default function AdminProductsPage() {
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [products, setProducts] = React.useState<{id: string, title: string, margin: string, clicks: number}[]>([]);

  React.useEffect(() => {
    async function load() {
      const data = await getAdminProducts();
      setProducts(data);
    }
    load();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/import/csv', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage({ type: 'success', text: `Successfully imported ${data.count} products!` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to import CSV' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleApiSync = async () => {
    setIsSyncing(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/import/sync', {
        method: 'POST',
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage({ type: 'success', text: `Successfully synced ${data.count} products from API!` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to sync API' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred during sync.' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products Management</h2>
          <p className="text-muted-foreground mt-1">Import products via CSV, sync with APIs, or add manually.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-800' 
          : 'bg-red-50 text-red-900 border border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* CSV Import */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Import via CSV</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Upload a CSV file with columns: <code>title, price, commissionRate, imageUrl, affiliateUrl, type, categorySlug</code>.
          </p>
          
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <RefreshCw className="w-8 h-8 mb-3 text-muted-foreground animate-spin" />
              ) : (
                <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
              )}
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">CSV (MAX. 5MB)</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".csv" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* API Sync */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold mb-4">API Synchronization</h3>
          <p className="text-sm text-muted-foreground mb-6 flex-1">
            Trigger a manual sync with configured affiliate networks (e.g. generic provider sync).
          </p>
          
          <button 
            onClick={handleApiSync}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Run API Sync'}
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold">Top Products (Sorted by Highest Margin)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Est. Margin</th>
                <th className="px-6 py-4 font-medium">Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{p.title}</td>
                  <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-medium">{p.margin}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
