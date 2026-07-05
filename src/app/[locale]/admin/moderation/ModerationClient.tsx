'use client';

import { useState } from 'react';
import { approveReview, deleteReview, approveQuestion, deleteQuestion, answerQuestion } from '@/app/actions/moderation';
import { Check, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ModerationClient({ pendingReviews, pendingQuestions }: { pendingReviews: any[], pendingQuestions: any[] }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'questions'>('reviews');
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');

  const handleApproveReview = async (id: string) => {
    setIsProcessing(true);
    await approveReview(id);
    setIsProcessing(false);
    router.refresh();
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Delete this review permanently?')) return;
    setIsProcessing(true);
    await deleteReview(id);
    setIsProcessing(false);
    router.refresh();
  };

  const handleApproveQuestion = async (id: string) => {
    setIsProcessing(true);
    await approveQuestion(id);
    setIsProcessing(false);
    router.refresh();
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Delete this question permanently?')) return;
    setIsProcessing(true);
    await deleteQuestion(id);
    setIsProcessing(false);
    router.refresh();
  };

  const handleAnswerQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answeringQuestionId) return;
    setIsProcessing(true);
    await answerQuestion(answeringQuestionId, answerText);
    setAnsweringQuestionId(null);
    setAnswerText('');
    setIsProcessing(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Content Moderation Queue</h1>
      
      <div className="flex gap-4 border-b border-border pb-px">
        <button 
          onClick={() => setActiveTab('reviews')}
          className={`pb-2 font-medium border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Pending Reviews <span className="ml-2 bg-muted text-foreground px-2 py-0.5 rounded-full text-xs">{pendingReviews.length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('questions')}
          className={`pb-2 font-medium border-b-2 transition-colors ${activeTab === 'questions' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Pending Q&A <span className="ml-2 bg-muted text-foreground px-2 py-0.5 rounded-full text-xs">{pendingQuestions.length}</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {activeTab === 'reviews' && (
          <div className="divide-y divide-border">
            {pendingReviews.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Check className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No pending reviews to moderate. You're all caught up!</p>
              </div>
            ) : (
              pendingReviews.map((review) => (
                <div key={review.id} className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center text-amber-500 text-lg">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                        <h3 className="font-bold text-lg">{review.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        By <span className="font-semibold text-foreground">{review.authorName}</span> for <span className="text-primary font-medium">{review.product.title}</span>
                      </p>
                      <p className="text-foreground pt-2">{review.content}</p>
                      
                      {(review.pros || review.cons) && (
                        <div className="grid grid-cols-2 gap-4 pt-4">
                          {review.pros && <div><span className="text-emerald-600 font-bold block mb-1">Pros</span> <p className="text-sm bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded">{review.pros}</p></div>}
                          {review.cons && <div><span className="text-red-600 font-bold block mb-1">Cons</span> <p className="text-sm bg-red-50 dark:bg-red-950/20 p-2 rounded">{review.cons}</p></div>}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleApproveReview(review.id)}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button 
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-muted hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-600 font-medium rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="divide-y divide-border">
            {pendingQuestions.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Check className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No pending questions to moderate.</p>
              </div>
            ) : (
              pendingQuestions.map((q) => (
                <div key={q.id} className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-4 flex-1">
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">
                          Question by <span className="font-semibold text-foreground">{q.authorName}</span> regarding <span className="text-primary font-medium">{q.product.title}</span>
                        </p>
                        <h3 className="font-bold text-lg">{q.content}</h3>
                      </div>
                      
                      {answeringQuestionId === q.id ? (
                        <form onSubmit={handleAnswerQuestion} className="space-y-3 bg-muted/50 p-4 rounded-xl border border-border">
                          <label className="text-sm font-bold block">Write an Official Answer</label>
                          <textarea 
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            required
                            rows={3}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg resize-none"
                            placeholder="Type your answer here..."
                          />
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setAnsweringQuestionId(null)} className="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-md transition-colors">Cancel</button>
                            <button type="submit" disabled={isProcessing} className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                              Submit & Approve
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="text-sm text-amber-600 dark:text-amber-500 font-medium">
                          Status: Waiting for Answer/Approval
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {!answeringQuestionId && (
                        <>
                          <button 
                            onClick={() => { setAnsweringQuestionId(q.id); setAnswerText(''); }}
                            disabled={isProcessing}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" /> Answer
                          </button>
                          <button 
                            onClick={() => handleApproveQuestion(q.id)}
                            disabled={isProcessing}
                            className="flex items-center justify-center gap-2 px-4 py-2 border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 font-medium rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4" /> Approve Only
                          </button>
                          <button 
                            onClick={() => handleDeleteQuestion(q.id)}
                            disabled={isProcessing}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-muted hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-600 font-medium rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
