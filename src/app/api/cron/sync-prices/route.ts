import { NextResponse } from 'next/server';
import { syncAmazonPrices } from '@/lib/amazon-sync';

// Optional: You can enforce a secret token to prevent unauthorized access to your cron job
// by passing ?token=YOUR_SECRET_TOKEN in the URL.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  // Basic security check (in production, use environment variables)
  if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await syncAmazonPrices();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully synced Amazon PA-API prices',
      stats: result 
    }, { status: 200 });
  } catch (error) {
    console.error('CRON sync-prices error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
