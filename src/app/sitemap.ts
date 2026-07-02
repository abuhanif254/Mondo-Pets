import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = routing.locales;
  const baseUrl = 'https://mondopets.com';

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static Base Routes
  const routes = [
    '',
    '/toys',
    '/food',
    '/care',
    '/blog',
    '/wishlist'
  ];

  routes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1.0 : 0.8,
      });
    });
  });

  // Fetch Dynamic Data in Parallel
  const [categories, blogs] = await Promise.all([
    prisma.category.findMany(),
    prisma.blog.findMany()
  ]);

  // Dynamic Category Pages (e.g., /en/food/dog)
  categories.forEach((cat) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/food/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      });
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/toys/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      });
    });
  });

  // Dynamic Blog Post Pages (e.g., /en/blog/10-best-dog-toys)
  blogs.forEach((blog) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/blog/${blog.slug}`,
        lastModified: blog.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });
  });

  return sitemapEntries;
}
