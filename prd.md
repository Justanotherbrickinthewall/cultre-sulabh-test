# Product Requirements Document (PRD)

## Museum Collection App - "Cultre Sulabh"

### Project Overview

A digital collection platform that allows museum visitors to upload hand-drawn designs through a physical kiosk setup, with admin management and public slideshow display capabilities.

### Target Users

- **Primary Users**: Museum visitors (up to 10 per day)
- **Secondary Users**: Museum administrators (1-2 people)
- **End Viewers**: Museum visitors viewing the slideshow displays

### Core Features

#### 1. Image Collection App (Visitor Interface)

**User Journey:**

1. Visitor draws design on physical drawing board at museum kiosk
2. Scans QR code with phone camera
3. Redirected to web application
4. Enters name and email
5. Clicks "Upload Image" button
6. Camera opens for photo capture
7. Image processing automatically detects paper corners
8. User selects category (Men/Women)
9. User can adjust viewport to crop image properly
10. Submits image to database

**Technical Requirements:**

- Responsive web interface optimized for mobile
- Camera integration for photo capture
- Image processing for corner detection and cropping
- Category selection (Men/Women)
- Form validation for name and email
- Image compression and optimization

#### 2. Management App (Admin Interface)

**Admin Capabilities:**

- Secure login with predefined credentials
- View all uploaded images organized by category (Men/Women)
- Image cards display:
  - Uploaded image
  - Creator's name
  - Current status (Selected/Not Selected)
  - Toggle checkbox for selection
- Confirmation prompt when toggling selection status
- Real-time status updates
- Bulk selection capabilities

**User Interface:**

- Clean, intuitive dashboard
- Category filtering
- Search functionality by creator name
- Image preview with zoom capability
- Status indicators and visual feedback

#### 3. Slideshow App (Public Display)

**Display Features:**

- Two separate screens: Men's designs and Women's designs
- Automatic slideshow with configurable timing
- Smooth transitions between images
- Creator credits displayed with each image
- Loop functionality for continuous display
- Responsive design for various screen sizes

**Technical Requirements:**

- Real-time data fetching for selected images
- Automatic refresh when new images are selected
- Fallback content when no images are available
- Performance optimization for smooth playback

### Physical Infrastructure

- **Kiosk Setup**: Drawing board, pen, QR code display
- **QR Code**: Links directly to image collection web app
- **Display Screens**: Two separate screens for Men/Women categories

### Data Flow

1. **Upload**: Visitor → Image Collection App → Database (status: "Not Selected")
2. **Review**: Admin → Management App → Database (status: "Selected"/"Not Selected")
3. **Display**: Slideshow App → Database (fetches only "Selected" images)

### Database Schema

```
Images Table:
- id (primary key)
- image_url (string)
- creator_name (string)
- creator_email (string)
- category (enum: 'men', 'women')
- status (enum: 'not_selected', 'selected')
- created_at (timestamp)
- updated_at (timestamp)
```

### Success Metrics

- Number of successful image uploads per day
- Admin selection rate (percentage of images selected)
- User engagement time on slideshow displays
- System uptime and performance

### Constraints

- Maximum 10 users per day
- Simple, quirky UI design
- Vercel ecosystem preference
- Minimal complexity for easy maintenance

### Future Enhancements (Phase 2)

- Social sharing capabilities
- Visitor voting system
- Analytics dashboard
- Multi-language support
- Advanced image filters and effects
