import * as React from 'react';
import { getTopBannerAd } from '@/app/actions';

export async function TopAdBanner() {
  const ad = await getTopBannerAd();

  if (!ad) return null;

  return (
    <div style={{ backgroundColor: ad.bgColor, color: ad.textColor }} className="w-full text-center py-2 px-4 font-bold text-sm shadow-sm relative z-50">
      {ad.linkUrl ? (
        <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {ad.text}
        </a>
      ) : (
        <span>{ad.text}</span>
      )}
    </div>
  );
}
