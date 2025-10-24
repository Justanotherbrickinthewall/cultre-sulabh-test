import { sql } from '@vercel/postgres';
import { Image, AdminUser, Collection } from '@/types';

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Images operations
export async function createImage(data: {
  collection_id: string;
  image_url: string;
  category: 'men' | 'women' | 'others';
  custom_category_name?: string;
}): Promise<Image> {
  try {
    const inserted = await sql`
      INSERT INTO images (collection_id, image_url, category, custom_category_name)
      VALUES (${data.collection_id}, ${data.image_url}, ${data.category}, ${data.custom_category_name || null})
      RETURNING id
    `;
    const id = inserted.rows[0].id as string;
    const joined = await sql`
      SELECT 
        i.id,
        i.collection_id,
        i.image_url,
        c.collection_name,
        c.updated_at AS collection_updated_at,
        c.creator_name,
        c.creator_email,
        c.creator_phone,
        i.category,
        i.custom_category_name,
        c.status,
        i.created_at,
        i.updated_at
      FROM images i
      JOIN collections c ON c.id = i.collection_id
      WHERE i.id = ${id}
    `;
    return joined.rows[0] as Image;
  } catch (error) {
    throw new DatabaseError('Failed to create image', error);
  }
}

// Collections operations
export async function ensureCollection(data: {
  id: string;
  creator_name: string;
  creator_email?: string;
  creator_phone?: string;
  collection_name?: string;
  location?: string;
}): Promise<void> {
  try {
    const collectionName = data.collection_name || `${data.creator_name}'s Designs`;
    await sql`
      INSERT INTO collections (id, collection_name, creator_name, creator_email, creator_phone, location)
      VALUES (${data.id}, ${collectionName}, ${data.creator_name}, ${data.creator_email || null}, ${data.creator_phone || null}, ${data.location || null})
      ON CONFLICT (id) DO UPDATE SET
        collection_name = EXCLUDED.collection_name,
        creator_name = EXCLUDED.creator_name,
        creator_email = EXCLUDED.creator_email,
        creator_phone = EXCLUDED.creator_phone,
        location = EXCLUDED.location,
        updated_at = NOW()
    `;
  } catch (error) {
    throw new DatabaseError('Failed to ensure collection', error);
  }
}

export async function getAllImages(): Promise<Image[]> {
  try {
    const result = await sql`
      SELECT 
        i.id,
        i.collection_id,
        i.image_url,
        c.collection_name,
        c.updated_at AS collection_updated_at,
        c.creator_name,
        c.creator_email,
        c.creator_phone,
        c.location,
        i.category,
        i.custom_category_name,
        c.status,
        i.created_at,
        i.updated_at
      FROM images i
      JOIN collections c ON c.id = i.collection_id
      ORDER BY i.created_at DESC
    `;
    return result.rows as Image[];
  } catch (error) {
    throw new DatabaseError('Failed to fetch images', error);
  }
}

export async function getImagesByCategory(category: 'men' | 'women'): Promise<Image[]> {
  try {
    const result = await sql`
      SELECT 
        i.id,
        i.collection_id,
        i.image_url,
        c.collection_name,
        c.updated_at AS collection_updated_at,
        c.creator_name,
        c.creator_email,
        c.creator_phone,
        c.location,
        i.category,
        i.custom_category_name,
        c.status,
        i.created_at,
        i.updated_at
      FROM images i
      JOIN collections c ON c.id = i.collection_id
      WHERE i.category = ${category}
      ORDER BY i.created_at DESC
    `;
    return result.rows as Image[];
  } catch (error) {
    throw new DatabaseError('Failed to fetch images by category', error);
  }
}

export async function getSelectedImages(category: 'men' | 'women'): Promise<Image[]> {
  try {
    const result = await sql`
      SELECT 
        i.id,
        i.collection_id,
        i.image_url,
        c.collection_name,
        c.updated_at AS collection_updated_at,
        c.creator_name,
        c.creator_email,
        c.creator_phone,
        c.location,
        i.category,
        i.custom_category_name,
        c.status,
        i.created_at,
        i.updated_at
      FROM images i
      JOIN collections c ON c.id = i.collection_id
      WHERE i.category = ${category} AND c.status = 'selected'
      ORDER BY i.created_at DESC
    `;
    return result.rows as Image[];
  } catch (error) {
    throw new DatabaseError('Failed to fetch selected images', error);
  }
}

