import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const SITE_URL = 'https://mondopets.com';
  
  try {
    // 1. Fetch latest products
    const products = await prisma.product.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true,
      }
    });

    // 2. Fetch latest blogs
    const blogs = await prisma.blog.findMany({
      take: 10,
      orderBy: { publishedAt: 'desc' },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
        coverImageUrl: true,
      }
    });

    // 3. Combine and sort by date descending
    const feedItems: Array<{ title: string, link: string, description: string, date: Date, imageUrl?: string | null }> = [
      ...products.map(p => ({
        title: `New Product Reviewed: ${p.title}`,
        link: `${SITE_URL}/en/products/${p.id}`,
        description: `${p.description || `Check out our latest review for ${p.title}.`} <br><br><em>Note: If you purchase through our links, we may earn an affiliate commission.</em>`,
        date: p.createdAt,
        imageUrl: p.imageUrl,
      })),
      ...blogs.map(b => ({
        title: b.title,
        link: `${SITE_URL}/en/blog/${b.slug}`,
        description: `${b.excerpt || ''} <br><br><em>Note: If you purchase through our links, we may earn an affiliate commission.</em>`,
        date: b.publishedAt || new Date(),
        imageUrl: b.coverImageUrl,
      }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 15); // Top 15 total items

    // 4. Generate RSS 2.0 XML
    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Mondo Pets</title>
    <link>${SITE_URL}</link>
    <description>Premium pet care, toys, and food reviews for your beloved companions.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${feedItems.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <description><![CDATA[${item.description}]]></description>
      ${item.imageUrl ? `<media:content url="${item.imageUrl}" medium="image" />` : ''}
    </item>`).join('')}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Failed to generate RSS feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
