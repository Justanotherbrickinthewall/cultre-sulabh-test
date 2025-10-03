import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { updateCollectionName } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(1).max(200) });

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid name' }, { status: 400 });
    }

    await updateCollectionName(id, parsed.data.name);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating collection name:', error);
    return NextResponse.json({ success: false, error: 'Failed to update collection name' }, { status: 500 });
  }
}
