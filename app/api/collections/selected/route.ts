import { NextResponse } from 'next/server';
import { getSelectedCollections } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const collections = await getSelectedCollections();
    return NextResponse.json({ success: true, data: collections });
  } catch (error) {
    console.error('Error fetching selected collections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

