'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getFeaturedToys() {
  try {
    const toys = await prisma.product.findMany({
      where: { type: 'toy' },
      take: 4,
      orderBy: { estimatedMargin: 'desc' }
    });
    return toys.map(serializeProduct);
  } catch (error) {
    console.error('Failed to fetch toys:', error);
    return [];
  }
}

export async function getTrendingDeals() {
  try {
    const deals = await prisma.product.findMany({
      orderBy: { clickCount: 'desc' },
      take: 4,
    });
    return deals.map(serializeProduct);
  } catch (error) {
    console.error('Failed to fetch trending deals:', error);
    return [];
  }
}

export async function getAdminProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { estimatedMargin: 'desc' },
      take: 50,
      select: {
        id: true,
        title: true,
        estimatedMargin: true,
        clickCount: true,
      }
    });
    
    return products.map(p => ({
      id: p.id,
      title: p.title,
      margin: p.estimatedMargin ? `$${Number(p.estimatedMargin).toFixed(2)}` : 'N/A',
      clicks: p.clickCount
    }));
  } catch (error) {
    console.error('Failed to get admin products:', error);
    return [];
  }
}

export async function getProducts(
  type?: string, 
  categorySlug?: string, 
  sort?: string,
  filters?: {
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    lifeStage?: string;
    petType?: string;
    minRating?: number;
  }
) {
  try {
    const whereClause: any = {};
    if (type) whereClause.type = type;
    if (categorySlug) {
      const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (category) whereClause.categoryId = category.id;
    }

    if (filters) {
      if (filters.brand) whereClause.brand = filters.brand;
      if (filters.lifeStage) whereClause.lifeStage = filters.lifeStage;
      if (filters.petType) whereClause.petType = filters.petType;
      if (filters.minRating !== undefined) {
        whereClause.editorRating = { gte: filters.minRating };
      }
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        whereClause.price = {};
        if (filters.minPrice !== undefined) whereClause.price.gte = filters.minPrice;
        if (filters.maxPrice !== undefined) whereClause.price.lte = filters.maxPrice;
      }
    }

    let orderBy: any = { createdAt: 'desc' }; // Default to Newest
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'most_popular') {
      orderBy = { clickCount: 'desc' };
    } else if (sort === 'biggest_discount') {
      // Since we can't easily order by computed originalPrice - price in Prisma without raw queries,
      // we'll just order by originalPrice desc (or fetch and sort in memory if needed).
      // For simplicity, let's sort by clickCount for now or createdAt if discount logic is complex.
      // We will sort in memory below for biggest discount.
    }

    let products = await prisma.product.findMany({
      where: whereClause,
      orderBy: sort === 'biggest_discount' ? undefined : orderBy,
      include: { category: true }
    });

    if (sort === 'biggest_discount') {
      products.sort((a, b) => {
        const discountA = a.originalPrice ? Number(a.originalPrice) - Number(a.price) : 0;
        const discountB = b.originalPrice ? Number(b.originalPrice) - Number(b.price) : 0;
        return discountB - discountA;
      });
    }

    return products.map(serializeProduct);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function getLatestBlogs() {
  try {
    return await prisma.blog.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    });
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
}

export async function getBlogs() {
  try {
    return await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    });
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
}

export async function searchGlobal(query: string) {
  if (!query || query.trim() === '') {
    return { products: [], blogs: [] };
  }
  
  const safeQuery = query.trim();

  try {
    // Search Products
    const products = await prisma.product.findMany({
      where: {
        title: { contains: safeQuery, mode: 'insensitive' }
      },
      take: 5,
      include: { category: true }
    });

    // Search Blogs
    const blogs = await prisma.blog.findMany({
      where: {
        OR: [
          { title: { contains: safeQuery, mode: 'insensitive' } },
          { content: { contains: safeQuery, mode: 'insensitive' } },
        ]
      },
      take: 3,
      include: { author: true }
    });

    return { products: products.map(serializeProduct), blogs };
  } catch (error) {
    console.error('Search failed:', error);
    return { products: [], blogs: [] };
  }
}

