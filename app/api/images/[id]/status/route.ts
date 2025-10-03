import { NextRequest, NextResponse } from 'next/server';
import { updateCollectionStatusByImageId } from '@/lib/db';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const statusSchema = z.object({
  status: z.enum(['selected', 'not_selected']),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validationResult = statusSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const { status } = validationResult.data;
    const images = await updateCollectionStatusByImageId(id, status);

    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error('Error updating image status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update image status' },
      { status: 500 }
    );
  }
}
