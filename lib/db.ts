import { sql } from '@vercel/postgres';
import { Image, AdminUser } from '@/types';

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Images operations
export async function createImage(data: {
  image_url: string;
  creator_name: string;
  creator_email: string;
  category: 'men' | 'women';
}): Promise<Image> {
  try {
    const result = await sql`
      INSERT INTO images (image_url, creator_name, creator_email, category)
      VALUES (${data.image_url}, ${data.creator_name}, ${data.creator_email}, ${data.category})
      RETURNING *
    `;
    return result.rows[0] as Image;
  } catch (error) {
    throw new DatabaseError('Failed to create image', error);
  }
}

export async function getAllImages(): Promise<Image[]> {
  try {
    const result = await sql`
      SELECT * FROM images 
      ORDER BY created_at DESC
    `;
    return result.rows as Image[];
  } catch (error) {
    throw new DatabaseError('Failed to fetch images', error);
  }
}

export async function getImagesByCategory(category: 'men' | 'women'): Promise<Image[]> {
  try {
    const result = await sql`
      SELECT * FROM images 
      WHERE category = ${category}
      ORDER BY created_at DESC
    `;
    return result.rows as Image[];
  } catch (error) {
    throw new DatabaseError('Failed to fetch images by category', error);
  }
}

export async function getSelectedImages(category: 'men' | 'women'): Promise<Image[]> {
  try {
    const result = await sql`
      SELECT * FROM images 
      WHERE category = ${category} AND status = 'selected'
      ORDER BY created_at DESC
    `;
    return result.rows as Image[];
  } catch (error) {
    throw new DatabaseError('Failed to fetch selected images', error);
  }
}

export async function updateImageStatus(
  id: string, 
  status: 'selected' | 'not_selected'
): Promise<Image> {
  try {
    const result = await sql`
      UPDATE images 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (result.rows.length === 0) {
      throw new Error('Image not found');
    }
    
    return result.rows[0] as Image;
  } catch (error) {
    throw new DatabaseError('Failed to update image status', error);
  }
}

export async function bulkUpdateImageStatus(
  ids: string[], 
  status: 'selected' | 'not_selected'
): Promise<Image[]> {
  try {
    if (ids.length === 0) return [];
    
    // Update images one by one for now (this can be optimized later)
    const updatedImages: Image[] = [];
    for (const id of ids) {
      const updated = await updateImageStatus(id, status);
      updatedImages.push(updated);
    }
    return updatedImages;
  } catch (error) {
    throw new DatabaseError('Failed to bulk update image status', error);
  }
}

// Admin operations
export async function getAdminByUsername(username: string): Promise<AdminUser | null> {
  try {
    const result = await sql`
      SELECT id, username, created_at FROM admin_users 
      WHERE username = ${username}
    `;
    return result.rows[0] as AdminUser || null;
  } catch (error) {
    throw new DatabaseError('Failed to fetch admin user', error);
  }
}

export async function verifyAdminPassword(username: string, password: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT password_hash FROM admin_users 
      WHERE username = ${username}
    `;
    
    if (result.rows.length === 0) {
      return false;
    }
    
    // For simplicity, we'll compare plain text passwords
    // In production, use bcrypt or similar
    return result.rows[0].password_hash === password;
  } catch (error) {
    throw new DatabaseError('Failed to verify admin password', error);
  }
}

// Database initialization
export async function initializeDatabase(): Promise<void> {
  try {
    // Create images table
    await sql`
      CREATE TABLE IF NOT EXISTS images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        image_url TEXT NOT NULL,
        creator_name VARCHAR(100) NOT NULL,
        creator_email VARCHAR(255) NOT NULL,
        category VARCHAR(10) CHECK (category IN ('men', 'women')) NOT NULL,
        status VARCHAR(20) CHECK (status IN ('not_selected', 'selected')) DEFAULT 'not_selected',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create admin_users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_images_category ON images(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_images_status ON images(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at)`;

    // Insert default admin user if not exists
    await sql`
      INSERT INTO admin_users (username, password_hash)
      VALUES ('admin', 'admin123')
      ON CONFLICT (username) DO NOTHING
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    throw new DatabaseError('Failed to initialize database', error);
  }
}
