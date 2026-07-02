'use client';

import { useState } from 'react';
import { subscribeToNewsletter } from '@/app/actions';
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export function NewsletterForm({ translations }: { translations: any }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const result = await subscribeToNewsletter(formData);
    
    setStatus(result);
    setLoading(false);
    
    if (result.success) {
      e.currentTarget.reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="relative">
        <input 
          type="email" 
          name="email"
          placeholder={translations.placeholder || "Enter your email..."}
          required
          disabled={loading}
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="absolute right-1 top-1 bottom-1 aspect-square bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
          aria-label={translations.button || "Subscribe"}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {status && (
        <div className={`flex items-center gap-2 text-sm px-1 ${status.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
          {status.success ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{status.message}</span>
        </div>
      )}
    </form>
  );
}
