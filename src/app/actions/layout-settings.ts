'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Top Banner
export async function getTopBanners() {
  return await prisma.topBannerAd.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createTopBanner(data: any) {
  try {
    const banner = await prisma.topBannerAd.create({ data });
    revalidatePath('/admin/layout-settings');
    revalidatePath('/');
    return { success: true, banner };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateTopBanner(id: string, data: any) {
  try {
    const banner = await prisma.topBannerAd.update({ where: { id }, data });
    revalidatePath('/admin/layout-settings');
    revalidatePath('/');
    return { success: true, banner };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteTopBanner(id: string) {
  try {
    await prisma.topBannerAd.delete({ where: { id } });
    revalidatePath('/admin/layout-settings');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// Hero Slides
export async function getHeroSlides() {
  return await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });
}

export async function createHeroSlide(data: any) {
  try {
    const slide = await prisma.heroSlide.create({ data });
    revalidatePath('/admin/layout-settings');
    revalidatePath('/');
    return { success: true, slide };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateHeroSlide(id: string, data: any) {
  try {
    const slide = await prisma.heroSlide.update({ where: { id }, data });
    revalidatePath('/admin/layout-settings');
    revalidatePath('/');
    return { success: true, slide };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteHeroSlide(id: string) {
  try {
    await prisma.heroSlide.delete({ where: { id } });
    revalidatePath('/admin/layout-settings');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// Listicles
export async function getListicles() {
  return await prisma.listicle.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createListicle(data: any) {
  try {
    const listicle = await prisma.listicle.create({ data });
    revalidatePath('/admin/layout-settings');
    revalidatePath('/');
    return { success: true, listicle };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateListicle(id: string, data: any) {
  try {
    const listicle = await prisma.listicle.update({ where: { id }, data });
    revalidatePath('/admin/layout-settings');
    revalidatePath('/');
    return { success: true, listicle };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteListicle(id: string) {
  try {
    await prisma.listicle.delete({ where: { id } });
    revalidatePath('/admin/layout-settings');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
