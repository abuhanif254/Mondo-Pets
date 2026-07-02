'use client';

import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { createPriceAlert } from '@/app/actions';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

export function PriceAlertButton({ productId, productName }: { productId: string, productName: string }) {
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    const targetEmail = user?.email || email;
    const result = await createPriceAlert(targetEmail, productId);
    
    setMessage(result.message);
    setIsSubmitting(false);

    if (result.success) {
      setTimeout(() => {
        setIsOpen(false);
        setMessage('');
        setEmail('');
      }, 2000);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 border border-primary/20 text-primary hover:bg-primary/5 py-2.5 rounded-xl font-semibold transition-colors"
      >
        <Bell className="w-4 h-4" /> Track Price Drops
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl p-6"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold mb-2">Set up a Price Alert</h2>
              <p className="text-muted-foreground mb-6">
                We'll email you immediately if the price drops for <strong>{productName}</strong>.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {!user && (
                  <div>
                    <input 
                      type="email" 
                      placeholder="Enter your email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}
                {user && (
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    Alerts will be sent to <strong>{user.email}</strong>.
                  </p>
                )}

                {message && (
                  <div className={`text-sm p-3 rounded-lg ${message.includes('success') || message.includes('created') || message.includes('already tracking') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {message}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Setting up...' : 'Create Alert'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
