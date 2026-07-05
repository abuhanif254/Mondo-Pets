import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/',
        '/api/',
        '/_next/',
      ],
      crawlDelay: 2,
    },
    sitemap: 'https://mondopets.com/sitemap.xml',
  };
}
