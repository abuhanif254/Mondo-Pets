import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'], // We will add an /admin route later that should not be indexed
    },
    sitemap: 'https://mondopets.com/sitemap.xml',
  };
}
