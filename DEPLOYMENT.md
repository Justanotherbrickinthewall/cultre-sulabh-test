# Deployment Guide - Cultre Sulabh

## 🚀 Quick Deployment to Vercel

### Step 1: Prepare Your Repository

1. Push your code to GitHub
2. Ensure all files are committed and pushed

### Step 2: Set Up Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Choose "Next.js" as the framework preset

### Step 3: Configure Environment Variables

In your Vercel project dashboard, go to Settings > Environment Variables and add:

```env
# Database - Create a Vercel Postgres database first
POSTGRES_URL=<your-postgres-url>
POSTGRES_PRISMA_URL=<your-postgres-prisma-url>
POSTGRES_URL_NON_POOLING=<your-postgres-non-pooling-url>

# Storage - Create a Vercel Blob store first
BLOB_READ_WRITE_TOKEN=<your-blob-token>

# Authentication
NEXTAUTH_SECRET=<generate-a-random-secret>
NEXTAUTH_URL=https://your-app-name.vercel.app

# Admin Credentials (Change these!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Step 4: Set Up Vercel Postgres

1. In your Vercel dashboard, go to Storage tab
2. Create a new Postgres database
3. Copy the connection strings to your environment variables

### Step 5: Set Up Vercel Blob

1. In your Vercel dashboard, go to Storage tab
2. Create a new Blob store
3. Copy the token to your environment variables

### Step 6: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be live at `https://your-app-name.vercel.app`

### Step 7: Initialize Database

1. Visit `https://your-app-name.vercel.app/api/admin/init-db`
2. Send a POST request (you can use a tool like Postman or curl)
3. This will create the necessary database tables

### Step 8: Test Your Application

1. Visit your app URL
2. Try the upload flow: `https://your-app-name.vercel.app/upload`
3. Test admin login: `https://your-app-name.vercel.app/admin`
4. Check slideshows: `https://your-app-name.vercel.app/slideshow/men`

## 🎯 Production Checklist

- [ ] Change default admin credentials
- [ ] Test image upload functionality
- [ ] Verify camera permissions work on mobile
- [ ] Test admin dashboard on different devices
- [ ] Ensure slideshows display correctly
- [ ] Set up domain (if custom domain needed)
- [ ] Configure any additional security headers
- [ ] Test QR code generation for kiosk setup

## 📱 QR Code Generation

Once deployed, generate QR codes for your museum kiosks:

1. **Upload QR Code**: Points to `https://your-app-name.vercel.app/upload`
2. **Men's Gallery QR Code**: Points to `https://your-app-name.vercel.app/slideshow/men`
3. **Women's Gallery QR Code**: Points to `https://your-app-name.vercel.app/slideshow/women`

You can use any QR code generator like:

- qr-code-generator.com
- qrcode.com
- Google Charts API

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection Error**

   - Verify all Postgres environment variables are correct
   - Ensure database is in the same Vercel team/account

2. **Image Upload Fails**

   - Check Blob storage token is correct
   - Verify CORS settings in Vercel dashboard

3. **Camera Not Working**

   - Ensure HTTPS is enabled (required for camera access)
   - Check browser permissions

4. **Admin Login Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check admin credentials in environment variables
   - Ensure NEXTAUTH_URL matches your domain

### Logs and Monitoring

- Check Vercel Function logs in the dashboard
- Monitor performance in Vercel Analytics
- Use Vercel Error Tracking for debugging

## 📊 Scaling Considerations

This app is designed for small-scale museum use (10 users/day), but if you need to scale:

1. **Database**: Vercel Postgres scales automatically
2. **Storage**: Vercel Blob has generous limits
3. **Performance**: Consider adding Redis for caching
4. **Monitoring**: Set up alerts for high usage

## 💰 Cost Estimates

For typical museum usage (10 users/day):

- Vercel Pro: $20/month
- Postgres: $0-5/month
- Blob Storage: $0-2/month
- **Total: ~$25/month**

## 🔒 Security Best Practices

1. **Change Default Credentials**: Never use default admin credentials in production
2. **Environment Variables**: Keep all secrets in Vercel environment variables
3. **HTTPS Only**: Ensure your app only runs over HTTPS
4. **Regular Updates**: Keep dependencies updated
5. **Monitor Access**: Check Vercel logs regularly for unusual activity

---

Your museum collection app is now ready for production! 🎨✨
