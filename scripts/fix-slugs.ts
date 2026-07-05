import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = await prisma.product.findMany();
  for (const product of products) {
    const randomSlug = 'product-' + Math.random().toString(36).substring(7);
    await prisma.product.update({
      where: { id: product.id },
      data: { slug: randomSlug }
    });
    console.log(`Updated product ${product.id} with slug ${randomSlug}`);
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