export async function updateCollectionStatusByImageId(
  imageId: string, 
  status: 'selected' | 'not_selected'
): Promise<Image[]> {
  try {
    const col = await sql`SELECT collection_id FROM images WHERE id = ${imageId}`;
    if (col.rows.length === 0) {
      throw new Error('Image not found');
    }
    const collectionId = col.rows[0].collection_id as string;
    await sql`UPDATE collections SET status = ${status}, updated_at = NOW() WHERE id = ${collectionId}`;
    const result = await sql`
      SELECT 
        i.id,
        i.collection_id,
        i.image_url,
        c.collection_name,
        c.updated_at AS collection_updated_at,
        c.creator_name,
        c.creator_email,
        c.creator_phone,
        c.location,
        i.category,
        i.custom_category_name,
        c.status,
        i.created_at,
        i.updated_at
      FROM images i
      JOIN collections c ON c.id = i.collection_id
      WHERE i.collection_id = ${collectionId}
      ORDER BY i.created_at DESC
    `;
    return result.rows as Image[];
  } catch (error) {
    throw new DatabaseError('Failed to update collection status', error);
  }
}

export async function bulkUpdateImageStatus(
  ids: string[], 
  status: 'selected' | 'not_selected'
): Promise<Image[]> {
  try {
    if (ids.length === 0) return [];
    // Use the first image to infer the collection and update collection status
    return await updateCollectionStatusByImageId(ids[0], status);
  } catch (error) {
    throw new DatabaseError('Failed to bulk update image status', error);
  }
}

// Update collection name
export async function updateCollectionName(id: string, collectionName: string): Promise<void> {
  try {
    await sql`UPDATE collections SET collection_name = ${collectionName}, updated_at = NOW() WHERE id = ${id}`;
  } catch (error) {
    throw new DatabaseError('Failed to update collection name', error);
  }
}

// Get all selected collections with their images
export async function getSelectedCollections(): Promise<Collection[]> {
  try {
    const result = await sql`
      SELECT 
        c.id,
        c.collection_name,
        c.creator_name,
        c.creator_email,
        c.creator_phone,
        c.location,
        c.status,
        c.created_at,
        c.updated_at,
        json_agg(
          json_build_object(
            'id', i.id,
            'image_url', i.image_url,
            'category', i.category,
            'custom_category_name', i.custom_category_name,
            'created_at', i.created_at
          ) ORDER BY 
            CASE i.category
              WHEN 'men' THEN 1
              WHEN 'women' THEN 2
              WHEN 'others' THEN 3
            END
        ) as images
      FROM collections c
      LEFT JOIN images i ON i.collection_id = c.id
      WHERE c.status = 'selected'
      GROUP BY c.id, c.collection_name, c.creator_name, c.creator_email, c.creator_phone, c.location, c.status, c.created_at, c.updated_at
      ORDER BY c.updated_at DESC
    `;
    return result.rows as Collection[];
  } catch (error) {
    throw new DatabaseError('Failed to fetch selected collections', error);
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
    // Create collections table first
    await sql`
      CREATE TABLE IF NOT EXISTS collections (
        id UUID PRIMARY KEY,
        collection_name TEXT NOT NULL,
        creator_name VARCHAR(100) NOT NULL,
        creator_email VARCHAR(255),
        creator_phone VARCHAR(20),
        location VARCHAR(255),
        status VARCHAR(20) CHECK (status IN ('not_selected', 'selected')) DEFAULT 'not_selected',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create images table with FK to collections
    await sql`
      CREATE TABLE IF NOT EXISTS images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        category VARCHAR(10) CHECK (category IN ('men', 'women', 'others')) NOT NULL,
        custom_category_name VARCHAR(100),
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

    // Insert or update default admin user
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    await sql`
      INSERT INTO admin_users (username, password_hash)
      VALUES (${adminUsername}, ${adminPassword})
      ON CONFLICT (username) DO UPDATE SET
        password_hash = EXCLUDED.password_hash
    `;

    // Create indexes for better query performance
    await sql`CREATE INDEX IF NOT EXISTS idx_collections_created_at ON collections(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_collections_status ON collections(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_images_category ON images(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_images_collection_id ON images(collection_id)`;

    console.log('✅ Database initialized successfully');
    console.log('📊 Tables created: collections, images, admin_users');
    console.log('🔑 Indexes created for optimized queries');
  } catch (error) {
    throw new DatabaseError('Failed to initialize database', error);
  }
}
