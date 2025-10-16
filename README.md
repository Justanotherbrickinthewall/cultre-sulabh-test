# Cultre Sulabh

A modern web application for capturing and showcasing design collections with separate sections for men's and women's designs. Built with Next.js 15, React, and Tailwind CSS.

## Features

- 📸 Real-time camera capture and image processing
- ✂️ Built-in image cropping and enhancement tools
- 👔 Separate galleries for men's and women's designs
- 🎨 Additional section for custom design categories
- 🎭 Beautiful slideshow presentations
- 🔐 Admin dashboard with authentication
- 📱 Responsive design for all devices

## Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (for production)
- Vercel account (for blob storage)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/cultre-sulabh.git
   cd cultre-sulabh
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with:

   ```env
   # Auth
   AUTH_SECRET="your-auth-secret"

   # Database
   POSTGRES_URL="your-postgres-connection-string"

   # Storage
   BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   For HTTPS (required for camera access):

   ```bash
   npm run dev:https
   ```

5. Open [http://localhost:3000](http://localhost:3000) (or https://localhost:3000 for HTTPS) in your browser.

## Project Structure

- `app/` - Next.js app router pages and API routes
- `components/` - Reusable React components
  - `admin/` - Admin dashboard components
  - `camera/` - Camera capture functionality
  - `image-crop/` - Image editing tools
  - `slideshow/` - Gallery presentation components
  - `upload/` - Design upload interface
  - `ui/` - Shared UI components
- `lib/` - Utility functions and shared logic
- `types/` - TypeScript type definitions

## Key Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Image Processing**: OpenCV.js
- **Authentication**: NextAuth.js
- **Database**: Vercel Postgres
- **Storage**: Vercel Blob
- **Development**: Turbopack

## Available Scripts

- `npm run dev` - Start development server
- `npm run dev:https` - Start development server with HTTPS
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
