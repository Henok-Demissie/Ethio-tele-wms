# Deployment Guide - EthioTelecom WMS

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Prepare for Deployment

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

### Step 2: Deploy the Application

1. **Deploy from your project directory:**
   ```bash
   vercel
   ```

2. **Follow the prompts:**
   - Link to existing project? **No**
   - Project name: `ethio-tele-wms`
   - Directory: `./` (current directory)
   - Override settings? **No**

### Step 3: Configure Environment Variables

In your Vercel dashboard, add these environment variables:

```
DATABASE_URL=file:./dev.db
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Step 4: Database Setup

For production, consider using:
- **PlanetScale** (MySQL)
- **Neon** (PostgreSQL)
- **Supabase** (PostgreSQL)
- **Railway** (PostgreSQL)

Update your `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql" // or "mysql"
  url      = env("DATABASE_URL")
}
```

### Step 5: Deploy Database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

## 🌐 Alternative Deployment Options

### Netlify
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`

### Railway
1. Connect GitHub repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy automatically

### Heroku
1. Create Heroku app
2. Add PostgreSQL addon
3. Set environment variables
4. Deploy via Git

## 🔧 Production Checklist

- [ ] Environment variables configured
- [ ] Database migrated to production
- [ ] Domain configured (optional)
- [ ] SSL certificate enabled
- [ ] Performance monitoring set up
- [ ] Error tracking configured

## 📱 Access Your Deployed App

After deployment, your app will be available at:
`https://your-app-name.vercel.app`

## 🆘 Troubleshooting

### Common Issues:
1. **Build Errors**: Check Node.js version compatibility
2. **Database Errors**: Verify DATABASE_URL is correct
3. **Authentication Issues**: Check NEXTAUTH_SECRET and NEXTAUTH_URL

### Support:
- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
