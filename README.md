# EthioTelecom Warehouse Management System (WMS)

A comprehensive warehouse management system built for EthioTelecom using Next.js 14, TypeScript, and Prisma.

## 🚀 Features

### Core Functionality
- **Dashboard**: Real-time overview of inventory, orders, and system status
- **Inventory Management**: Track products, stock levels, and warehouse locations
- **Order Processing**: Manage purchase orders, stock-in, and stock-out operations
- **Supplier Management**: Maintain supplier information and relationships
- **User Management**: Role-based access control for different user types
- **Reports & Analytics**: Generate insights and reports on warehouse operations

### UI Components
- **Search Functionality**: Global search across products, orders, suppliers, and users
- **Profile Management**: User profile editing and activity tracking
- **Responsive Design**: Mobile-friendly interface with modern UI components
- **Interactive Navigation**: Sidebar navigation with role-based menu items
- **Real-time Notifications**: Alert system for low stock and important updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Icons**: Lucide React
- **Charts**: Recharts

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ethio-tele-wms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The system uses a comprehensive database schema with the following main entities:

- **Users**: Authentication and user management
- **Products**: Inventory items with SKU, categories, and pricing
- **Warehouses**: Physical storage locations
- **Inventory**: Stock levels per product per warehouse
- **Orders**: Purchase and internal orders
- **Suppliers**: Vendor management
- **Stock Movements**: Audit trail for all inventory changes
- **Audit Logs**: System activity tracking

## 🔐 User Roles

- **ADMIN**: Full system access including user management
- **MANAGER**: Access to all operational features
- **SUPERVISOR**: Limited administrative access
- **USER**: Basic operational access
- **VIEWER**: Read-only access

## 🎯 Key Features Implemented

### Search System
- Global search across all entities
- Real-time search results
- Categorized search results
- Search history and suggestions

### Profile Management
- User profile editing
- Activity tracking
- Role-based information display
- Avatar and personal information management

### Navigation
- Role-based sidebar navigation
- Active page highlighting
- Responsive mobile navigation
- Quick access to frequently used features

## 🚀 Getting Started

1. **Access the application** at `http://localhost:3000`
2. **Login** with your credentials (or create a new account)
3. **Explore the dashboard** to see system overview
4. **Use the search** to find specific items
5. **Manage your profile** from the user menu
6. **Navigate** through different sections using the sidebar

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   └── api/               # API routes
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software developed for EthioTelecom.

## 📞 Support

For support and questions, please contact the development team.

---

**EthioTelecom Warehouse Management System** - Streamlining warehouse operations for better efficiency and control.