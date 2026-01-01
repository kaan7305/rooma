# NestQuarter - Global Student Housing Platform

A comprehensive full-stack platform connecting students with verified housing worldwide. Built with modern technologies including Next.js 16, React 19, TypeScript, Tailwind CSS 4, and a robust Node.js/Express backend with real-time features.

## 🌟 Features

### Core Features
- **Property Listings** - Browse thousands of student-friendly properties worldwide
- **Advanced Search & Filters** - Filter by location, price, amenities, property type, and more
- **Interactive Map View** - Visualize properties on an interactive map with clusters
- **Student Verification** - Verified student-only properties with university partnerships
- **Instant Booking** - Book properties immediately without waiting for approval
- **Smart Recommendations** - AI-powered property suggestions based on preferences

### User Features
- **User Authentication** - Secure JWT-based authentication with email verification
- **Profile Management** - Complete user profiles with preferences and verification
- **Favorites & Wishlists** - Save and organize favorite properties
- **Booking Management** - Track all bookings, upcoming stays, and past rentals
- **Review System** - Rate and review properties and hosts

### Host Features
- **Property Management** - List and manage multiple properties
- **Booking Calendar** - Visual calendar showing availability and bookings
- **Guest Requests** - Manage booking requests and communicate with guests
- **Analytics Dashboard** - Track views, bookings, and revenue

### Communication
- **Real-time Messaging** - WebSocket-powered instant messaging between guests and hosts
- **Notification Center** - Real-time notifications for bookings, messages, and updates
- **Email Notifications** - Automated emails for booking confirmations and updates

