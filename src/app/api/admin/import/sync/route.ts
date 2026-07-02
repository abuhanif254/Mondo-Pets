import { NextResponse } from 'next/server';
import { AffiliateSyncProvider } from '@/lib/affiliate-sync';

export async function POST(request: Request) {
  try {
    const syncProvider = new AffiliateSyncProvider();
    const count = await syncProvider.sync();

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error('Sync API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
