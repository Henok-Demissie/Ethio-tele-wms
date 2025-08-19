# EthioTelecom Warehouse Management System

A comprehensive warehouse management system built with Next.js 14, TypeScript, and Prisma.

## Features

- 📦 **Inventory Management** - Track products, quantities, and locations
- 🏢 **Warehouse Management** - Manage multiple warehouses and their operations
- 📥 **Stock In** - Handle incoming inventory and supplier management
- 📤 **Stock Out** - Process outgoing inventory requests
- 👥 **User Management** - Role-based access control
- 📊 **Dashboard** - Real-time analytics and reporting
- 🔍 **Audit Trail** - Complete tracking of all operations
- 📋 **Reports** - Comprehensive reporting system

## Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (optional - system works with mock data)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ethiotelecom-warehouse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration (Optional)
   DATABASE_URL="postgresql://username:password@localhost:5432/warehouse_db"
   
   # NextAuth Configuration
   NEXTAUTH_SECRET="your-super-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Application Configuration
   NODE_ENV="development"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Mode

If you don't have a database set up, the system will automatically run in demo mode with mock data.

**Demo Login Credentials:**
- Email: `demo@example.com`
- Password: `demo123`

## Database Setup (Optional)

1. **Install PostgreSQL**
2. **Create a database**
   ```sql
   CREATE DATABASE warehouse_db;
   ```
3. **Set up Prisma**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. **Seed the database**
   ```bash
   npx prisma db seed
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (main)/           # Main application routes
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/            # Reusable components
├── lib/                   # Utility libraries
├── config/                # Configuration files
└── prisma/                # Database schema and migrations
```

## Troubleshooting

### Build Warnings

If you see warnings about missing exports during build, ensure:
- All API routes properly export GET/POST handlers
- Environment variables are properly configured
- Database connection is available (or system will use mock data)

### Database Connection Issues

The system gracefully handles missing database connections by:
- Falling back to mock data
- Providing demo functionality
- Logging helpful error messages

### Authentication Issues

- Ensure `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` configuration
- Verify database connection (if using real database)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.


