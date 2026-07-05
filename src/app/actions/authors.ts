'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAuthors() {
  try {
    return await prisma.author.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { blogs: true }
        }
      }
    });
  } catch (error) {
    console.error('Failed to get authors:', error);
    return [];
  }
}

export async function createAuthor(data: { 
  name: string; 
  credentials?: string; 
  avatarUrl?: string; 
  bio?: string; 
  twitterUrl?: string; 
  websiteUrl?: string; 
  expertise?: string[];
}) {
  try {
    const author = await prisma.author.create({
      data: {
        name: data.name,
        credentials: data.credentials || '',
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        twitterUrl: data.twitterUrl,
        websiteUrl: data.websiteUrl,
        expertise: data.expertise || [],
      }
    });
    revalidatePath('/admin/authors');
    revalidatePath('/admin');
    return { success: true, author };
  } catch (error: any) {
    console.error('Failed to create author:', error);
    return { success: false, message: error.message || 'Failed to create author.' };
  }
}

export async function updateAuthor(id: string, data: { 
  name: string; 
  credentials?: string; 
  avatarUrl?: string; 
  bio?: string; 
  twitterUrl?: string; 
  websiteUrl?: string; 
  expertise?: string[];
}) {
  try {
    const author = await prisma.author.update({
      where: { id },
      data: {
        name: data.name,
        credentials: data.credentials || '',
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        twitterUrl: data.twitterUrl,
        websiteUrl: data.websiteUrl,
        expertise: data.expertise || [],
      }
    });
    revalidatePath('/admin/authors');
    revalidatePath('/admin');
    return { success: true, author };
  } catch (error: any) {
    console.error('Failed to update author:', error);
    return { success: false, message: error.message || 'Failed to update author.' };
  }
}

export async function deleteAuthor(id: string) {
  try {
    // Check if author has blogs
    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        _count: {
          select: { blogs: true }
        }
      }
    });

    if (!author) return { success: false, message: 'Author not found.' };

    if (author._count.blogs > 0) {
      return { 
        success: false, 
        message: `Cannot delete author. They have ${author._count.blogs} blogs attached. Please reassign or delete them first.` 
      };
    }

    await prisma.author.delete({ where: { id } });
    revalidatePath('/admin/authors');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete author:', error);
    return { success: false, message: error.message || 'Failed to delete author.' };
  }
}
