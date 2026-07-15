'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { clearCacheByTag } from './revalidate';

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true, blogs: true }
        }
      }
    });
  } catch (error) {
    console.error('Failed to get categories:', error);
    return [];
  }
}

export async function createCategory(data: { name: string; slug: string; description?: string }) {
  try {
    const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return { success: false, message: 'A category with this slug already exists.' };
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
      }
    });
    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    clearCacheByTag('admin-update');
    return { success: true, category };
  } catch (error: any) {
    console.error('Failed to create category:', error);
    return { success: false, message: error.message || 'Failed to create category.' };
  }
}

export async function updateCategory(id: string, data: { name: string; slug: string; description?: string }) {
  try {
    const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
    if (existing && existing.id !== id) {
      return { success: false, message: 'A category with this slug already exists.' };
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
      }
    });
    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    clearCacheByTag('admin-update');
    return { success: true, category };
  } catch (error: any) {
    console.error('Failed to update category:', error);
    return { success: false, message: error.message || 'Failed to update category.' };
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if category has products or blogs
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true, blogs: true }
        }
      }
    });

    if (!category) return { success: false, message: 'Category not found.' };

    if (category._count.products > 0 || category._count.blogs > 0) {
      return { 
        success: false, 
        message: `Cannot delete category. It has ${category._count.products} products and ${category._count.blogs} blogs attached. Please reassign or delete them first.` 
      };
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    clearCacheByTag('admin-update');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete category:', error);
    return { success: false, message: error.message || 'Failed to delete category.' };
  }
}
