import { NextRequest, NextResponse } from 'next/server';
import { getAllImages, createImage } from '@/lib/db';
import { uploadImage, generateFilename } from '@/lib/blob';
import { validateImageFile } from '@/lib/utils';
import { z } from 'zod';

const uploadSchema = z.object({
  creator_name: z.string().min(1, 'Name is required').max(100),
  creator_email: z.string().email('Valid email is required'),
  category: z.enum(['men', 'women'], { required_error: 'Category is required' }),
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
    const creator_name = formData.get('creator_name') as string;
    const creator_email = formData.get('creator_email') as string;
    const category = formData.get('category') as string;

    // Validate form data
    const validationResult = uploadSchema.safeParse({
      creator_name,
      creator_email,
      category,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

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
      image_url: imageUrl,
      creator_name,
      creator_email,
      category: category as 'men' | 'women',
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
