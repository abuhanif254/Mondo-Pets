import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting DB Seed with Rich Phase 2 Blog Data...');

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

  // 2. Create Products
  const productsToCreate = [
      {
        title: 'KONG Classic Dog Toy, Durable Natural Rubber',
        price: 13.99, commissionRate: 5.0, estimatedMargin: 0.70,
        imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0002AR0I8',
        type: 'toy', categoryId: catDog.id, clickCount: 145,
      },
      {
        title: 'Furhaven Orthopedic Ergonomic Dog Bed',
        price: 45.99, commissionRate: 6.0, estimatedMargin: 2.75,
        imageUrl: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B01J7Z6I8Y',
        type: 'health', categoryId: catDog.id, clickCount: 312,
      },
      {
        title: 'Blue Buffalo Life Protection Formula Dry Dog Food',
        price: 60.98, commissionRate: 4.0, estimatedMargin: 2.43,
        imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0009YWKUA',
        type: 'food', categoryId: catDog.id, clickCount: 89,
      },
      {
        title: 'Earth Rated Dog Poop Bags, Extra Thick (270 Count)',
        price: 13.99, commissionRate: 5.0, estimatedMargin: 0.70,
        imageUrl: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0002AR0I8',
        type: 'health', categoryId: catDog.id, clickCount: 430,
      },
      {
        title: 'Outward Hound Hide-A-Squirrel Squeaky Puzzle Plush',
        price: 19.99, commissionRate: 7.0, estimatedMargin: 1.39,
        imageUrl: 'https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0002I0O60',
        type: 'toy', categoryId: catDog.id, clickCount: 210,
      },
      {
        title: 'SmartyKat Skitter Critters Catnip Cat Toys',
        price: 5.99, commissionRate: 8.0, estimatedMargin: 0.47,
        imageUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0018CG40O',
        type: 'toy', categoryId: catCat.id, clickCount: 520,
      },
      {
        title: 'Purina Pro Plan High Protein Dry Cat Food',
        price: 42.48, commissionRate: 4.0, estimatedMargin: 1.69,
        imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B002CJIT76',
        type: 'food', categoryId: catCat.id, clickCount: 115,
      },
      {
        title: "Dr. Elsey's Premium Clumping Cat Litter",
        price: 19.99, commissionRate: 4.5, estimatedMargin: 0.89,
        imageUrl: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0009X29WK',
        type: 'health', categoryId: catCat.id, clickCount: 612,
      },
      {
        title: 'Yaheetech 54in Cat Tree Tower Condo',
        price: 59.99, commissionRate: 8.0, estimatedMargin: 4.79,
        imageUrl: 'https://images.unsplash.com/photo-1574231164645-d6f0e8553590?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B07G3JCMN5',
        type: 'toy', categoryId: catCat.id, clickCount: 88,
      },
      {
        title: 'ZuPreem FruitBlend Flavor Pellet Bird Food',
        price: 15.99, commissionRate: 5.0, estimatedMargin: 0.79,
        imageUrl: 'https://images.unsplash.com/photo-1552728089-571ebd6a45ad?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0000AH3NK',
        type: 'food', categoryId: catBird.id, clickCount: 45,
      },
      {
        title: 'Planet Pleasures Pineapple Foraging Bird Toy',
        price: 9.95, commissionRate: 6.0, estimatedMargin: 0.59,
        imageUrl: 'https://images.unsplash.com/photo-1549429153-61fcbe974052?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: 'https://amazon.com/dp/B0002FP42I',
        type: 'toy', categoryId: catBird.id, clickCount: 22,
      },
    ];

  for (const productData of productsToCreate) {
    await prisma.product.create({ data: productData });
  }

  console.log('Products seeded.');

  // 3. Create Authors (Phase 2: with expertise, social links)
  const author1 = await prisma.author.create({
    data: {
      name: 'Dr. Sarah Jenkins',
      credentials: 'DVM, Veterinary Orthopedics',
      bio: 'Dr. Jenkins is a board-certified veterinary orthopedic surgeon with over 12 years of experience treating joint conditions in dogs and cats. She has published 40+ peer-reviewed articles on canine mobility.',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&h=100&q=80',
      twitterUrl: 'https://twitter.com/drjenkinsdvm',
      expertise: ['Orthopedics', 'Senior Dog Care', 'Rehabilitation'],
    },
  });

  const author2 = await prisma.author.create({
    data: {
      name: 'Dr. Marcus Thorne',
      credentials: 'DVM, Feline Nutrition Specialist',
      bio: 'Dr. Thorne specializes in feline internal medicine and nutrition. A graduate of Cornell Veterinary College, he has dedicated his career to advancing dietary treatment protocols for cats with chronic disease.',
      avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&h=100&q=80',
      twitterUrl: 'https://twitter.com/drthornefelinemd',
      expertise: ['Feline Nutrition', 'Kidney Disease', 'Chronic Illness'],
    },
  });

  const author3 = await prisma.author.create({
    data: {
      name: 'Emily Carter',
      credentials: 'BSc Animal Behaviour, CPDT-KA',
      bio: 'Certified professional dog trainer with a science degree in animal behaviour. Emily has trained over 2,000 dogs and is a regular contributor to the American Kennel Club blog.',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80',
      twitterUrl: 'https://twitter.com/emilycarterpets',
      expertise: ['Dog Training', 'Behaviour', 'Puppies'],
    },
  });

  const author4 = await prisma.author.create({
    data: {
      name: 'Dr. Priya Nair',
      credentials: 'BVSc, Holistic Pet Nutrition',
      bio: 'Dr. Nair bridges conventional and holistic approaches to pet wellness. She consults for leading pet food brands and hosts a popular podcast on evidence-based natural pet care.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
      expertise: ['Holistic Nutrition', 'Raw Diets', 'Supplements'],
    },
  });

  console.log('Authors created.');

  // 4. Create Rich Blog Posts (Phase 2: with cover images, tags, read times, featured)
  await prisma.blog.createMany({
    data: [
      // FEATURED DOG POST
      {
        title: 'Recognizing Early Signs of Arthritis in Older Dogs',
        slug: 'signs-of-arthritis-dogs',
        excerpt: 'Arthritis affects 1 in 5 dogs over the age of 7. Learn the subtle early warning signs most owners miss — and the simple changes that can dramatically improve your dog\'s quality of life.',
        content: '<h2>Understanding Canine Arthritis</h2><p>Arthritis is one of the most underdiagnosed conditions in senior dogs. By the time most owners notice visible limping, the disease may have progressed significantly. Here\'s what to watch for...</p><h2>Early Warning Signs</h2><ul><li>Reluctance to climb stairs or jump onto furniture</li><li>Stiffness after rest that improves with movement</li><li>Changes in gait or posture</li><li>Excessive licking of joints</li></ul>',
        coverImageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&h=630&q=85',
        readTimeMinutes: 7,
        viewCount: 4820,
        tags: ['dogs', 'arthritis', 'senior-dogs', 'health', 'joints'],
        isFeatured: true,
        authorId: author1.id,
        categoryId: catDog.id,
        metaTitle: 'Early Signs of Arthritis in Dogs — Expert Vet Guide | Mondo Pets',
        metaDescription: 'Vet-written guide on spotting early arthritis signs in dogs. Learn what to watch for in senior dogs and how diet & supplements can help.',
      },
      // CAT POST
      {
        title: 'Proper Dietary Ratios for Feline Kidney Health',
        slug: 'feline-kidney-health-diet',
        excerpt: 'Chronic kidney disease affects 30–40% of cats over 10 years old. The right phosphorus-to-protein ratio in your cat\'s diet is the single most important factor in slowing disease progression.',
        content: '<h2>The Kidney-Diet Connection</h2><p>When your cat\'s kidneys lose their ability to filter waste efficiently, dietary changes become a primary treatment tool. Here\'s the science behind the recommendations...</p><h2>Key Nutrients to Manage</h2><ul><li>Phosphorus restriction: below 0.5% DM</li><li>High-quality protein at moderate levels</li><li>Omega-3 fatty acids from fish oil</li></ul>',
        coverImageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&h=630&q=85',
        readTimeMinutes: 9,
        viewCount: 3210,
        tags: ['cats', 'kidney-disease', 'nutrition', 'senior-cats', 'diet'],
        isFeatured: false,
        authorId: author2.id,
        categoryId: catCat.id,
        metaTitle: 'Best Diet for Cats with Kidney Disease | Pet Advice by Mondo Pets',
        metaDescription: 'Specialist vet guide on the optimal diet for cats with chronic kidney disease. Phosphorus limits, protein levels and top food recommendations.',
      },
      // DOG TRAINING POST
      {
        title: 'The 7 Dog Training Mistakes Every New Owner Makes',
        slug: 'dog-training-mistakes-new-owners',
        excerpt: 'From inconsistent commands to accidental reward of bad behaviour — discover the 7 most common training mistakes and exactly how to fix them before they become habits.',
        content: '<h2>Training Your Dog: Getting It Right</h2><p>New dog owners often unintentionally reinforce behaviours they want to stop. Understanding how dogs learn is the first step to effective training...</p>',
        coverImageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&h=630&q=85',
        readTimeMinutes: 6,
        viewCount: 6140,
        tags: ['dogs', 'training', 'puppies', 'behaviour', 'beginners'],
        isFeatured: false,
        authorId: author3.id,
        categoryId: catDog.id,
        metaTitle: '7 Dog Training Mistakes New Owners Make (+ How to Fix Them)',
        metaDescription: 'Certified dog trainer reveals the 7 most common puppy training mistakes and easy fixes. Consistent, science-backed advice for new dog owners.',
      },
      // NUTRITION POST
      {
        title: 'Grain-Free vs Grain-Inclusive: What the Research Actually Says',
        slug: 'grain-free-vs-grain-inclusive-dog-food',
        excerpt: 'The debate has never been louder — but the science is being misrepresented on both sides. We break down the FDA\'s DCM investigation findings and what they actually mean for your dog\'s diet.',
        content: '<h2>The Grain-Free Controversy Explained</h2><p>In 2018, the FDA began investigating a potential link between grain-free diets and dilated cardiomyopathy (DCM) in dogs. Here\'s what the data actually shows...</p>',
        coverImageUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=1200&h=630&q=85',
        readTimeMinutes: 11,
        viewCount: 8930,
        tags: ['dogs', 'nutrition', 'dog-food', 'grain-free', 'diet', 'health'],
        isFeatured: false,
        authorId: author4.id,
        categoryId: catDog.id,
        metaTitle: 'Grain-Free vs Grain Dog Food: What Science Says | Pet Advice',
        metaDescription: 'Evidence-based breakdown of the grain-free vs grain-inclusive dog food debate. FDA DCM findings explained without the hype.',
      },
      // GROOMING POST
      {
        title: 'How Often Should You Bathe Your Dog? A Vet\'s Complete Guide',
        slug: 'how-often-bathe-dog-vet-guide',
        excerpt: 'Too frequent bathing strips natural oils; too infrequent allows allergens to build up. The ideal frequency depends on 4 key factors — here\'s how to find the right schedule for your dog.',
        content: '<h2>Finding Your Dog\'s Ideal Bath Frequency</h2><p>There\'s no single answer that works for every dog. Breed, coat type, skin condition, and lifestyle all play critical roles in determining how often your dog needs a bath...</p>',
        coverImageUrl: 'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=1200&h=630&q=85',
        readTimeMinutes: 5,
        viewCount: 2870,
        tags: ['dogs', 'grooming', 'skin-care', 'bathing', 'hygiene'],
        isFeatured: false,
        authorId: author1.id,
        categoryId: catDog.id,
        metaTitle: 'How Often to Bathe Your Dog — Vet-Approved Guide | Mondo Pets',
        metaDescription: 'Vet guide to dog bathing frequency. Find the perfect schedule based on coat type, breed, and skin health. Includes tips for sensitive skin dogs.',
      },
      // CAT BEHAVIOUR POST
      {
        title: 'Why Your Cat Kneads: The Science Behind the "Making Biscuits" Behaviour',
        slug: 'why-cats-knead-behaviour-explained',
        excerpt: 'Kneading is one of the most endearing things cats do — but what\'s actually behind it? From kittenhood instincts to oxytocin release, the science is fascinating.',
        content: '<h2>The Origins of Kneading</h2><p>Kneading begins in the first hours of a kitten\'s life. When nursing, kittens rhythmically push against their mother\'s belly to stimulate milk flow — and this behaviour often persists into adulthood...</p>',
        coverImageUrl: 'https://images.unsplash.com/photo-1574231164645-d6f0e8553590?auto=format&fit=crop&w=1200&h=630&q=85',
        readTimeMinutes: 4,
        viewCount: 5500,
        tags: ['cats', 'behaviour', 'cat-psychology', 'bonding'],
        isFeatured: false,
        authorId: author2.id,
        categoryId: catCat.id,
        metaTitle: 'Why Do Cats Knead? The Science Explained | Pet Advice',
        metaDescription: 'Discover why cats knead — from instinctive nursing behaviours to adult stress relief. Science-backed explanation of the "making biscuits" habit.',
      },
      // HEALTH POST
      {
        title: '10 Human Foods That Are Toxic to Dogs (And Safe Alternatives)',
        slug: 'human-foods-toxic-to-dogs',
        excerpt: 'Many common kitchen ingredients are dangerous — even deadly — for dogs. This vet-reviewed list covers the 10 most dangerous foods plus safe, dog-approved swaps.',
        content: '<h2>Foods to Keep Away From Your Dog</h2><p>The ASPCA Animal Poison Control Center handles over 400,000 cases per year — many involving everyday human foods. Here are the most important ones to know...</p>',
        coverImageUrl: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?auto=format&fit=crop&w=1200&h=630&q=85',
        readTimeMinutes: 8,
        viewCount: 12400,
        tags: ['dogs', 'health', 'toxic-foods', 'safety', 'nutrition', 'emergencies'],
        isFeatured: false,
        authorId: author1.id,
        categoryId: catDog.id,
        metaTitle: '10 Human Foods Toxic to Dogs + Safe Alternatives | Mondo Pets',
        metaDescription: 'Vet-reviewed list of 10 common foods that are dangerous for dogs, with safe alternatives. Essential reading for every dog owner.',
      },
      // BIRD POST
      {
        title: 'The Complete Beginner\'s Guide to Caring for a Budgie',
        slug: 'beginners-guide-budgie-care',
        excerpt: 'Budgerigars are the world\'s most popular pet bird — and with good reason. This complete guide covers housing, diet, socialization, and common health issues for new budgie owners.',
        content: '<h2>Your New Budgie: Getting Started</h2><p>Budgies, or budgerigars, are social, intelligent birds that thrive when their physical and mental needs are properly met. Here\'s everything you need to set your bird up for a long, healthy life...</p>',
        coverImageUrl: 'https://images.unsplash.com/photo-1552728089-571ebd6a45ad?auto=format&fit=crop&w=1200&h=630&q=85',
        readTimeMinutes: 12,
        viewCount: 1830,
        tags: ['birds', 'budgie', 'beginner-guide', 'bird-care', 'parakeet'],
        isFeatured: false,
        authorId: author4.id,
        categoryId: catBird.id,
        metaTitle: 'Complete Beginner\'s Guide to Budgie Care | Pet Advice by Mondo Pets',
        metaDescription: 'Everything new budgie owners need to know: cage setup, diet, socialisation, health signs and common mistakes. Expert guide for parakeet beginners.',
      },
    ],
  });

  console.log('Rich blog posts created.');
  console.log('✅ DB Seed Phase 2 complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
