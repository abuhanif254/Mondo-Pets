import {useTranslations} from 'next-intl';
import {BlogCard} from '@/components/BlogCard';

export default function BlogPage() {
  const t = useTranslations('BlogPage');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-muted/50 py-12 px-6 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{t('title')}</h1>
          <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="container mx-auto max-w-3xl flex flex-col gap-8">
          <BlogCard 
            title="Recognizing Early Signs of Arthritis in Older Dogs"
            excerpt="Arthritis is common in senior dogs. Learn how to spot the early signs, including stiffness, reluctance to climb stairs, and behavioral changes, so you can consult your vet early."
            authorName="Dr. Sarah Jenkins"
            authorCredential="DVM, Veterinary Orthopedics"
            date="2026-06-25"
            slug="signs-of-arthritis-dogs"
          />
          <BlogCard 
            title="Proper Dietary Ratios for Feline Kidney Health"
            excerpt="Chronic kidney disease affects many older cats. A specialized diet low in phosphorus and moderate in high-quality protein can significantly slow disease progression."
            authorName="Dr. Marcus Thorne"
            authorCredential="DVM, Feline Nutrition Specialist"
            date="2026-06-20"
            slug="feline-kidney-health-diet"
          />
          <BlogCard 
            title="Treating Avian Feather Plucking Syndrome"
            excerpt="Feather plucking in birds can be medical or behavioral. We explore common medical causes including skin infections, parasites, and internal disease."
            authorName="Dr. Elena Rostova"
            authorCredential="DVM, Avian Specialist"
            date="2026-06-15"
            slug="treating-avian-feather-plucking"
          />
        </div>
      </main>
    </div>
  );
}
