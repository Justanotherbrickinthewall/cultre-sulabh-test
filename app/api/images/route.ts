import { NextRequest, NextResponse } from 'next/server';
import { getAllImages, createImage, ensureCollection } from '@/lib/db';
import { uploadImage, generateFilename } from '@/lib/blob';
import { validateImageFile } from '@/lib/utils';
import { z } from 'zod';

const uploadSchema = z.object({
  collection_id: z.string().uuid('collection_id must be a valid UUID'),
  creator_name: z.string().min(1, 'Name is required').max(100),
  creator_email: z.string().email('Valid email is required').optional().or(z.literal('')),
  creator_phone: z.string().optional().or(z.literal('')),
  collection_name: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  category: z.enum(['men', 'women', 'others'], { message: 'Category is required' }),
  custom_category_name: z.string().optional().or(z.literal('')),
});

export async function GET() {
  try {
    const images = await getAllImages();
    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const collection_id = formData.get('collection_id') as string;
    const creator_name = formData.get('creator_name') as string;
    const creator_email = formData.get('creator_email') as string;
    const creator_phone = formData.get('creator_phone') as string;
    const collection_name = formData.get('collection_name') as string;
    const location = formData.get('location') as string;
    const category = formData.get('category') as string;
    const custom_category_name = formData.get('custom_category_name') as string;

    // Validate form data
    const validationResult = uploadSchema.safeParse({
      collection_id,
      creator_name,
      creator_email: creator_email || undefined,
      creator_phone: creator_phone || undefined,
      collection_name: collection_name || undefined,
      location: location || undefined,
      category,
      custom_category_name: custom_category_name || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    // Ensure collection exists FIRST
    await ensureCollection({ 
      id: collection_id, 
      creator_name, 
      creator_email: creator_email || undefined, 
      creator_phone: creator_phone || undefined,
      collection_name: collection_name || undefined,
      location: location || undefined
    });

    // Validate file
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Image file is required' },
        { status: 400 }
      );
    }

    const fileValidation = validateImageFile(file);
    if (!fileValidation.valid) {
      return NextResponse.json(
        { success: false, error: fileValidation.error },
        { status: 400 }
      );
    }

    // Upload to blob storage
    const filename = generateFilename(file.name, category);
    const imageUrl = await uploadImage(file, filename);

    // Save to database
    const image = await createImage({
      collection_id,
      image_url: imageUrl,
      category: category as 'men' | 'women' | 'others',
      custom_category_name: custom_category_name || undefined,
    });

    return NextResponse.json({ success: true, data: image }, { status: 201 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
