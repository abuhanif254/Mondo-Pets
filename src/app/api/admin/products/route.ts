import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Convert string inputs to decimal/float where necessary
    const price = parseFloat(data.price || '0');
    const commissionRate = parseFloat(data.commissionRate || '0');
    const estimatedMargin = price * (commissionRate / 100);
    
    const product = await prisma.product.create({
      data: {
        title: data.title,
        price,
        commissionRate,
        estimatedMargin,
        imageUrl: data.imageUrl || '/placeholder.jpg',
        amazonUrl: data.amazonUrl,
        chewyUrl: data.chewyUrl,
        affiliateUrl: data.affiliateUrl,
        type: data.type || 'food',
        petType: data.petType,
        ingredients: data.ingredients,
        proteinPercent: data.proteinPercent ? parseFloat(data.proteinPercent) : null,
        fatPercent: data.fatPercent ? parseFloat(data.fatPercent) : null,
        fiberPercent: data.fiberPercent ? parseFloat(data.fiberPercent) : null,
        moisturePercent: data.moisturePercent ? parseFloat(data.moisturePercent) : null,
        caloricContent: data.caloricContent,
        editorRating: data.editorRating ? parseFloat(data.editorRating) : null,
        categoryId: data.categoryId,
      }
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
