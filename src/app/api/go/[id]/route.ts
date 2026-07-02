import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const url = new URL(request.url);
    const vendor = url.searchParams.get('vendor'); // 'amazon', 'chewy', or null
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Increment click count and log advanced analytics event
    const product = await prisma.product.update({
      where: { id },
      data: {
        clickCount: {
          increment: 1,
        },
        clickEvents: {
          create: {
            ipAddress,
            userAgent,
          }
        }
      },
      select: {
        amazonUrl: true,
        chewyUrl: true,
        affiliateUrl: true,
      },
    });

    let redirectUrl = product?.affiliateUrl;
    if (vendor === 'amazon' && product?.amazonUrl) redirectUrl = product.amazonUrl;
    if (vendor === 'chewy' && product?.chewyUrl) redirectUrl = product.chewyUrl;
    
    // Fallback if the requested vendor URL is missing but another one exists
    if (!redirectUrl) {
       redirectUrl = product?.amazonUrl || product?.chewyUrl || product?.affiliateUrl;
    }

    if (redirectUrl) {
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    console.error('Failed to track click:', error);
  }

  // Fallback to home if something fails or product not found
  return NextResponse.redirect(new URL('/', request.url));
}