### Advanced Features
- **Roommate Finder** - Connect with potential roommates based on compatibility
- **Property Comparison** - Side-by-side comparison of up to 4 properties
- **Virtual Tours** - 360° virtual property tours
- **Price Insights** - Historical pricing data and market trends
- **Neighborhood Insights** - Local area information, transit, and amenities
- **Dark Mode** - Full dark mode support with system preference detection
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Real-time:** WebSocket (Socket.io client)

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5
- **Language:** TypeScript 5
- **Database:** PostgreSQL with Prisma ORM
- **Cache:** Redis (ioredis)
- **Real-time:** Socket.io
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **File Storage:** Cloudinary / AWS S3
- **Email:** SendGrid / Nodemailer
- **Rate Limiting:** express-rate-limit
- **Security:** Helmet
- **Job Queue:** Bull

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **PostgreSQL** (v14.0 or higher) - [Download](https://www.postgresql.org/download/)
- **Redis** (v7.0.0 or higher) - [Download](https://redis.io/download/)
- **Git** - [Download](https://git-scm.com/downloads)

### Optional but Recommended
- **pgAdmin** or **TablePlus** - For database management
- **Postman** or **Insomnia** - For API testing
- **VS Code** - Recommended code editor with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Prisma

## 🚀 Installation Guide

Follow these steps carefully to set up the project on your local machine.

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/kaan7305/subletting.git

# Navigate to the project directory
cd "Sublet Project"
```

### Step 2: Install Dependencies

#### Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Or if using yarn
yarn install
```

#### Install Backend Dependencies

```bash
# Navigate to backend directory (from project root)
cd ../backend

# Install dependencies
npm install

# Or if using yarn
yarn install
```

### Step 3: Set Up PostgreSQL Database

#### Option A: Using Local PostgreSQL

1. **Start PostgreSQL Service**
   ```bash
   # macOS (with Homebrew)
   brew services start postgresql@15

   # Ubuntu/Debian
   sudo service postgresql start

   # Windows
   # Start PostgreSQL from Services or pgAdmin
   ```

2. **Create Database**
   ```bash
   # Access PostgreSQL shell
   psql postgres

   # Create database
   CREATE DATABASE nestquarter;

   # Create user (optional)
   CREATE USER nestquarter_user WITH PASSWORD 'your_secure_password';

   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE nestquarter TO nestquarter_user;

   # Exit psql
   \q
   ```

#### Option B: Using Railway/Supabase (Cloud Database)

1. Create account on [Railway](https://railway.app/) or [Supabase](https://supabase.com/)
2. Create a new PostgreSQL database
3. Copy the connection string (you'll need this for Step 4)

### Step 4: Set Up Redis

#### Option A: Using Local Redis

```bash
# macOS (with Homebrew)
brew services start redis

# Ubuntu/Debian
sudo service redis-server start

# Windows
# Download and run Redis from https://redis.io/download/
```

#### Option B: Using Redis Cloud

1. Create account on [Redis Cloud](https://redis.com/try-free/)
2. Create a new database
3. Copy the connection string

### Step 5: Configure Environment Variables

#### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
cd frontend
touch .env.local
```

Add the following variables to `frontend/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Cloudflare Turnstile (optional - for bot protection)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key

# AWS S3 (if using AWS for file uploads)
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_BUCKET=your-bucket-name

# Environment
NODE_ENV=development
```

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd ../backend
touch .env
```

Add the following variables to `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/nestquarter?schema=public"
# Example for Railway:
# DATABASE_URL="postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway"

# Redis Configuration
REDIS_URL=redis://localhost:6379
# Example for Redis Cloud:
# REDIS_URL=redis://default:password@redis-12345.c1.us-east-1-2.ec2.cloud.redislabs.com:12345

# JWT Secrets
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@nestquarter.com
SENDGRID_FROM_NAME=NestQuarter

# OR Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AWS S3 Configuration (alternative to Cloudinary)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Security
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 6: Set Up Database Schema

```bash
# Make sure you're in the backend directory
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data (optional)
npm run prisma:seed

# Open Prisma Studio to view your database (optional)
npm run prisma:studio
```

### Step 7: Start the Development Servers

You'll need to run both the frontend and backend servers simultaneously.

#### Terminal 1 - Start Backend Server

```bash
# From project root, navigate to backend
cd backend

# Start the backend development server
npm run dev

# You should see:
# ✓ Server running on http://localhost:5000
# ✓ Database connected
# ✓ Redis connected
```

#### Terminal 2 - Start Frontend Server

```bash
# From project root, navigate to frontend
cd frontend

# Start the frontend development server
npm run dev

# You should see:
# ✓ Ready on http://localhost:3000
```

### Step 8: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Prisma Studio:** http://localhost:5555 (if running)

## 📁 Project Structure

```
Sublet Project/
├── frontend/                    # Next.js frontend application
│   ├── app/                    # Next.js 16 App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── api/               # API routes
│   │   ├── auth/              # Auth pages (login, register)
│   │   ├── bookings/          # Bookings management
│   │   ├── dashboard/         # User dashboard
│   │   ├── messages/          # Messaging system
│   │   ├── properties/        # Property pages
│   │   ├── search/            # Search & filters
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── layout/           # Layout components (Navbar, Footer)
│   │   ├── ui/               # UI components (Skeleton, etc.)
│   │   ├── AdvancedMessaging.tsx
│   │   ├── BookingCalendar.tsx
│   │   ├── CheckoutFlow.tsx
│   │   ├── FeaturedSections.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── PropertyComparison.tsx
│   │   ├── PropertyGallery.tsx
│   │   ├── PropertyMap.tsx
│   │   ├── ReviewsSection.tsx
│   │   ├── SmartRecommendations.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── VirtualTourViewer.tsx
│   ├── lib/                   # Utility functions and stores
│   │   ├── auth-store.ts     # Authentication state
│   │   ├── favorites-store.ts # Favorites management
│   │   ├── notifications-store.ts
│   │   ├── theme-context.tsx  # Dark mode theme
│   │   ├── toast-context.tsx  # Toast notifications
│   │   └── websocket-context.tsx # WebSocket client
│   ├── data/                  # Static data
│   ├── public/               # Static assets
│   ├── styles/               # Global styles
│   ├── .env.local            # Environment variables (not in git)
│   ├── next.config.js        # Next.js configuration
│   ├── package.json          # Dependencies
│   ├── tailwind.config.ts    # Tailwind configuration
│   └── tsconfig.json         # TypeScript configuration
│
├── backend/                   # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   ├── config/          # Configuration files
│   │   └── server.ts        # Express server entry point
│   ├── prisma/              # Prisma ORM
│   │   ├── schema.prisma    # Database schema
│   │   ├── migrations/      # Database migrations
│   │   └── seed-simple.ts   # Database seeding
│   ├── .env                 # Environment variables (not in git)
│   ├── package.json         # Dependencies
│   └── tsconfig.json        # TypeScript configuration
│
└── README.md                 # This file
```

## 🔧 Available Scripts

### Frontend Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

### Backend Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Prisma commands
npm run prisma:generate      # Generate Prisma Client
npm run prisma:migrate       # Run migrations
npm run prisma:migrate:deploy # Deploy migrations (production)
npm run prisma:studio        # Open Prisma Studio
npm run prisma:seed          # Seed database

# Code quality
npm run lint                 # Run ESLint
npm run lint:fix             # Fix ESLint errors
npm run format               # Format code with Prettier
npm run format:check         # Check code formatting
```

## 🔐 Authentication Flow

1. **User Registration**
   - User submits email and password
   - Email verification sent
   - User clicks verification link
   - Account activated

2. **User Login**
   - User submits credentials
   - Backend validates and returns JWT access token + refresh token
   - Tokens stored in HTTP-only cookies
   - User authenticated

3. **Token Refresh**
   - Access token expires after 15 minutes
   - Frontend automatically refreshes using refresh token
   - New access token issued

4. **Protected Routes**
   - Frontend checks auth state before rendering
   - Backend validates JWT on protected endpoints

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property (host only)
- `PUT /api/properties/:id` - Update property (host only)
- `DELETE /api/properties/:id` - Delete property (host only)

### Bookings
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID

### Messages
- `GET /api/messages` - Get user conversations
- `GET /api/messages/:conversationId` - Get messages
- `POST /api/messages` - Send message

### Reviews
- `GET /api/reviews/property/:propertyId` - Get property reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🎨 Theming

The application includes a fully functional dark mode with three options:

- **Light Mode** - Traditional light theme
- **Dark Mode** - Eye-friendly dark theme
- **System** - Automatically follows system preference

Toggle between themes using the theme switcher in the navigation bar.

## 🐛 Troubleshooting

### Database Connection Issues

**Problem:** `Error: connect ECONNREFUSED`

**Solution:**
```bash
# Check if PostgreSQL is running
# macOS
brew services list

# Start PostgreSQL if not running
brew services start postgresql@15

# Verify connection string in backend/.env
# Make sure DATABASE_URL is correct
```

### Redis Connection Issues

**Problem:** `Error: Redis connection failed`

**Solution:**
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Start Redis if not running
brew services start redis

# Verify REDIS_URL in backend/.env
```

### Port Already in Use

**Problem:** `Error: Port 3000/5000 already in use`

**Solution:**
```bash
# Find process using the port
lsof -i :3000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in .env files
```

### Prisma Migration Errors

**Problem:** `Migration failed`

**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Then run migrations again
npm run prisma:migrate

# Reseed database
npm run prisma:seed
```

### Module Not Found Errors

**Problem:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Clear Next.js cache (frontend only)
rm -rf .next
```

### TypeScript Errors

**Problem:** Type errors during build

**Solution:**
```bash
# Regenerate Prisma Client
npm run prisma:generate

# Restart TypeScript server in VS Code
# CMD+Shift+P -> "TypeScript: Restart TS Server"
```

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy automatically on push to main branch

### Backend Deployment (Railway/Render)

1. Create account on [Railway](https://railway.app) or [Render](https://render.com)
2. Connect GitHub repository
3. Configure environment variables
4. Add PostgreSQL and Redis services
5. Deploy

### Environment Variables for Production

Make sure to set these in your deployment platform:
- All variables from `.env.local` and `.env`
- Set `NODE_ENV=production`
- Use production database URLs
- Use strong JWT secrets
- Configure production API keys

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes before submitting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Developer** - [Kaan Erol](https://github.com/kaan7305)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search [existing issues](https://github.com/kaan7305/subletting/issues)
3. Create a [new issue](https://github.com/kaan7305/subletting/issues/new)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [PostgreSQL](https://www.postgresql.org/) and [Prisma](https://www.prisma.io/)
- Icons from [Lucide React](https://lucide.dev/)

---

**Made with ❤️ by the NestQuarter Team**
