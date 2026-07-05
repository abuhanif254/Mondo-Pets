'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createProduct(data: any) {
  try {
    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: data.price ? parseFloat(data.price) : 0,
        currency: data.currency || 'USD',
        commissionRate: data.commissionRate ? parseFloat(data.commissionRate) : null,
        estimatedMargin: data.estimatedMargin ? parseFloat(data.estimatedMargin) : null,
        brand: data.brand,
        lifeStage: data.lifeStage,
        dietaryNeeds: data.dietaryNeeds,
        imageUrl: data.imageUrl,
        amazonUrl: data.amazonUrl,
        amazonASIN: data.amazonASIN,
        inStock: data.inStock ?? true,
        chewyUrl: data.chewyUrl,
        affiliateUrl: data.affiliateUrl,
        type: data.type,
        petType: data.petType,
        ingredients: data.ingredients,
        proteinPercent: data.proteinPercent ? parseFloat(data.proteinPercent) : null,
        fatPercent: data.fatPercent ? parseFloat(data.fatPercent) : null,
        fiberPercent: data.fiberPercent ? parseFloat(data.fiberPercent) : null,
        moisturePercent: data.moisturePercent ? parseFloat(data.moisturePercent) : null,
        caloricContent: data.caloricContent,
        editorRating: data.editorRating ? parseFloat(data.editorRating) : null,
        categoryId: data.categoryId,
      }
    });
    
    revalidatePath('/admin/products');
    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    return { success: true, product };
  } catch (error: any) {
    console.error('Failed to create product:', error);
    return { success: false, message: error.message || 'Failed to create product.' };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: data.price ? parseFloat(data.price) : 0,
        currency: data.currency || 'USD',
        commissionRate: data.commissionRate ? parseFloat(data.commissionRate) : null,
        estimatedMargin: data.estimatedMargin ? parseFloat(data.estimatedMargin) : null,
        brand: data.brand,
        lifeStage: data.lifeStage,
        dietaryNeeds: data.dietaryNeeds,
        imageUrl: data.imageUrl,
        amazonUrl: data.amazonUrl,
        amazonASIN: data.amazonASIN,
        inStock: data.inStock ?? true,
        chewyUrl: data.chewyUrl,
        affiliateUrl: data.affiliateUrl,
        type: data.type,
        petType: data.petType,
        ingredients: data.ingredients,
        proteinPercent: data.proteinPercent ? parseFloat(data.proteinPercent) : null,
        fatPercent: data.fatPercent ? parseFloat(data.fatPercent) : null,
        fiberPercent: data.fiberPercent ? parseFloat(data.fiberPercent) : null,
        moisturePercent: data.moisturePercent ? parseFloat(data.moisturePercent) : null,
        caloricContent: data.caloricContent,
        editorRating: data.editorRating ? parseFloat(data.editorRating) : null,
        categoryId: data.categoryId,
      }
    });

    revalidatePath('/admin/products');
    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    return { success: true, product };
  } catch (error: any) {
    console.error('Failed to update product:', error);
    return { success: false, message: error.message || 'Failed to update product.' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath('/admin/products');
    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete product:', error);
    return { success: false, message: error.message || 'Failed to delete product.' };
  }
}
