'use client';

import { useState } from 'react';
import { submitReview, submitQuestion } from '@/app/actions';
import { Star, MessageCircle, User, MessageSquareText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/routing';

export function ProductUGC({ 
  productId, 
  initialReviews, 
  initialQuestions 
}: { 
  productId: string, 
  initialReviews: any[], 
  initialQuestions: any[] 
}) {
  const { user } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'reviews' | 'qna'>('reviews');
  const [reviews, setReviews] = useState(initialReviews);
  const [questions, setQuestions] = useState(initialQuestions);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  
  // QnA Form State
  const [questionContent, setQuestionContent] = useState('');

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    
    const res = await submitReview({
      productId,
      rating,
      title: reviewTitle,
      content: reviewContent,
      authorName: user.name,
      petType: user.pets?.[0]?.type || undefined // Default to their first pet's type if available
    });

    if (res.success && res.review) {
      setReviews([res.review, ...reviews]);
      setReviewTitle('');
      setReviewContent('');
      setRating(5);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    const res = await submitQuestion({
      productId,
      content: questionContent,
      authorName: user.name
    });

    if (res.success && res.question) {
      setQuestions([res.question, ...questions]);
      setQuestionContent('');
    }
  };

  return (
    <div className="mt-16 bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-sm">
      <div className="flex items-center gap-6 border-b border-border mb-8">
        <button 
          onClick={() => setActiveTab('reviews')}
          className={`pb-4 text-xl font-bold flex items-center gap-2 transition-colors \${activeTab === 'reviews' ? 'border-b-4 border-emerald-500 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Star className="w-5 h-5" /> Customer Reviews ({reviews.length})
        </button>
        <button 
          onClick={() => setActiveTab('qna')}
          className={`pb-4 text-xl font-bold flex items-center gap-2 transition-colors \${activeTab === 'qna' ? 'border-b-4 border-emerald-500 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <MessageCircle className="w-5 h-5" /> Q&A ({questions.length})
        </button>
      </div>

      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Write a Review */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-4">Write a Review</h3>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4 bg-muted/30 p-6 rounded-3xl border border-border">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button type="button" key={star} onClick={() => setRating(star)} className={`\${star <= rating ? 'text-amber-400' : 'text-border'}`}>
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2">Title</label>
                  <input required value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} type="text" className="w-full bg-background border border-border rounded-xl px-4 py-2" placeholder="Sum it up!" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2">Your Review</label>
                  <textarea required value={reviewContent} onChange={e => setReviewContent(e.target.value)} rows={4} className="w-full bg-background border border-border rounded-xl px-4 py-2 resize-none" placeholder="What did your pet think?"></textarea>
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors">Submit Review</button>
              </form>
            ) : (
              <div className="bg-muted/30 p-6 rounded-3xl border border-border text-center">
                <User className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                <p className="mb-4 text-sm">Please log in to write a review and help the community.</p>
                <button onClick={() => router.push('/login')} className="bg-foreground text-background font-bold py-2 px-6 rounded-full text-sm">Log In</button>
              </div>
            )}
          </div>

          {/* Read Reviews */}
          <div className="md:col-span-2 space-y-6">
            {reviews.length === 0 ? (
              <p className="text-muted-foreground italic">No reviews yet. Be the first to share your experience!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="border-b border-border pb-6 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex text-amber-400">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className={`w-4 h-4 \${star <= review.rating ? 'fill-current' : 'text-border fill-transparent'}`} />
                      ))}
                    </div>
                    <span className="font-bold">{review.title}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="font-semibold text-foreground">{review.authorName}</span>
                    {review.petType && <span className="bg-muted px-2 py-0.5 rounded text-xs">{review.petType} owner</span>}
                    <span>• {new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{review.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'qna' && (
        <div>
           {/* Ask a Question */}
           <div className="mb-10 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Have a Question?</h3>
            {user ? (
              <form onSubmit={handleQuestionSubmit} className="flex gap-4">
                <input required value={questionContent} onChange={e => setQuestionContent(e.target.value)} type="text" className="flex-1 bg-background border border-border rounded-xl px-4 py-3" placeholder="Ask the community about this product..." />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap">Ask</button>
              </form>
            ) : (
              <p className="text-sm text-muted-foreground">Please <button onClick={() => router.push('/login')} className="text-emerald-600 font-bold underline">log in</button> to ask a question.</p>
            )}
          </div>

          {/* Read Q&A */}
          <div className="space-y-6 max-w-3xl">
            {questions.length === 0 ? (
              <p className="text-muted-foreground italic">No questions yet. Ask away!</p>
            ) : (
              questions.map(q => (
                <div key={q.id} className="bg-muted/20 p-6 rounded-3xl border border-border">
                  <div className="flex items-start gap-4 mb-4">
                    <MessageSquareText className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-lg">{q.content}</p>
                      <p className="text-xs text-muted-foreground">Asked by {q.authorName} on {new Date(q.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {q.answer && (
                    <div className="ml-10 bg-background p-4 rounded-2xl border border-border relative">
                      <div className="absolute -left-2 top-4 w-4 h-4 bg-background border-l border-b border-border transform rotate-45"></div>
                      <p className="text-sm font-semibold mb-1">Expert Answer:</p>
                      <p className="text-sm text-muted-foreground">{q.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
