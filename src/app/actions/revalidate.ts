'use server';

import { updateTag } from 'next/cache';

export async function clearCacheByTag(tag: string) {
  updateTag(tag);
}
