import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  for (const product of products) {
    if (!product.slug) {
      const randomSlug = 'product-' + Math.random().toString(36).substring(7);
      await prisma.product.update({
        where: { id: product.id },
        data: { slug: randomSlug }
      });
      console.log(`Updated product ${product.id} with slug ${randomSlug}`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
