'use client';

import * as React from 'react';
import { generateSeoContent } from '@/app/actions';
import { Bot, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AutoContentClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = React.useState(initialProducts);
  const [processingId, setProcessingId] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<Record<string, { success: boolean; message: string }>>({});
  const router = useRouter();

  const handleGenerate = async (id: string) => {
    setProcessingId(id);
    const res = await generateSeoContent(id);
    
    setResults(prev => ({
      ...prev,
      [id]: res
    }));
    
    if (res.success) {
      // Remove from the 'needs SEO' list conceptually, but for now we just show success
      setTimeout(() => {
        setProducts(prev => prev.filter(p => p.id !== id));
        router.refresh();
      }, 2000);
    }
    
    setProcessingId(null);
  };

  const generateAll = async () => {
    for (const p of products) {
      if (!results[p.id]?.success) {
        await handleGenerate(p.id);
      }
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-muted/30 flex justify-between items-center">
        <h2 className="font-bold flex items-center gap-2">
          <Bot className="w-5 h-5 text-emerald-600" />
          Products Needing SEO Content ({products.length})
        </h2>
        
        {products.length > 0 && (
          <button 
            onClick={generateAll}
            disabled={!!processingId}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
          >
            Generate All
          </button>
        )}
      </div>

      <div className="divide-y divide-border">
        {products.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">Every product in your catalog has an SEO description.</p>
          </div>
        ) : (
          products.map(p => (
            <div key={p.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg">{p.title}</h3>
                <p className="text-sm text-muted-foreground capitalize mb-2">{p.type}</p>
                <p className="text-sm bg-muted text-muted-foreground px-2 py-1 rounded w-fit italic">
                  {p.description ? 'Description too short' : 'Missing description'}
                </p>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                {results[p.id] && (
                  <span className={`text-sm font-semibold flex items-center gap-1 ${results[p.id].success ? 'text-emerald-600' : 'text-destructive'}`}>
                    {results[p.id].success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {results[p.id].message}
                  </span>
                )}
                <button
                  onClick={() => handleGenerate(p.id)}
                  disabled={!!processingId || results[p.id]?.success}
                  className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50 flex items-center gap-2 w-36 justify-center"
                >
                  {processingId === p.id ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                  ) : results[p.id]?.success ? (
                    'Generated!'
                  ) : (
                    'Generate AI'
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
