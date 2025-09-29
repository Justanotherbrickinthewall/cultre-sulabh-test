# Cultre Sulabh - Museum Collection App

A digital collection platform that allows museum visitors to upload their hand-drawn designs through a physical kiosk setup, with admin management and public slideshow display capabilities.

## 🎨 Features

### For Visitors

- **QR Code Integration**: Scan QR codes at museum kiosks to access the upload interface
- **Camera Capture**: Take photos of hand-drawn designs directly through the web app
- **Smart Cropping**: AI-assisted corner detection and manual cropping tools
- **Category Selection**: Choose between Men's and Women's design categories
- **Mobile Optimized**: Responsive design works perfectly on all devices

### For Administrators

- **Secure Dashboard**: Admin authentication with predefined credentials
- **Image Management**: View, filter, and manage all uploaded designs
- **Status Toggle**: Select/deselect designs for slideshow display
- **Bulk Actions**: Manage multiple images simultaneously
- **Real-time Updates**: See changes reflected immediately
- **Statistics Overview**: Track total uploads, selections, and category breakdowns

### For Display

- **Dynamic Slideshows**: Separate galleries for Men's and Women's designs
- **Auto-refresh**: Automatically fetches newly selected images
- **Interactive Controls**: Play/pause, navigation, and keyboard shortcuts
- **Creator Credits**: Display artist names and upload dates
- **Responsive Design**: Works on various screen sizes for museum displays

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Vercel Postgres (Serverless)
- **Storage**: Vercel Blob for image hosting
- **Authentication**: NextAuth.js with credentials provider
- **UI Components**: shadcn/ui with Tailwind CSS
- **Animations**: Framer Motion
- **Image Processing**: React Image Crop + Sharp
- **TypeScript**: Full type safety throughout

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Vercel account (for database and storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cultre-sulabh
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Fill in your Vercel credentials:

   ```env
   # Database (from Vercel Postgres)
   POSTGRES_URL=
   POSTGRES_PRISMA_URL=
   POSTGRES_URL_NON_POOLING=

   # Storage (from Vercel Blob)
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_hXDc755Noqkrltyn_zZaCwp403RGsFYl98MZ80gNLbvpAmF"

   # Authentication
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000

   # Admin Credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

4. **Initialize the database**

   ```bash
   npm run dev
   # Then visit: http://localhost:3000/api/admin/init-db (POST request)
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Application Routes

### Public Routes

- `/` - Landing page with navigation
- `/upload` - Image collection interface for visitors
- `/slideshow/men` - Men's design gallery
- `/slideshow/women` - Women's design gallery

### Admin Routes (Protected)

- `/admin` - Redirects to dashboard
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Main management interface

### API Routes

- `POST /api/images` - Upload new images
- `GET /api/images` - Fetch all images (admin only)
- `PUT /api/images/[id]/status` - Update image status
- `GET /api/images/selected/[category]` - Get selected images for slideshow
- `PUT /api/images/bulk` - Bulk status updates

## 🎯 Usage Guide

### Setting Up the Physical Kiosk

1. **Materials Needed**:

   - Drawing board or paper pad
   - Pens/markers for visitors
   - QR code display (pointing to `/upload` route)
   - Instructions sign

2. **QR Code Setup**:
   Generate a QR code that points to: `https://your-domain.com/upload`

3. **Kiosk Instructions**:

   ```
   🎨 Share Your Creative Design!

   1. Draw your design on the paper
   2. Scan the QR code with your phone
   3. Follow the on-screen instructions
   4. Your design might be featured in our gallery!
   ```

### Admin Management

1. **Login**: Use credentials from your environment variables
2. **Review Designs**: Browse uploaded designs by category
3. **Curate Selection**: Toggle designs on/off for slideshow display
4. **Monitor Stats**: Track upload and selection metrics

### Display Setup

1. **Men's Gallery**: Set up a screen pointing to `/slideshow/men`
2. **Women's Gallery**: Set up a screen pointing to `/slideshow/women`
3. **Auto-refresh**: Slideshows automatically fetch new selections every 30 seconds

## 🔧 Development

### Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Protected admin routes
│   ├── (public)/          # Public visitor routes
│   ├── api/               # API endpoints
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── admin/            # Admin dashboard components
│   ├── camera/           # Camera capture components
│   ├── image-crop/       # Image cropping components
│   └── slideshow/        # Gallery display components
├── lib/                  # Utilities and configurations
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

### Key Components

- **CameraCapture**: Handles device camera access and photo capture
- **ImageCropper**: Provides cropping interface with corner detection
- **ImageGallery**: Admin interface for managing uploaded designs
- **Slideshow**: Dynamic gallery display with animations
- **AdminHeader**: Navigation and authentication for admin pages

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
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Environment**: Add all environment variables in Vercel dashboard
3. **Set up Database**: Create a Vercel Postgres database
4. **Set up Storage**: Create a Vercel Blob store
5. **Deploy**: Automatic deployment on git push

### Manual Deployment

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

## 🔒 Security Considerations

- Admin credentials are environment-based (change defaults in production)
- File uploads are validated for type and size
- API routes have proper authentication checks
- CORS policies are configured appropriately
- Input validation using Zod schemas

## 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Automatic error reporting
- **Custom Metrics**: Track upload success rates and admin actions
- **Database Monitoring**: Query performance and connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with the Vercel ecosystem for seamless development and deployment
- UI components powered by shadcn/ui for consistent design
- Camera integration using modern Web APIs
- Image processing with Sharp for optimal performance

---

**Built with ❤️ for creative expression in museums**
