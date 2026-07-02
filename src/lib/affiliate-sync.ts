import prisma from '@/lib/prisma';

// A generic interface for the data we expect from an affiliate API
export interface AffiliateProduct {
  externalId: string;
  title: string;
  price: number;
  commissionRate: number;
  imageUrl: string;
  affiliateUrl: string;
  type: 'toy' | 'food';
  categorySlug: string;
}

/**
 * Generic Sync Provider for Affiliate Networks
 * In the future, this can be expanded into multiple adapters (e.g., AmazonSyncProvider, ChewySyncProvider)
 */
export class AffiliateSyncProvider {
  /**
   * Fetches data from external API (Mock implementation)
   */
  private async fetchProductsFromNetwork(): Promise<AffiliateProduct[]> {
    // TODO: Replace with real HTTP request to Amazon/Chewy/ShareASale APIs
    // e.g., const res = await fetch('https://api.shareasale.com/v2/...', { headers: { ... } });
    // const data = await res.json();
    
    // Simulating API latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response data
    return [
      {
        externalId: 'MOCK_API_1',
        title: 'API Synced Smart Feeder',
        price: 129.99,
        commissionRate: 8.0,
        imageUrl: '/placeholder.jpg',
        affiliateUrl: 'https://example.com/smart-feeder?ref=123',
        type: 'food',
        categorySlug: 'dog'
      },
      {
        externalId: 'MOCK_API_2',
        title: 'API Synced Laser Pointer',
        price: 15.50,
        commissionRate: 10.0,
        imageUrl: '/placeholder.jpg',
        affiliateUrl: 'https://example.com/laser?ref=123',
        type: 'toy',
        categorySlug: 'cat'
      }
    ];
  }

  /**
   * Main sync function that fetches and upserts to the database
   */
  public async sync(): Promise<number> {
    try {
      const products = await this.fetchProductsFromNetwork();
      let count = 0;

      for (const p of products) {
        // Ensure category exists
        let category = await prisma.category.findUnique({
          where: { slug: p.categorySlug },
        });

        if (!category) {
          category = await prisma.category.create({
            data: {
              name: p.categorySlug.charAt(0).toUpperCase() + p.categorySlug.slice(1),
              slug: p.categorySlug,
              description: `Auto-generated from API sync`,
            },
          });
        }

        const estimatedMargin = p.price * (p.commissionRate / 100);

        // Upsert by title (for simplicity, but real APIs should use an external ID field if added to Prisma)
        const existing = await prisma.product.findFirst({
          where: { title: p.title }
        });

        if (existing) {
          await prisma.product.update({
            where: { id: existing.id },
            data: {
              price: p.price,
              commissionRate: p.commissionRate,
              estimatedMargin,
              imageUrl: p.imageUrl,
              affiliateUrl: p.affiliateUrl,
              type: p.type,
              categoryId: category.id,
            }
          });
        } else {
          await prisma.product.create({
            data: {
              title: p.title,
              price: p.price,
              commissionRate: p.commissionRate,
              estimatedMargin,
              imageUrl: p.imageUrl,
              affiliateUrl: p.affiliateUrl,
              type: p.type,
              categoryId: category.id,
            }
          });
        }
        count++;
      }

      return count;
    } catch (error) {
      console.error('API Sync Error:', error);
      throw new Error('Failed to sync products from API');
    }
  }
}