function serializeProduct(product: any) {
  return {
    ...product,
    price: product.price ? Number(product.price) : 0,
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    commissionRate: product.commissionRate ? Number(product.commissionRate) : null,
    estimatedMargin: product.estimatedMargin ? Number(product.estimatedMargin) : null,
    editorRating: product.editorRating ? Number(product.editorRating) : null,
    proteinPercent: product.proteinPercent ? Number(product.proteinPercent) : null,
    fatPercent: product.fatPercent ? Number(product.fatPercent) : null,
    fiberPercent: product.fiberPercent ? Number(product.fiberPercent) : null,
    moisturePercent: product.moisturePercent ? Number(product.moisturePercent) : null,
  };
}

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email') as string;
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Invalid email address.' };
  }

  try {
    await prisma.subscriber.create({
      data: { email }
    });
    return { success: true, message: 'Thanks for subscribing!' };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, message: 'This email is already subscribed.' };
    }
    console.error('Subscription error:', error);
    return { success: false, message: 'An error occurred. Please try again.' };
  }
}

export async function getHeroSlides() {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    if (slides.length > 0) return slides;

    // Fallback slides matching the Chewy screenshots theme
    return [
      {
        id: 'slide-1',
        title: 'Support their health',
        subtitle: 'With precise nutrition from Royal Canin.',
        ctaText: 'Shop now',
        ctaUrl: '/food/dog',
        imageUrl: '/hero_floating_toy.png', // We'll reuse our toy image for demo
        backgroundColor: '#e11d48', // Red matching Royal Canin
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'slide-2',
        title: 'Free $20 eGift card',
        subtitle: 'With your $49+ order.',
        ctaText: 'Shop now',
        ctaUrl: '/deals',
        imageUrl: '/media__1782686047477.png', // Demo pet
        backgroundColor: '#1d4ed8', // Blue matching Chewy banner
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'slide-3',
        title: 'pharmacy 50% off',
        subtitle: 'Your first order with Autoship including flea & tick meds.',
        ctaText: 'Shop now',
        ctaUrl: '/health',
        imageUrl: '/media__1782674987918.png', // Demo pet
        backgroundColor: '#dbeafe', // Light blue matching pharmacy banner
        order: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  } catch (error) {
    console.error('Failed to fetch hero slides:', error);
    return [];
  }
}

export async function getTopBannerAd() {
  try {
    const ad = await prisma.topBannerAd.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!ad) {
      return {
        id: 'default',
        text: 'Check out our new Affiliate Partner Deals!',
        linkUrl: '#',
        bgColor: '#e6f4ca',
        textColor: '#2c5305',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    return ad;
  } catch (error) {
    console.error("Failed to fetch top banner ad:", error);
    return null;
  }
}

export async function getCoupons() {
  try {
    const coupons = await prisma.coupon.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    
    // Fallback for demonstration if database is empty
    if (coupons.length === 0) {
      return [
        {
          id: 'demo-1',
          code: 'PETS20',
          description: 'Get 20% off all premium dog food on your first order.',
          retailerName: 'Chewy',
          discountValue: '20% OFF',
          affiliateUrl: 'https://chewy.com',
          isActive: true
        },
        {
          id: 'demo-2',
          code: 'FREESHIP',
          description: 'Free expedited shipping on all toys and accessories.',
          retailerName: 'Petco',
          discountValue: 'FREE SHIPPING',
          affiliateUrl: 'https://petco.com',
          isActive: true
        }
      ];
    }
    
    return coupons;
  } catch (error) {
    console.error('Failed to fetch coupons:', error);
    return [];
  }
}

export async function getFeaturedCoupon() {
  try {
    return await prisma.coupon.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch featured coupon:', error);
    return null;
  }
}

export async function getProductsByIds(ids: string[]) {
  try {
    return await prisma.product.findMany({
      where: {
        id: { in: ids }
      }
    });
  } catch (error) {
    console.error('Failed to fetch products by ids:', error);
    return [];
  }
}



export async function getProductsNeedingSeo() {
  try {
    // Find products where description is null, empty, or very short (less than 50 chars)
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { description: null },
          { description: '' },
          // Prisma doesn't have a direct length function in where clauses for all DBs, 
          // so we fetch ones that might need it. For now, fetch all and filter in memory, 
          // or just fetch those with literally null or empty descriptions.
        ]
      },
      take: 20
    });
    
    // Also fetch products with short descriptions (hacky way without raw query)
    const allProducts = await prisma.product.findMany({
      select: { id: true, title: true, description: true, type: true }
    });
    
    const needsSeo = allProducts.filter(p => !p.description || p.description.length < 100);
    return needsSeo.slice(0, 20);
  } catch (error) {
    console.error('Failed to fetch products for SEO:', error);
    return [];
  }
}

