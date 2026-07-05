'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitContactForm } from '@/app/actions/contact';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await submitContactForm(formData);

    setStatus(result);
    setIsSubmitting(false);

    if (result.success) {
      form.reset();
    }
  }

  if (status?.success) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-3xl p-10 text-center flex flex-col items-center animate-in zoom-in duration-500">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-2xl font-black text-foreground mb-3">Message Sent!</h3>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          {status.message}
        </p>
        <button 
          onClick={() => setStatus(null)}
          className="mt-8 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status?.success === false && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-bold text-foreground">Full Name</label>
          <input 
            type="text" 
            id="name"
            name="name"
            required
            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Jane Doe"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-bold text-foreground">Email Address</label>
          <input 
            type="email" 
            id="email"
            name="email"
            required
            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-bold text-foreground">Subject (Optional)</label>
        <input 
          type="text" 
          id="subject"
          name="subject"
          className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="How can we help?"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-bold text-foreground">Message</label>
        <textarea 
          id="message"
          name="message"
          required
          rows={6}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Tell us what's on your mind..."
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full btn btn-primary btn-lg flex items-center justify-center gap-2 group"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Send Message
            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </button>
      <p className="text-xs text-center text-muted-foreground pt-4">
        We typically reply within 24-48 business hours.
      </p>
    </form>
  );
}
