'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { clearCacheByTag } from './revalidate';

export async function approveReview(id: string) {
  try {
    await prisma.review.update({
      where: { id },
      data: { isApproved: true }
    });
    revalidatePath('/admin/moderation');
    // Also revalidate the product page where reviews are displayed
    clearCacheByTag('admin-update');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to approve review:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteReview(id: string) {
  try {
    await prisma.review.delete({
      where: { id }
    });
    revalidatePath('/admin/moderation');
    clearCacheByTag('admin-update');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete review:', error);
    return { success: false, message: error.message };
  }
}

export async function approveQuestion(id: string) {
  try {
    await prisma.question.update({
      where: { id },
      data: { isApproved: true }
    });
    revalidatePath('/admin/moderation');
    clearCacheByTag('admin-update');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to approve question:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteQuestion(id: string) {
  try {
    await prisma.question.delete({
      where: { id }
    });
    revalidatePath('/admin/moderation');
    clearCacheByTag('admin-update');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete question:', error);
    return { success: false, message: error.message };
  }
}

export async function answerQuestion(id: string, answer: string) {
  try {
    await prisma.question.update({
      where: { id },
      data: { answer, isApproved: true } // Answering implicitly approves it
    });
    revalidatePath('/admin/moderation');
    clearCacheByTag('admin-update');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to answer question:', error);
    return { success: false, message: error.message };
  }
}
