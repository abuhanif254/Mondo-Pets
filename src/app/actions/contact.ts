'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitContactForm(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { success: false, message: 'Please fill out all required fields.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  try {
    await prisma.contactMessage.create({
      data: { name, email, subject, message }
    });
    return { 
      success: true, 
      message: "Thanks for reaching out! We've received your message and will get back to you shortly." 
    };
  } catch (error: any) {
    console.error('Failed to save contact message:', error);
    return { success: false, message: 'An error occurred: ' + (error.message || String(error)) };
  }
}

export async function getContactMessages() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return messages;
  } catch (error) {
    console.error('Failed to get contact messages:', error);
    return [];
  }
}

export async function markMessageAsRead(id: string) {
  try {
    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (message) {
      await prisma.contactMessage.update({
        where: { id },
        data: { isRead: !message.isRead }
      });
      revalidatePath('/admin/messages');
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error('Failed to update message:', error);
    return { success: false };
  }
}

export async function deleteMessage(id: string) {
  try {
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete message:', error);
    return { success: false };
  }
}
