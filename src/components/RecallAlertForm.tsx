'use client';

import { useState } from 'react';
import { subscribeToNewsletter } from '@/app/actions';
import { Loader2, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

export function RecallAlertForm() {
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
      // Specifically override the message to be recall-specific
      setStatus({ success: true, message: 'You are now subscribed to urgent recall alerts.' });
    }
  }

  return (
    <div className="bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-200 dark:border-rose-900 rounded-2xl p-6 md:p-8 mt-12 mb-8 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <ShieldAlert className="w-32 h-32 text-rose-500" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400 animate-pulse" />
            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-100">Get Free Pet Food Recall Alerts</h3>
          </div>
          <p className="text-rose-700/80 dark:text-rose-300/80 text-sm mb-4 leading-relaxed">
            Pet food recalls happen more often than you think. Don't wait until it's too late. Sign up to receive urgent email alerts the moment a dog or cat food is recalled by the FDA.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full md:w-80 flex flex-col gap-3">
          <input 
            type="email" 
            name="email"
            placeholder="Enter your email address..."
            required
            disabled={loading}
            className="w-full bg-white dark:bg-zinc-950 border border-rose-200 dark:border-rose-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl py-3 flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50 shadow-md shadow-rose-600/20"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Send Me Recall Alerts'
            )}
          </button>
          
          {status && (
            <div className={`flex items-center gap-2 text-sm mt-1 justify-center ${status.success ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
              {status.success ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="font-medium">{status.message}</span>
            </div>
          )}
          <p className="text-[10px] text-rose-700/60 dark:text-rose-300/60 text-center uppercase tracking-wider font-semibold">
            100% Free. No Spam. Unsubscribe Anytime.
          </p>
        </form>
      </div>
    </div>
  );
}
