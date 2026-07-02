import { QuizClient } from './QuizClient';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Gift Finder Quiz',
    description: 'Take our quick quiz to find the perfect gift, toy, or food for your pet.',
    alternates: {
      canonical: `https://mondopets.com/${locale}/quiz`
    }
  };
}

export default async function QuizPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  return (
    <div className="bg-muted/10 min-h-screen">
      <QuizClient locale={locale} />
    </div>
  );
}
