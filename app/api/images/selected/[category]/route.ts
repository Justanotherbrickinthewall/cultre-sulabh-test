import { NextRequest, NextResponse } from 'next/server';
import { getSelectedImages } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    if (category !== 'men' && category !== 'women') {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    const images = await getSelectedImages(category);
    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error('Error fetching selected images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch selected images' },
      { status: 500 }
    );
  }
}