export async function generateSeoContent(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return { success: false, message: 'Product not found.' };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    let generatedDescription = '';

    if (apiKey) {
      // Production-level OpenAI call
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o', // or gpt-3.5-turbo depending on preference
          messages: [
            {
              role: 'system',
              content: 'You are an expert e-commerce copywriter. Write a highly engaging, SEO-optimized product description (around 150-200 words). Format it using Markdown (bolding key features). Do not include the title itself at the very beginning, just dive right into the description.'
            },
            {
              role: 'user',
              content: `Write an SEO description for a pet ${product.type} called "${product.title}".`
            }
          ],
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      generatedDescription = data.choices[0].message.content;
    } else {
      // Fallback Mock Generator if API key is not present in .env
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      generatedDescription = `**Discover the ultimate upgrade for your pet!** The ${product.title} is a premium ${product.type} designed with your companion's happiness and health in mind. 

Crafted from highly durable, pet-safe materials, it ensures long-lasting enjoyment whether you're at home or on the go. 

**Key Features:**
- **Exceptional Quality:** Built to withstand daily use.
- **Expert Approved:** Recommended by top veterinarians and pet care specialists.
- **Engaging Design:** Specifically engineered to stimulate your pet's natural instincts.

Don't settle for less when it comes to your furry friend. Upgrade their routine today with the ${product.title} and experience the Mondo Pets difference!`;
    }

    // Update the database
    await prisma.product.update({
      where: { id: productId },
      data: { description: generatedDescription }
    });

    return { success: true, message: 'SEO content generated successfully.' };
  } catch (error) {
    console.error('Failed to generate SEO content:', error);
    return { success: false, message: 'Failed to generate content.' };
  }
}

export async function getNewArrivals() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
    });
    return products.map(serializeProduct);
  } catch (error) {
    console.error('Failed to fetch new arrivals:', error);
    return [];
  }
}

export async function getTopRatedProducts() {
  try {
    // In a real app we'd aggregate reviews or use a pre-calculated rating field.
    // For now we fetch products that HAVE reviews, or fallback to random if none exist.
    const productsWithReviews = await prisma.product.findMany({
      where: {
        reviews: {
          some: {} // has at least one review
        }
      },
      take: 4,
      include: {
        reviews: true
      }
    });

    if (productsWithReviews.length > 0) {
      // Sort by average rating in memory
      productsWithReviews.sort((a, b) => {
        const avgA = a.reviews.reduce((acc, r) => acc + r.rating, 0) / (a.reviews.length || 1);
        const avgB = b.reviews.reduce((acc, r) => acc + r.rating, 0) / (b.reviews.length || 1);
        return avgB - avgA;
      });
      return productsWithReviews.slice(0, 4).map(serializeProduct);
    }
    
    // Fallback if no reviews exist in DB yet
    const fallback = await prisma.product.findMany({
      orderBy: { price: 'desc' },
      take: 4
    });
    return fallback.map(serializeProduct);
  } catch (error) {
    console.error('Failed to fetch top rated products:', error);
    return [];
  }
}

export async function getGroomingEssentials() {
  try {
    const products = await prisma.product.findMany({
      where: { type: 'grooming' },
      orderBy: { clickCount: 'desc' },
      take: 4,
    });
    return products.map(serializeProduct);
  } catch (error) {
    console.error('Failed to fetch grooming essentials:', error);
    return [];
  }
}

export async function submitSiteFeedback(data: { rating: number, content: string, authorName: string }) {
  try {
    const feedback = await prisma.siteFeedback.create({
      data
    });
    return { success: true, feedback };
  } catch (error) {
    console.error('Failed to submit site feedback:', error);
    return { success: false, message: 'Failed to submit feedback.' };
  }
}

export async function getListicles() {
  try {
    return await prisma.listicle.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Failed to get listicles:', error);
    return [];
  }
}

