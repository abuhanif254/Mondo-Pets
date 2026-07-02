'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Loader2, Sparkles, RefreshCcw } from 'lucide-react';
import { getQuizRecommendations } from '@/app/actions';
import { ProductCard } from '@/components/ProductCard';

export function QuizClient({ locale }: { locale: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    petType: '',
    lifeStage: '',
    budget: '',
    category: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const questions = [
    {
      title: "Who are we shopping for?",
      field: 'petType',
      options: [
        { label: 'Dog 🐶', value: 'Dog' },
        { label: 'Cat 🐱', value: 'Cat' },
        { label: 'Bird 🦜', value: 'Bird' },
        { label: 'Other 🐾', value: 'Other' },
      ]
    },
    {
      title: "How old is your pet?",
      field: 'lifeStage',
      options: [
        { label: 'Puppy / Kitten (0-1y)', value: 'Puppy' },
        { label: 'Adult (1-7y)', value: 'Adult' },
        { label: 'Senior (7y+)', value: 'Senior' },
        { label: 'All Life Stages', value: 'All' },
      ]
    },
    {
      title: "What are you looking for?",
      field: 'category',
      options: [
        { label: 'Toys & Enrichment 🎾', value: 'toy' },
        { label: 'Food & Treats 🥩', value: 'food' },
        { label: 'Health & Wellness 🏥', value: 'health' },
        { label: 'Beds & Gear 🛏️', value: 'gear' },
      ]
    },
    {
      title: "What's your budget?",
      field: 'budget',
      options: [
        { label: 'Under $25', value: 'low' },
        { label: '$25 - $50', value: 'medium' },
        { label: 'Over $50', value: 'high' },
        { label: 'Show me everything!', value: 'all' },
      ]
    }
  ];

  const handleSelect = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      submitQuiz({ ...answers, [field]: value });
    }
  };

  const submitQuiz = async (finalAnswers: any) => {
    setLoading(true);
    setStep(questions.length); // Move to loading/results view
    
    // Convert 'all' budgets to no-filter if needed, or handle in action
    const req = {
      petType: finalAnswers.petType === 'Other' ? '' : finalAnswers.petType,
      lifeStage: finalAnswers.lifeStage === 'All' ? '' : finalAnswers.lifeStage,
      category: finalAnswers.category,
      budget: finalAnswers.budget === 'all' ? '' : finalAnswers.budget
    };

    const res = await getQuizRecommendations(req);
    setResults(res);
    setLoading(false);
  };

  const resetQuiz = () => {
    setAnswers({ petType: '', lifeStage: '', budget: '', category: '' });
    setResults(null);
    setStep(0);
  };

  return (
    <div className="max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center p-4 py-12">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm mb-4">
          <Sparkles className="w-4 h-4" /> AI Gift Finder
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Find the Perfect Product</h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Answer 4 quick questions and we'll instantly generate a personalized list of highly-rated products for your pet.
        </p>
      </div>

      {/* Quiz Container */}
      <div className="w-full max-w-2xl bg-card border border-border rounded-[2rem] shadow-xl p-6 md:p-10 relative overflow-hidden">
        
        {/* Progress Bar */}
        {step < questions.length && (
          <div className="absolute top-0 left-0 w-full h-1.5 bg-muted">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${(step / questions.length) * 100}%` }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {step < questions.length && (
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full justify-center"
            >
              <h2 className="text-2xl font-bold text-center mb-8">{questions[step].title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions[step].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(questions[step].field, opt.value)}
                    className="p-4 border-2 border-border rounded-2xl text-lg font-semibold hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all text-left flex items-center justify-between group"
                  >
                    {opt.label}
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:text-emerald-500 transition-all transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
              
              {step > 0 && (
                <button 
                  onClick={() => setStep(prev => prev - 1)}
                  className="mt-8 flex items-center justify-center gap-2 text-muted-foreground font-semibold hover:text-foreground transition-colors self-center"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
            </motion.div>
          )}

          {step === questions.length && loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-6" />
              <h2 className="text-2xl font-bold mb-2">Analyzing your answers...</h2>
              <p className="text-muted-foreground">Finding the best matches in our database.</p>
            </motion.div>
          )}

          {step === questions.length && !loading && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black mb-2">Your Perfect Matches! 🎉</h2>
                <p className="text-muted-foreground">
                  We found {results.length} highly-rated products that match your criteria.
                </p>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {results.map(product => (
                    <ProductCard 
                      key={product.id} 
                      id={product.id}
                      title={product.title}
                      price={Number(product.price)}
                      imageUrl={product.imageUrl || ''}
                      brand={product.brand}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-2xl">
                  <p className="font-bold text-lg mb-2">No exact matches found.</p>
                  <p className="text-muted-foreground mb-6">Try broadening your budget or category.</p>
                  <button 
                    onClick={resetQuiz}
                    className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-bold hover:bg-muted-foreground transition-colors"
                  >
                    <RefreshCcw className="w-4 h-4" /> Try Again
                  </button>
                </div>
              )}

              {results.length > 0 && (
                <div className="mt-10 flex justify-center">
                  <button 
                    onClick={resetQuiz}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold transition-colors"
                  >
                    <RefreshCcw className="w-4 h-4" /> Retake Quiz
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
