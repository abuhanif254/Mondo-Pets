'use client';

import * as React from 'react';
import { subscribeToNewsletter } from '@/app/actions';
import { Mail, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export function NewsletterClient() {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    const formData = new FormData();
    formData.append('email', email);
    
    const result = await subscribeToNewsletter(formData);
    
    if (result.success) {
      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setErrorMessage(result.message || 'An error occurred.');
    }
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-10 text-white text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 shadow-xl shadow-emerald-900/20">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-md border border-white/30">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-3xl font-black mb-3">You're in!</h3>
        <p className="text-emerald-100 text-lg max-w-md mx-auto">
          Thanks for joining our community. Keep an eye on your inbox for exclusive deals and pet care tips.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-900 opacity-20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/10 border border-white/20 text-blue-100 text-xs font-bold tracking-wider mb-4">
            <Mail className="w-4 h-4" />
            Join the Club
          </div>
          <h3 className="text-3xl md:text-4xl font-black mb-3 leading-tight">Get 15% off your next order.</h3>
          <p className="text-blue-100 text-base md:text-lg max-w-lg">
            Subscribe to our newsletter for exclusive discounts, expert pet care advice, and early access to new arrivals.
          </p>
        </div>

        <div className="w-full md:w-[400px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all font-medium"
              />
            </div>
            
            {errorMessage && (
              <p className="text-red-300 text-sm font-medium">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !email.includes('@')}
              className="w-full bg-white text-indigo-700 font-bold py-4 px-6 rounded-xl hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Subscribe Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-xs text-blue-200 text-center mt-2 opacity-80">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
