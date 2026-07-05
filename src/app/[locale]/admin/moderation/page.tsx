import { ModerationClient } from './ModerationClient';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content Moderation | Admin',
};

export const dynamic = 'force-dynamic';

export default async function ModerationPage() {
  const [pendingReviews, pendingQuestions] = await Promise.all([
    prisma.review.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: 'asc' },
      include: {
        product: { select: { title: true } }
      }
    }),
    prisma.question.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: 'asc' },
      include: {
        product: { select: { title: true } }
      }
    })
  ]);

  return <ModerationClient pendingReviews={pendingReviews} pendingQuestions={pendingQuestions} />;
}
