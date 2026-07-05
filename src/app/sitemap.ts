import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import prisma from '@/lib/prisma';

const BASE_URL = 'https://mondopets.com';
const LOCALES  = routing.locales as readonly string[];

// Static routes with SEO priority tiers
const STATIC_ROUTES: Array<{ path: string; priority: number; changeFreq: MetadataRoute.Sitemap[0]['changeFrequency'] }> = [
  { path: '',             priority: 1.0, changeFreq: 'daily'   }, // Homepage
  { path: '/blog',        priority: 0.9, changeFreq: 'daily'   }, // Blog hub
  { path: '/products',    priority: 0.9, changeFreq: 'daily'   }, // Product catalog
  { path: '/deals',       priority: 0.9, changeFreq: 'daily'   }, // Deals page
  { path: '/brands',      priority: 0.8, changeFreq: 'weekly'  },
  { path: '/toys',        priority: 0.8, changeFreq: 'daily'   },
  { path: '/food',        priority: 0.8, changeFreq: 'daily'   },
  { path: '/care',        priority: 0.7, changeFreq: 'weekly'  },
  { path: '/compare',     priority: 0.6, changeFreq: 'weekly'  },
  { path: '/forum',       priority: 0.6, changeFreq: 'daily'   },
  { path: '/tools',       priority: 0.6, changeFreq: 'monthly' },
  { path: '/methodology', priority: 0.5, changeFreq: 'monthly' },
  { path: '/quiz',        priority: 0.5, changeFreq: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // ── 1. STATIC ROUTES ──────────────────────────────────────────
  for (const { path, priority, changeFreq } of STATIC_ROUTES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: changeFreq,
        priority,
      });
    }
  }

  // ── 2. DYNAMIC DATA — parallel fetch ──────────────────────────
  const [categories, blogs, products, brands] = await Promise.all([
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.blog.findMany({
      select: { slug: true, updatedAt: true, isFeatured: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.product.findMany({
      select: { id: true, updatedAt: true, editorRating: true },
      orderBy: { updatedAt: 'desc' },
      take: 500, // Cap to avoid huge sitemap
    }),
    prisma.brandProfile.findMany({ select: { slug: true, updatedAt: true } }).catch(() => [])
  ]);

  // ── 3. CATEGORY PAGES (food/dog, toys/cat, shop/…) ─────────────
  for (const cat of categories) {
    for (const locale of LOCALES) {
      entries.push(
        { url: `${BASE_URL}/${locale}/food/${cat.slug}`,  lastModified: cat.updatedAt, changeFrequency: 'daily',  priority: 0.75 },
        { url: `${BASE_URL}/${locale}/toys/${cat.slug}`,  lastModified: cat.updatedAt, changeFrequency: 'daily',  priority: 0.75 },
      );
    }
  }

  // ── 4. BLOG POST PAGES ─────────────────────────────────────────
  for (const blog of blogs) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${blog.slug}`,
        lastModified: blog.updatedAt,
        changeFrequency: 'weekly',
        priority: blog.isFeatured ? 0.92 : 0.80,
      });
    }
  }

  // ── 5. PRODUCT DETAIL PAGES ────────────────────────────────────
  for (const product of products) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/products/${product.id}`,
        lastModified: product.updatedAt,
        changeFrequency: 'daily',        // Price changes daily
        priority: product.editorRating ? 0.85 : 0.70,
      });
    }
  }

  // ── 6. BRAND PAGES ─────────────────────────────────────────────
  for (const brand of (brands as any[])) {
    if (!brand?.slug) continue;
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/brands/${brand.slug}`,
        lastModified: brand.updatedAt ?? new Date(),
        changeFrequency: 'weekly',
        priority: 0.65,
      });
    }
  }

  return entries;
}
