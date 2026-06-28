'use server';

import prisma from '@/lib/prisma';

export async function getFeaturedToys() {
  try {
    return await prisma.product.findMany({
      where: { type: 'toy' },
      take: 4,
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Failed to fetch toys:', error);
    return [];
  }
}

export async function getFeaturedFood() {
  try {
    return await prisma.product.findMany({
      where: { type: 'food' },
      take: 4,
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Failed to fetch food:', error);
    return [];
  }
}

export async function getLatestBlogs() {
  try {
    return await prisma.blog.findMany({
      take: 3,
      orderBy: { publishedAt: 'desc' },
      include: {
        author: true,
        category: true
      }
    });
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
}
