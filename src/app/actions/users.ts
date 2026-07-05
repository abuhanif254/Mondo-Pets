'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete user:', error);
    return { success: false, message: error.message };
  }
}

export async function addBadgeToUser(id: string, badge: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');
    
    if (!user.badges.includes(badge)) {
      await prisma.user.update({
        where: { id },
        data: { badges: [...user.badges, badge] }
      });
    }
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to add badge:', error);
    return { success: false, message: error.message };
  }
}

export async function removeBadgeFromUser(id: string, badge: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');
    
    await prisma.user.update({
      where: { id },
      data: { badges: user.badges.filter(b => b !== badge) }
    });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to remove badge:', error);
    return { success: false, message: error.message };
  }
}
