import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json();

    if (!type || !data) {
      return NextResponse.json({ success: false, message: 'Type and data are required' }, { status: 400 });
    }

    if (type === 'product') {
      const newProduct = await prisma.product.create({
        data: {
          title: data.title,
          slug: data.slug || `prod-${Date.now()}`,
          description: data.description || '',
          price: Number(data.price) || 0.0,
          currency: 'USD',
          brand: data.brand || null,
          lifeStage: data.lifeStage || null,
          dietaryNeeds: data.dietaryNeeds || null,
          type: data.type || 'food',
          petType: data.petType || 'Dog',
          ingredients: data.ingredients || null,
          proteinPercent: data.proteinPercent !== null && data.proteinPercent !== undefined ? Number(data.proteinPercent) : null,
          fatPercent: data.fatPercent !== null && data.fatPercent !== undefined ? Number(data.fatPercent) : null,
          fiberPercent: data.fiberPercent !== null && data.fiberPercent !== undefined ? Number(data.fiberPercent) : null,
          moisturePercent: data.moisturePercent !== null && data.moisturePercent !== undefined ? Number(data.moisturePercent) : null,
          caloricContent: data.caloricContent || null,
          editorRating: data.editorRating !== null && data.editorRating !== undefined ? Number(data.editorRating) : null,
          amazonASIN: data.amazonASIN || null,
          amazonUrl: data.amazonUrl || null,
          categoryId: data.categoryId,
          inStock: true,
          commissionRate: data.commissionRate !== null && data.commissionRate !== undefined ? Number(data.commissionRate) : null,
          estimatedMargin: data.estimatedMargin !== null && data.estimatedMargin !== undefined ? Number(data.estimatedMargin) : null
        }
      });
      return NextResponse.json({ success: true, item: newProduct });
    }

    if (type === 'blog') {
      // Validate unique slug
      const existing = await prisma.blog.findUnique({
        where: { slug: data.slug }
      });
      const finalSlug = existing ? `${data.slug}-${Date.now().toString().slice(-4)}` : data.slug;

      const newBlog = await prisma.blog.create({
        data: {
          title: data.title,
          slug: finalSlug,
          excerpt: data.excerpt || '',
          content: data.content || '',
          tags: data.tags || [],
          isFeatured: !!data.isFeatured,
          authorId: data.authorId,
          categoryId: data.categoryId,
          readTimeMinutes: Math.max(1, Math.ceil((data.content || '').split(/\s+/).length / 200))
        }
      });
      return NextResponse.json({ success: true, item: newBlog });
    }

    return NextResponse.json({ success: false, message: 'Invalid content type' }, { status: 400 });
  } catch (error: any) {
    console.error('Error saving content:', error);
    return NextResponse.json({ success: false, message: error.message || 'Database insert failed' }, { status: 500 });
  }
}
