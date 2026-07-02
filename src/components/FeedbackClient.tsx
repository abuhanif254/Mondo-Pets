'use client';

import * as React from 'react';
import { submitSiteFeedback } from '@/app/actions';
import { Star, MessageSquareQuote, CheckCircle2, Loader2, Send } from 'lucide-react';

export function FeedbackClient({ initialFeedback }: { initialFeedback: any[] }) {
  const [feedbackList, setFeedbackList] = React.useState(initialFeedback);
  const [rating, setRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [content, setContent] = React.useState('');
  const [authorName, setAuthorName] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !authorName) return;
    
    setIsSubmitting(true);
    const result = await submitSiteFeedback({ rating, content, authorName });
    if (result.success && result.feedback) {
      setSuccess(true);
      setFeedbackList([result.feedback, ...feedbackList].slice(0, 4));
      setContent('');
      setAuthorName('');
      setRating(5);
      setTimeout(() => setSuccess(false), 4000);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Feedback Display Column */}
      <div className="lg:col-span-2 space-y-6">
        {feedbackList.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border border-dashed border-border/50 rounded-2xl bg-muted/20">
            No feedback yet. Be the first to share your thoughts!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {feedbackList.map((fb) => (
              <div key={fb.id} className="relative bg-card border border-border/50 rounded-2xl p-6 shadow-sm overflow-hidden group">
                {/* Decorative quote mark */}
                <MessageSquareQuote className="absolute top-4 right-4 w-12 h-12 text-muted/20 -z-0 group-hover:scale-110 transition-transform duration-500" />
                <div className="relative z-10 flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= fb.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`} 
                    />
                  ))}
                </div>
                <p className="relative z-10 text-foreground text-sm leading-relaxed mb-4 line-clamp-4">
                  "{fb.content}"
                </p>
                <div className="relative z-10 font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  - {fb.authorName}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Give Feedback Form Column */}
      <div className="lg:col-span-1">
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-md sticky top-24">
          <h4 className="text-lg font-bold mb-1">Give Feedback</h4>
          <p className="text-sm text-muted-foreground mb-6">How was your experience with Mondo Pets?</p>
          
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h5 className="font-bold text-lg text-foreground">Thank You!</h5>
              <p className="text-muted-foreground text-sm">Your feedback helps us improve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star 
                        className={`w-7 h-7 ${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted/50'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Your Name</label>
                <input 
                  type="text" 
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  placeholder="e.g. Sarah J."
                  required
                  className="w-full bg-background border border-border/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Feedback</label>
                <textarea 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Tell us what you think..."
                  required
                  rows={4}
                  className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !content || !authorName}
                className="w-full bg-foreground text-background font-bold py-3 px-4 rounded-xl hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Submit Feedback
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
