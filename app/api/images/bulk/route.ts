import { NextRequest, NextResponse } from 'next/server';
import { bulkUpdateImageStatus } from '@/lib/db';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const bulkUpdateSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one image ID is required'),
  status: z.enum(['selected', 'not_selected']),
});

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = bulkUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { ids, status } = validationResult.data;
    const images = await bulkUpdateImageStatus(ids, status);

    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error('Error bulk updating image status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to bulk update image status' },
      { status: 500 }
    );
  }
}