export async function getListicleBySlug(slug: string) {
  try {
    return await prisma.listicle.findUnique({
      where: { slug }
    });
  } catch (error) {
    console.error(`Failed to get listicle ${slug}:`, error);
    return null;
  }
}

export async function searchProductsForCompare(query: string) {
  if (!query || query.length < 2) return [];
  try {
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive'
        }
      },
      take: 10,
      select: {
        id: true,
        title: true,
        imageUrl: true,
        brand: true,
        price: true,
        editorRating: true,
        proteinPercent: true,
        fatPercent: true,
        fiberPercent: true,
        moisturePercent: true,
        ingredients: true,
        amazonUrl: true,
        chewyUrl: true,
        dietaryNeeds: true
      }
    });
    // Serialize Decimals before returning to Client
    return products.map(p => ({
      ...p,
      price: p.price ? Number(p.price) : 0,
      editorRating: p.editorRating ? Number(p.editorRating) : null,
      proteinPercent: p.proteinPercent ? Number(p.proteinPercent) : null,
      fatPercent: p.fatPercent ? Number(p.fatPercent) : null,
      fiberPercent: p.fiberPercent ? Number(p.fiberPercent) : null,
      moisturePercent: p.moisturePercent ? Number(p.moisturePercent) : null,
    }));
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
}

export async function createPriceAlert(email: string, productId: string) {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Invalid email address.' };
  }

  try {
    // Check if an alert already exists for this email and product
    const existing = await prisma.priceAlert.findFirst({
      where: { email, productId }
    });

    if (existing) {
      return { success: true, message: 'You are already tracking this product.' };
    }

    await prisma.priceAlert.create({
      data: {
        email,
        productId
      }
    });

    return { success: true, message: 'Price alert created! We will email you when the price drops.' };
  } catch (error) {
    console.error('Failed to create price alert:', error);
    return { success: false, message: 'Failed to set up price alert. Please try again later.' };
  }
}

export async function getBrandProfiles() {
  try {
    return await prisma.brandProfile.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error('Failed to get brand profiles:', error);
    return [];
  }
}

export async function getBrandProfile(slug: string) {
  try {
    return await prisma.brandProfile.findUnique({
      where: { slug }
    });
  } catch (error) {
    console.error(`Failed to get brand profile ${slug}:`, error);
    return null;
  }
}

// ==========================================
// User Pets (My Pets)
// ==========================================

export async function getPetProfiles(userId: string) {
  try {
    return await prisma.pet.findMany({
      where: { userId },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error('Failed to get pet profiles:', error);
    return [];
  }
}

export async function addPetProfile(data: { userId: string, name: string, type: string, breed?: string, age?: number }) {
  try {
    const pet = await prisma.pet.create({
      data: {
        userId: data.userId,
        name: data.name,
        type: data.type,
        breed: data.breed || null,
        age: data.age || null
      }
    });

    // Gamification: Grant 'pet_parent' badge
    await grantBadge(data.userId, 'pet_parent');

    return { success: true, pet };
  } catch (error) {
    console.error('Failed to add pet profile:', error);
    return { success: false, message: 'Failed to add pet profile.' };
  }
}

export async function deletePetProfile(id: string, userId: string) {
  try {
    // Ensure the pet belongs to the user
    const pet = await prisma.pet.findUnique({ where: { id } });
    if (!pet || pet.userId !== userId) {
      return { success: false, message: 'Unauthorized' };
    }

    await prisma.pet.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete pet profile:', error);
    return { success: false, message: 'Failed to delete pet profile.' };
  }
}

// ==========================================
// Wishlist
// ==========================================

export async function getWishlist(userId: string) {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          select: { id: true, title: true, price: true, imageUrl: true, affiliateUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return items.map(item => ({
      id: item.product.id,
      title: item.product.title,
      price: item.product.price?.toString() || '0.00',
      imageUrl: item.product.imageUrl || '/placeholder.png',
      affiliateUrl: item.product.affiliateUrl || '#'
    }));
  } catch (error) {
    console.error('Failed to get wishlist:', error);
    return [];
  }
}

export async function addToWishlist(userId: string, productId: string) {
  try {
    await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: {},
      create: { userId, productId }
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    return { success: false };
  }
}

export async function removeFromWishlist(userId: string, productId: string) {
  try {
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId, productId } }
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    return { success: false };
  }
}

