import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting DB Seed with Real Affiliate Products...');

  // Clear existing data
  await prisma.blog.deleteMany({});
  await prisma.author.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  console.log('Cleared existing data.');

  // 1. Create Categories
  const catDog = await prisma.category.create({
    data: { name: 'Dog', slug: 'dog', description: 'Everything for your canine companions.' },
  });

  const catCat = await prisma.category.create({
    data: { name: 'Cat', slug: 'cat', description: 'Premium products for your feline friends.' },
  });

  const catBird = await prisma.category.create({
    data: { name: 'Bird', slug: 'bird', description: 'Avian care, food, and engaging toys.' },
  });

  console.log('Categories created.');

  // 2. Create Products (Realistic Amazon/Chewy Affiliate Data)
  await prisma.product.createMany({
    data: [
      // DOG PRODUCTS
      {
        title: 'KONG Classic Dog Toy, Durable Natural Rubber',
        price: 13.99,
        commissionRate: 5.0,
        estimatedMargin: 0.70,
        imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0002AR0I8',
        type: 'toy',
        categoryId: catDog.id,
        clickCount: 145,
      },
      {
        title: 'Furhaven Orthopedic Ergonomic Dog Bed',
        price: 45.99,
        commissionRate: 6.0,
        estimatedMargin: 2.75,
        imageUrl: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B01J7Z6I8Y',
        type: 'health',
        categoryId: catDog.id,
        clickCount: 312,
      },
      {
        title: 'Blue Buffalo Life Protection Formula Dry Dog Food',
        price: 60.98,
        commissionRate: 4.0,
        estimatedMargin: 2.43,
        imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0009YWKUA',
        type: 'food',
        categoryId: catDog.id,
        clickCount: 89,
      },
      {
        title: 'Earth Rated Dog Poop Bags, Extra Thick (270 Count)',
        price: 13.99,
        commissionRate: 5.0,
        estimatedMargin: 0.70,
        imageUrl: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0002AR0I8',
        type: 'health',
        categoryId: catDog.id,
        clickCount: 430,
      },
      {
        title: 'Outward Hound Hide-A-Squirrel Squeaky Puzzle Plush',
        price: 19.99,
        commissionRate: 7.0,
        estimatedMargin: 1.39,
        imageUrl: 'https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0002I0O60',
        type: 'toy',
        categoryId: catDog.id,
        clickCount: 210,
      },

      // CAT PRODUCTS
      {
        title: 'SmartyKat Skitter Critters Catnip Cat Toys',
        price: 5.99,
        commissionRate: 8.0,
        estimatedMargin: 0.47,
        imageUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0018CG40O',
        type: 'toy',
        categoryId: catCat.id,
        clickCount: 520,
      },
      {
        title: 'Purina Pro Plan High Protein Dry Cat Food',
        price: 42.48,
        commissionRate: 4.0,
        estimatedMargin: 1.69,
        imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B002CJIT76',
        type: 'food',
        categoryId: catCat.id,
        clickCount: 115,
      },
      {
        title: 'Dr. Elsey’s Premium Clumping Cat Litter',
        price: 19.99,
        commissionRate: 4.5,
        estimatedMargin: 0.89,
        imageUrl: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0009X29WK',
        type: 'health',
        categoryId: catCat.id,
        clickCount: 612,
      },
      {
        title: 'Yaheetech 54in Cat Tree Tower Condo',
        price: 59.99,
        commissionRate: 8.0,
        estimatedMargin: 4.79,
        imageUrl: 'https://images.unsplash.com/photo-1574231164645-d6f0e8553590?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B07G3JCMN5',
        type: 'toy',
        categoryId: catCat.id,
        clickCount: 88,
      },

      // BIRD PRODUCTS
      {
        title: 'ZuPreem FruitBlend Flavor Pellet Bird Food',
        price: 15.99,
        commissionRate: 5.0,
        estimatedMargin: 0.79,
        imageUrl: 'https://images.unsplash.com/photo-1552728089-571ebd6a45ad?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0000AH3NK',
        type: 'food',
        categoryId: catBird.id,
        clickCount: 45,
      },
      {
        title: 'Planet Pleasures Pineapple Foraging Bird Toy',
        price: 9.95,
        commissionRate: 6.0,
        estimatedMargin: 0.59,
        imageUrl: 'https://images.unsplash.com/photo-1549429153-61fcbe974052?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0002FP42I',
        type: 'toy',
        categoryId: catBird.id,
        clickCount: 22,
      }
    ],
  });

  console.log('Real Affiliate Products Imported.');

  // 3. Create Authors
  const author1 = await prisma.author.create({
    data: {
      name: 'Dr. Sarah Jenkins',
      credentials: 'DVM, Veterinary Orthopedics',
      bio: 'Expert in canine mobility and joint health.',
    },
  });

  const author2 = await prisma.author.create({
    data: {
      name: 'Dr. Marcus Thorne',
      credentials: 'DVM, Feline Nutrition Specialist',
      bio: 'Dedicated to improving feline health through diet.',
    },
  });

  console.log('Authors created.');

  // 4. Create Blogs
  await prisma.blog.createMany({
    data: [
      {
        title: 'Recognizing Early Signs of Arthritis in Older Dogs',
        slug: 'signs-of-arthritis-dogs',
        excerpt: 'Arthritis is common in senior dogs. Learn how to spot the early signs...',
        content: '<p>Arthritis is common in senior dogs. Learn how to spot the early signs...</p>',
        authorId: author1.id,
        categoryId: catDog.id,
      },
      {
        title: 'Proper Dietary Ratios for Feline Kidney Health',
        slug: 'feline-kidney-health-diet',
        excerpt: 'Chronic kidney disease affects many older cats. A specialized diet is key.',
        content: '<p>Chronic kidney disease affects many older cats. A specialized diet is key.</p>',
        authorId: author2.id,
        categoryId: catCat.id,
      }
    ],
  });

  console.log('Blogs created.');
  console.log('DB Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
