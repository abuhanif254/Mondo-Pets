import { LayoutSettingsClient } from './LayoutSettingsClient';
import { getTopBanners, getHeroSlides, getListicles } from '@/app/actions/layout-settings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Layout Settings | Admin',
};

export const dynamic = 'force-dynamic';

export default async function LayoutSettingsPage() {
  const [banners, slides, listicles] = await Promise.all([
    getTopBanners(),
    getHeroSlides(),
    getListicles()
  ]);

  // Convert Decimals to strings for the client
  const serializedListicles = listicles.map(l => ({
    ...l,
    minRating: l.minRating?.toString() || null,
  }));

  return <LayoutSettingsClient banners={banners} slides={slides} listicles={serializedListicles} />;
}