// ==========================================
// Quiz Funnel Recommendations
// ==========================================

export async function getQuizRecommendations(answers: {
  petType: string;
  lifeStage: string;
  budget: string; // 'low', 'medium', 'high'
  category: string;
}) {
  try {
    let minPrice = 0;
    let maxPrice = 9999;
    
    if (answers.budget === 'low') maxPrice = 25;
    else if (answers.budget === 'medium') { minPrice = 25; maxPrice = 50; }
    else if (answers.budget === 'high') { minPrice = 50; }

    const products = await prisma.product.findMany({
      where: {
        AND: [
          answers.petType ? { petType: { equals: answers.petType, mode: 'insensitive' } } : {},
          answers.lifeStage ? { lifeStage: { equals: answers.lifeStage, mode: 'insensitive' } } : {},
          answers.category ? { type: { equals: answers.category, mode: 'insensitive' } } : {},
          { price: { gte: minPrice, lte: maxPrice } }
        ]
      },
      orderBy: { editorRating: 'desc' },
      take: 6
    });

    // Serialize Decimal
    return products.map(p => ({
      ...p,
      price: p.price.toString(),
      commissionRate: p.commissionRate?.toString() || '0',
      estimatedMargin: p.estimatedMargin?.toString() || '0',
      proteinPercent: p.proteinPercent?.toString() || null,
      fatPercent: p.fatPercent?.toString() || null,
      fiberPercent: p.fiberPercent?.toString() || null,
      moisturePercent: p.moisturePercent?.toString() || null,
      editorRating: p.editorRating?.toString() || null
    }));
  } catch (error) {
    console.error('Failed to get quiz recommendations:', error);
    return [];
  }
}

// ==========================================
// User Generated Content (UGC)
// ==========================================

export async function submitReview(data: {
  productId: string;
  rating: number;
  title: string;
  content: string;
  authorName: string;
  petType?: string;
}) {
  try {
    const review = await prisma.review.create({
      data: {
        productId: data.productId,
        rating: data.rating,
        title: data.title,
        content: data.content,
        authorName: data.authorName,
        petType: data.petType
      }
    });

    // Gamification: Try to grant 'top_reviewer' badge
    const session = await cookies();
    const userId = session.get('userId')?.value;
    if (userId) {
      await grantBadge(userId, 'top_reviewer');
    }

    return { success: true, review };
  } catch (error) {
    console.error('Failed to submit review:', error);
    return { success: false, message: 'Failed to submit review' };
  }
}

export async function submitQuestion(data: {
  productId: string;
  content: string;
  authorName: string;
}) {
  try {
    const question = await prisma.question.create({
      data: {
        productId: data.productId,
        content: data.content,
        authorName: data.authorName
      }
    });
    return { success: true, question };
  } catch (error) {
    console.error('Failed to submit question:', error);
    return { success: false, message: 'Failed to submit question' };
  }
}

export async function getReviews(productId: string) {
  try {
    return await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return [];
  }
}

export async function getQuestions(productId: string) {
  try {
    return await prisma.question.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return [];
  }
}



export async function getSimilarProducts(productId: string) {
  try {
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true, type: true }
    });
    
    if (!currentProduct) return [];
    
    return await prisma.product.findMany({
      where: { 
        id: { not: productId },
        categoryId: currentProduct.categoryId,
        type: currentProduct.type
      },
      take: 4,
      orderBy: { editorRating: 'desc' }
    });
  } catch (error) {
    console.error('Failed to get similar products:', error);
    return [];
  }
}

// ==========================================
// Gamification
// ==========================================

export async function grantBadge(userId: string, badgeCode: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return false;
    
    // Only add if they don't already have it
    if (!user.badges.includes(badgeCode)) {
      await prisma.user.update({
        where: { id: userId },
        data: { badges: { push: badgeCode } }
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to grant badge:', error);
    return false;
  }
}

export async function getSiteFeedback() {
  try {
    return await prisma.siteFeedback.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
    });
  } catch (error) {
    console.error('Failed to fetch site feedback:', error);
    return [];
  }
}
