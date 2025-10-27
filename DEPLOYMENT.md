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

## ✅ Deploying with Neon (Postgres)

Neon is a good choice for Postgres hosting. Use the pooler URL for your app runtime and the direct URL for administrative tasks.

1. In your Neon dashboard, get the Pooler connection string (it usually contains `-pooler` in the host). Example (already added to `.env.neon`):

```
DATABASE_URL="postgresql://neondb_owner:npg_G6iK9vPtmqWk@ep-royal-term-adueoroe-pooler.c-2.us-east-1.aws.neon.tech/tele-wms?sslmode=require&channel_binding=require"
```

2. In Vercel (or Netlify), add an environment variable named `DATABASE_URL` with the Pooler URL for Production/Preview environments. For one-off psql or migrations, keep the direct URL in a secure place (NEON_DIRECT_URL).

### Running Prisma against Neon

Locally, to run migrations and push the schema to Neon:

1. Install dependencies

```bash
npm install
```

2. Set the environment variable for the session (Windows cmd.exe example):

```bash
set DATABASE_URL=postgresql://neondb_owner:...@ep-...-pooler.../tele-wms?sslmode=require&channel_binding=require
npm run db:generate
npx prisma db push --accept-data-loss
npx prisma db seed
```

> Note: Use `prisma migrate deploy` in CI to apply migrations in production where migrations were created locally.

### Force the app to use Neon at runtime

We updated `lib/prisma.ts` so the application will prefer the `DATABASE_URL` environment variable at runtime. This means:

- If you set `DATABASE_URL` in your hosting provider (Vercel, Netlify, etc.) to the Neon pooler URL, the running app will connect to Neon for all database operations.
- If `DATABASE_URL` is not set, the app falls back to the datasource specified in `prisma/schema.prisma` (useful for isolated local dev).

Make sure to add `DATABASE_URL` to your production and preview environment variables in the hosting dashboard.

### Data Migration

We added a helper `scripts/migrate-to-neon.js` which reads from your local `prisma/dev-reset.db` SQLite file and copies data into Neon while preserving IDs and relations where possible.

Run it after setting `DATABASE_URL` in your environment or by copying `.env.neon` to `.env` temporarily (don't commit `.env`).

```bash
# Windows (cmd.exe)
set DATABASE_URL=postgresql://...pooler.../tele-wms?sslmode=require&channel_binding=require
node scripts/migrate-to-neon.js
```

### Final notes

- Keep `.env.neon` out of version control. Use your hosting provider's secret storage.
- Verify counts and sample rows after migration.
- If you have large data, consider batching or more robust ETL tooling.
