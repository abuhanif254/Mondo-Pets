import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Papa from 'papaparse';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    
    // Parse CSV
    const { data, errors } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      console.error('CSV Parsing Errors:', errors);
      return NextResponse.json({ error: 'Failed to parse CSV file properly' }, { status: 400 });
    }

    let count = 0;

    // Process each row
    for (const row of data as any[]) {
      const { title, price, commissionRate, imageUrl, affiliateUrl, amazonUrl, chewyUrl, type, petType, categorySlug } = row;
      
      if (!title || !price || (!affiliateUrl && !amazonUrl && !chewyUrl) || !categorySlug) {
        continue; // Skip invalid rows
      }

      // Find or create category
      let category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
            slug: categorySlug,
            description: `Auto-generated category for ${categorySlug}`,
          },
        });
      }

      const numericPrice = parseFloat(price);
      const numericCommission = commissionRate ? parseFloat(commissionRate) : 0;
      const estimatedMargin = numericPrice * (numericCommission / 100);

      // Upsert product (assuming title is a good unique-ish identifier, but ideally we'd use an external ID)
      // Since title is not @unique in schema, we'll find first or create
      const existingProduct = await prisma.product.findFirst({
        where: { title },
      });

      if (existingProduct) {
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            price: numericPrice,
            commissionRate: numericCommission,
            estimatedMargin,
            imageUrl: imageUrl || existingProduct.imageUrl,
            affiliateUrl,
            amazonUrl,
            chewyUrl,
            type: type || 'toy',
            petType: petType || null,
            categoryId: category.id,
          },
        });
      } else {
        await prisma.product.create({
          data: {
            title,
            price: numericPrice,
            commissionRate: numericCommission,
            estimatedMargin,
            imageUrl: imageUrl || '/placeholder.jpg',
            affiliateUrl,
            amazonUrl,
            chewyUrl,
            type: type || 'toy',
            petType: petType || null,
            categoryId: category.id,
          },
        });
      }
      count++;
    }

    return NextResponse.json({ success: true, count });

  } catch (error) {
    console.error('CSV Import Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
