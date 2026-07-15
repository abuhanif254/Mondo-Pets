'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { clearCacheByTag } from './revalidate';

export async function createBlog(data: any) {
  try {
    const existing = await prisma.blog.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return { success: false, message: 'A blog post with this slug already exists.' };
    }

    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImageUrl: data.coverImageUrl,
        readTimeMinutes: data.readTimeMinutes ? parseInt(data.readTimeMinutes) : null,
        tags: data.tags || [],
        isFeatured: data.isFeatured ?? false,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        authorId: data.authorId,
        categoryId: data.categoryId,
      }
    });
    
    revalidatePath('/admin/blogs');
    revalidatePath('/admin/categories');
    revalidatePath('/admin/authors');
    revalidatePath('/admin');
    clearCacheByTag('admin-update');
    return { success: true, blog };
  } catch (error: any) {
    console.error('Failed to create blog:', error);
    return { success: false, message: error.message || 'Failed to create blog.' };
  }
}

export async function updateBlog(id: string, data: any) {
  try {
    const existing = await prisma.blog.findUnique({ where: { slug: data.slug } });
    if (existing && existing.id !== id) {
      return { success: false, message: 'A blog post with this slug already exists.' };
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImageUrl: data.coverImageUrl,
        readTimeMinutes: data.readTimeMinutes ? parseInt(data.readTimeMinutes) : null,
        tags: data.tags || [],
        isFeatured: data.isFeatured ?? false,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        authorId: data.authorId,
        categoryId: data.categoryId,
      }
    });

    revalidatePath('/admin/blogs');
    revalidatePath('/admin/categories');
    revalidatePath('/admin/authors');
    revalidatePath('/admin');
    clearCacheByTag('admin-update');
    return { success: true, blog };
  } catch (error: any) {
    console.error('Failed to update blog:', error);
    return { success: false, message: error.message || 'Failed to update blog.' };
  }
}

export async function deleteBlog(id: string) {
  try {
    await prisma.blog.delete({ where: { id } });
    revalidatePath('/admin/blogs');
    revalidatePath('/admin/categories');
    revalidatePath('/admin/authors');
    revalidatePath('/admin');
    clearCacheByTag('admin-update');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete blog:', error);
    return { success: false, message: error.message || 'Failed to delete blog.' };
  }
}
