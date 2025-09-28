# Technical Architecture & Stack

## Museum Collection App - "Cultre Sulabh"

### Core Philosophy

- **Simplicity First**: Minimal complexity for easy maintenance
- **Vercel Ecosystem**: Leveraging Vercel's full-stack capabilities
- **Quirky UI**: Modern, playful design with smooth animations
- **Performance**: Optimized for 10 users/day with room to scale

### Tech Stack Overview

#### Frontend Framework

- **Next.js 14** (App Router)
  - Server-side rendering for better performance
  - Built-in API routes for backend functionality
  - Image optimization out of the box
  - TypeScript for type safety

#### UI Framework & Styling

- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Pre-built, accessible components
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Consistent iconography
- **Custom CSS** - For quirky, museum-specific design elements

#### Database & Storage

- **Vercel Postgres** (Neon)

  - Serverless PostgreSQL
  - Automatic scaling
  - Built-in connection pooling
  - Perfect for small-scale applications

- **Vercel Blob Storage**
  - Image storage and CDN
  - Automatic optimization
  - Global edge distribution
  - Cost-effective for small volumes

#### Authentication & Security

- **NextAuth.js** (Auth.js)
  - Simple admin authentication
  - Predefined credentials
  - Session management
  - CSRF protection

#### Image Processing

- **Sharp** - Server-side image processing
- **OpenCV.js** - Client-side corner detection
- **React Image Crop** - User-friendly cropping interface

#### Deployment & Infrastructure

- **Vercel Platform**
  - Automatic deployments from Git
  - Edge functions for API routes
  - Global CDN
  - Environment management
  - Analytics and monitoring

### Project Structure

```
cultre-sulabh/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group
│   │   └── admin/
│   │       └── login/
│   ├── (public)/                 # Public routes
│   │   ├── upload/               # Image collection app
│   │   └── slideshow/            # Public display
│   │       ├── men/
│   │       └── women/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── images/
│   │   └── admin/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── camera/
│   ├── image-crop/
│   ├── slideshow/
│   └── admin/
├── lib/                          # Utilities
│   ├── auth.ts
│   ├── db.ts
│   ├── blob.ts
│   └── utils.ts
├── types/                        # TypeScript definitions
├── public/                       # Static assets
└── package.json
```

### Database Schema

```sql
-- Images table
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  creator_name VARCHAR(100) NOT NULL,
  creator_email VARCHAR(255) NOT NULL,
  category VARCHAR(10) CHECK (category IN ('men', 'women')) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('not_selected', 'selected')) DEFAULT 'not_selected',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_images_category ON images(category);
CREATE INDEX idx_images_status ON images(status);
CREATE INDEX idx_images_created_at ON images(created_at);
```

### API Endpoints

```
POST /api/images/upload          # Upload new image
GET  /api/images                 # Get all images (admin)
PUT  /api/images/:id/status      # Update image status
GET  /api/images/selected/:category  # Get selected images for slideshow

POST /api/auth/login             # Admin login
POST /api/auth/logout            # Admin logout
GET  /api/auth/session           # Get current session
```

### Key Features Implementation

#### Image Collection App

- **Camera Integration**: `navigator.mediaDevices.getUserMedia()`
- **Corner Detection**: OpenCV.js for automatic paper detection
- **Image Cropping**: React Image Crop component
- **Upload**: Direct to Vercel Blob with metadata to Postgres

#### Management App

- **Authentication**: NextAuth.js with credentials provider
- **Image Gallery**: Virtualized list for performance
- **Status Toggle**: Optimistic updates with rollback
- **Real-time Updates**: Server-sent events or polling

#### Slideshow App

- **Auto-play**: CSS animations with JavaScript controls
- **Responsive**: Mobile-first design
- **Performance**: Image preloading and lazy loading
- **Fallback**: Graceful handling of empty states

### Development Workflow

1. **Local Development**: `npm run dev`
2. **Database**: Vercel Postgres with local connection
3. **Storage**: Vercel Blob with local development mode
4. **Deployment**: Automatic via Vercel Git integration

### Environment Variables

```env
# Database
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=

# Blob Storage
BLOB_READ_WRITE_TOKEN=

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Admin Credentials
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=
```

### Performance Considerations

- **Image Optimization**: Automatic WebP conversion
- **Caching**: Vercel Edge caching for static assets
- **Database**: Connection pooling and query optimization
- **Bundle Size**: Code splitting and tree shaking

### Security Measures

- **Input Validation**: Zod schemas for all inputs
- **File Upload**: Type and size restrictions
- **Authentication**: Secure session management
- **CORS**: Proper cross-origin configuration
- **Rate Limiting**: API endpoint protection

### Monitoring & Analytics

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Vercel Error Tracking
- **Custom Metrics**: Image upload success rates
- **Uptime Monitoring**: Vercel Status Page integration

### Cost Estimation (Monthly)

- **Vercel Pro**: $20/month
- **Vercel Postgres**: $0-5/month (small usage)
- **Vercel Blob**: $0-2/month (minimal storage)
- **Total**: ~$25/month for full production setup

### Deployment Strategy

1. **Development**: Local development with Vercel CLI
2. **Staging**: Preview deployments for testing
3. **Production**: Automatic deployment from main branch
4. **Rollback**: Instant rollback via Vercel dashboard

This architecture provides a solid foundation for your museum collection app while maintaining simplicity and leveraging the full power of the Vercel ecosystem!
