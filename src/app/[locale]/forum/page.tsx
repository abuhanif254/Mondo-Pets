import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ForumClient } from '@/components/ForumClient';
import { CheckCircle, Clock } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Vet Q&A Forum',
    description: 'Ask questions and get verified answers from professional veterinarians.',
    openGraph: {
      title: 'Vet Q&A Forum | Mondo Pets',
      description: 'Ask questions and get verified answers from professional veterinarians.',
      url: `https://mondopets.com/${locale}/forum`,
    }
  };
}

const mockQuestions = [
  {
    id: '1',
    petType: 'Dog',
    question: 'My Golden Retriever (2 years old) has been scratching her ears constantly for the past two days. They look a bit red inside. Should I be worried?',
    askedAt: '2 hours ago',
    status: 'answered',
    vetAnswer: {
      vetName: 'Dr. Sarah Jenkins',
      credentials: 'DVM, Specialized in Dermatology',
      answer: 'Hi there! Constant scratching and redness are classic signs of an ear infection, which are very common in Golden Retrievers due to their floppy ears trapping moisture. While not an extreme emergency, it can be quite painful for her and can worsen if left untreated. I recommend booking an appointment with your local vet within the next 48 hours for a proper ear swab and prescription drops. In the meantime, avoid putting any water or over-the-counter cleaners in her ears, as that might irritate it further.',
      answeredAt: '1 hour ago'
    }
  },
  {
    id: '2',
    petType: 'Cat',
    question: 'How often should I brush my indoor cat\'s teeth? He hates it and fights me every time.',
    askedAt: '5 hours ago',
    status: 'answered',
    vetAnswer: {
      vetName: 'Dr. Michael Chen',
      credentials: 'DVM, Feline Specialist',
      answer: 'Dental care is tough with cats! Ideally, daily brushing is best, but aiming for 3-4 times a week is a realistic goal. Since he hates it, try transitioning slowly. Start by just letting him lick pet-safe toothpaste (never human toothpaste!) off your finger for a few days to build a positive association. Then gently rub his gums with a finger brush. If brushing remains impossible, look into VOHC-approved dental treats, water additives, or specialized dental diets to help manage plaque.',
      answeredAt: '4 hours ago'
    }
  },
  {
    id: '3',
    petType: 'Bird',
    question: 'My parakeet seems to be plucking his own chest feathers. What causes this?',
    askedAt: '10 hours ago',
    status: 'pending'
  }
];

export default async function ForumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="flex flex-col min-h-screen bg-muted/10">
      <header className="bg-primary/10 py-16 px-6 border-b border-border">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground">Vet Q&A Community</h1>
            <p className="text-lg text-muted-foreground">Ask our network of verified veterinarians your pet health questions, or browse advice given to other pet parents.</p>
          </div>
          <div className="shrink-0">
            <ForumClient />
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="container mx-auto max-w-4xl space-y-8">
          
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h2 className="text-xl font-bold">Recent Questions</h2>
            <div className="flex gap-2">
              <span className="text-sm px-3 py-1 rounded-full bg-primary text-primary-foreground font-medium cursor-pointer">All</span>
              <span className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium cursor-pointer hover:bg-secondary/80">Answered</span>
            </div>
          </div>

          <div className="space-y-6">
            {mockQuestions.map((q) => (
              <div key={q.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* User Question */}
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                      {q.petType}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {q.askedAt}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold leading-snug">{q.question}</h3>
                </div>

                {/* Vet Answer */}
                {q.status === 'answered' && q.vetAnswer ? (
                  <div className="bg-primary/5 p-6 sm:p-8 border-t border-primary/10">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
                        {q.vetAnswer.vetName.charAt(4)}
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <div>
                            <h4 className="font-bold text-foreground flex items-center gap-2">
                              {q.vetAnswer.vetName}
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                            </h4>
                            <p className="text-xs text-muted-foreground">{q.vetAnswer.credentials}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{q.vetAnswer.answeredAt}</span>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed">
                          {q.vetAnswer.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/30 p-4 border-t border-border flex items-center justify-center">
                    <p className="text-sm text-muted-foreground italic">A verified vet is reviewing this question...</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
        </div>
      </main>
    </div>
  );
}
