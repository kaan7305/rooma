# NestQuarter - Global Student Housing Platform

NestQuarter is a comprehensive full-stack platform designed to connect students with verified housing opportunities worldwide. The application leverages modern web technologies to provide a seamless experience for both property seekers and hosts, featuring real-time communication, advanced search capabilities, and intelligent property recommendations.

## Overview

This platform addresses the critical need for reliable, student-friendly housing solutions across different cities and countries. Built with scalability and user experience in mind, NestQuarter offers a feature-rich environment where students can discover, compare, and book accommodation while hosts can efficiently manage their properties and communicate with potential tenants.

## Key Features

### For Students and Tenants

**Property Discovery and Search**
- Comprehensive property listings with detailed information and high-quality imagery
- Advanced filtering system supporting multiple criteria including location, price range, property type, amenities, and availability dates
- Interactive map-based search with property clustering for better visualization
- Saved searches with automatic notifications for new matching properties
- Side-by-side comparison tool for evaluating up to four properties simultaneously

**Booking and Management**
- Streamlined booking process with instant confirmation options
- Complete booking history with upcoming and past reservations
- Integrated calendar system showing availability across different properties
- Flexible cancellation policies with clear terms and conditions
- Automated booking confirmations and reminders via email

**Communication and Reviews**
- Real-time messaging system enabling direct communication with property hosts
- Comprehensive notification center for all platform activities
- Detailed review system with ratings for properties, hosts, and overall experience
- Response to host reviews and public Q&A functionality

**Personalization**
- Favorites and wishlist management for tracking interesting properties
- AI-powered recommendation engine suggesting properties based on search history and preferences
- Customizable user profiles with verification badges
- Roommate matching system based on compatibility factors

### For Property Hosts

**Property Management**
- Intuitive property listing interface with support for multiple properties
- Comprehensive property editor with photo upload, amenity selection, and detailed descriptions
- Dynamic pricing tools with seasonal adjustments and special offers
- Availability calendar with blocked dates and minimum stay requirements

**Guest Management**
- Centralized dashboard for managing all booking requests
- Direct messaging with prospective and current tenants
- Guest screening tools with verification status visibility
- Booking analytics showing conversion rates and popular features

**Financial Tools**
- Revenue tracking with detailed breakdowns by property
- Automated payout calculations and payment processing
- Performance metrics including occupancy rates and average booking values
- Financial reporting for tax and accounting purposes

### Platform-Wide Features

**Security and Trust**
- Secure authentication system using JSON Web Tokens with refresh token rotation
- Email verification for all new accounts
- Student verification through university partnerships and documentation
- Host verification with identity confirmation and property ownership validation
- Secure payment processing with PCI compliance

**Real-time Capabilities**
- WebSocket-based instant messaging with typing indicators and read receipts
- Live notification system for bookings, messages, and platform updates
- Real-time availability updates preventing double bookings
- Instant booking confirmations with immediate calendar updates

**User Experience**
- Fully responsive design optimized for desktop, tablet, and mobile devices
- Complete dark mode implementation with automatic system preference detection
- Accessible interface following WCAG guidelines
- Multi-language support (expandable architecture)
- Progressive Web App capabilities for mobile installation

## Technology Stack

### Frontend Architecture

**Core Framework and Runtime**
- Next.js 16 utilizing the App Router architecture for optimal performance and SEO
- React 19 with server components for improved rendering efficiency
- TypeScript 5 providing comprehensive type safety and enhanced developer experience
- Modern JavaScript (ES2022+) with full async/await support

**Styling and UI**
- Tailwind CSS 4 for utility-first styling with custom design system
- CSS-in-JS capabilities for dynamic theming
- Lucide React icon library for consistent iconography
- Custom component library built on accessible primitives

**State Management and Data Handling**
- Zustand for lightweight global state management
- React Hook Form for performant form handling with minimal re-renders
- Zod for runtime type validation and schema definition
- Axios for HTTP requests with interceptor support
- SWR for data fetching with built-in caching and revalidation

**Real-time and External Services**
- Socket.io client for WebSocket connections
- AWS SDK for cloud storage integration
- TensorFlow.js for client-side AI features
- Cloudflare Turnstile for bot protection

### Backend Architecture

**Server Framework**
- Node.js runtime with Express 5 framework
- TypeScript 5 for type-safe server-side code
- Modular architecture with clear separation of concerns
- RESTful API design following industry best practices

**Database and ORM**
- PostgreSQL 14+ as the primary relational database
- Prisma ORM for type-safe database queries and migrations
- Database connection pooling for optimal performance
- Automated backup and point-in-time recovery capabilities

**Caching and Performance**
- Redis for session management and caching
- ioredis client with cluster support
- Bull queue system for background job processing
- Rate limiting and request throttling

**Authentication and Security**
- JWT-based authentication with access and refresh tokens
- bcrypt for secure password hashing (10 rounds)
- Helmet for security headers
- CORS configuration with whitelist
- express-rate-limit for API protection
- Input validation and sanitization

**File Storage and Processing**
- Cloudinary for image storage and transformation
- Alternative AWS S3 integration
- Sharp for server-side image processing
- Automatic image optimization and format conversion

**Communication**
- Socket.io for real-time bidirectional communication
- SendGrid for transactional emails
- Nodemailer as alternative email service
- Handlebars for email templating

**Payment Processing**
- Stripe integration for secure payment handling
- Webhook support for payment events
- Subscription management capabilities
- Refund and payout automation

## Prerequisites and System Requirements

Before beginning the installation process, ensure your development environment meets the following requirements:

### Required Software

**Node.js and Package Manager**
- Node.js version 18.0.0 or higher (LTS version recommended)
- npm version 9.0.0 or higher, or Yarn version 1.22.0 or higher
- Download from the official Node.js website or use a version manager like nvm

**Database System**
- PostgreSQL version 14.0 or higher
- Minimum 2GB RAM allocated for database operations
- 10GB available disk space for database storage
- pgAdmin 4 or similar database management tool (recommended)

**Cache System**
- Redis version 7.0.0 or higher
- Minimum 512MB RAM allocated for Redis
- Redis CLI for database management and debugging

**Version Control**
- Git version 2.30.0 or higher
- GitHub account for repository access
- SSH keys configured (recommended for authentication)

### Development Tools (Recommended)

**Code Editor**
- Visual Studio Code (highly recommended) with the following extensions:
  - ESLint for JavaScript/TypeScript linting
  - Prettier for code formatting
  - Tailwind CSS IntelliSense for class name completion
  - Prisma extension for schema file support
  - GitLens for enhanced Git integration
  - Error Lens for inline error display

**API Testing**
- Postman, Insomnia, or similar REST client
- WebSocket testing tool for real-time feature verification

**Database Management**
- TablePlus, DBeaver, or pgAdmin for visual database exploration
- Redis Desktop Manager or Medis for Redis database inspection

## Detailed Installation Instructions

This section provides comprehensive step-by-step instructions for setting up the NestQuarter platform on your local development environment. Follow each step carefully to ensure proper configuration.

### Step 1: Repository Setup

First, you need to obtain a copy of the codebase on your local machine.

**Clone the repository:**

```bash
# Navigate to your preferred projects directory
cd ~/projects  # or your preferred location

# Clone the repository using HTTPS
git clone https://github.com/kaan7305/subletting.git

# Alternatively, clone using SSH (if configured)
git clone git@github.com:kaan7305/subletting.git

# Navigate into the project directory
cd subletting
# Note: The actual directory name is "Sublet Project" with a space
cd "Sublet Project"
```

**Verify the repository structure:**

```bash
# List the contents to confirm successful clone
ls -la

# You should see two main directories:
# - frontend/  (Next.js application)
# - backend/   (Express API server)
```

### Step 2: Frontend Dependencies Installation

The frontend application requires several npm packages to function correctly. This process may take several minutes depending on your internet connection.

**Navigate to the frontend directory:**

```bash
# From the project root
cd frontend
```

**Install dependencies using npm:**

```bash
# Clean install (recommended for first-time setup)
npm ci

# Or standard install
npm install

# This will install approximately 1,200+ packages
# Installation typically takes 2-5 minutes
```

**For Yarn users:**

```bash
# Install using Yarn
yarn install

# Or use Yarn 2+ (Berry)
yarn
```

**Verify installation:**

```bash
# Check that node_modules directory was created
ls -la node_modules

# Verify key packages are installed
npm list next react react-dom typescript
```

**Common issues during frontend installation:**

If you encounter ERESOLVE errors or dependency conflicts:

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall with legacy peer dependencies flag
npm install --legacy-peer-deps
```

If you encounter permission errors on Unix-based systems:

```bash
# Fix npm permissions (do not use sudo npm install)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

### Step 3: Backend Dependencies Installation

The backend server has its own set of dependencies that need to be installed separately.

**Navigate to the backend directory:**

```bash
# From the project root (not from frontend)
cd ../backend

# Or if starting from frontend directory
cd ../backend
```

**Install backend dependencies:**

```bash
# Clean installation
npm ci

# Or standard installation
npm install

# This installs approximately 800+ packages
# Including TypeScript, Express, Prisma, and all other server dependencies
```

**Verify TypeScript compilation:**

```bash
# Check TypeScript configuration
npx tsc --noEmit

# This should complete without errors
# Any type errors at this stage should be investigated
```

**Install development tools globally (optional but recommended):**

```bash
# Install TypeScript globally for better IDE support
npm install -g typescript

# Install ts-node for running TypeScript files directly
npm install -g ts-node

# Install Prisma CLI globally
npm install -g prisma

# Install nodemon globally
npm install -g nodemon
```

### Step 4: PostgreSQL Database Configuration

Setting up PostgreSQL correctly is crucial for the application to function. This section covers both local and cloud-based setup options.

#### Option A: Local PostgreSQL Installation and Configuration

**MacOS installation using Homebrew:**

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify PostgreSQL is running
brew services list | grep postgresql
# Should show: postgresql@15 started

# Check PostgreSQL version
psql --version
# Should output: psql (PostgreSQL) 15.x
```

**Ubuntu/Debian installation:**

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql

# Enable PostgreSQL to start on boot
sudo systemctl enable postgresql

# Check service status
sudo systemctl status postgresql
```

**Windows installation:**

1. Download the PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run the installer and follow the installation wizard
3. Remember the password you set for the postgres user
4. Ensure the PostgreSQL service starts automatically
5. Add PostgreSQL bin directory to your PATH environment variable

**Create the database:**

Once PostgreSQL is installed and running, create the database for the application:

```bash
# Access PostgreSQL as the default postgres user
psql postgres

# Or on Ubuntu/Linux
sudo -u postgres psql
```

Within the PostgreSQL shell, execute:

```sql
-- Create the database
CREATE DATABASE nestquarter;

-- Create a dedicated user (recommended for security)
CREATE USER nestquarter_user WITH PASSWORD 'your_secure_password_here';

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE nestquarter TO nestquarter_user;

-- Grant schema privileges (PostgreSQL 15+)
\c nestquarter
GRANT ALL ON SCHEMA public TO nestquarter_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nestquarter_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nestquarter_user;

-- List databases to verify creation
\l

-- Exit PostgreSQL shell
\q
```

**Test database connection:**

```bash
# Connect to the new database
psql -U nestquarter_user -d nestquarter -h localhost

# If successful, you should see the database prompt
# Type \q to exit
```

**Configure PostgreSQL for optimal performance:**

Edit the PostgreSQL configuration file (postgresql.conf):

```bash
# Find the config file location
psql -U postgres -c 'SHOW config_file'

# Edit the file (macOS with Homebrew)
nano /usr/local/var/postgresql@15/postgresql.conf

# Recommended settings for development
# Adjust based on your system resources:
shared_buffers = 256MB          # 25% of system RAM
effective_cache_size = 1GB      # 50-75% of system RAM
work_mem = 16MB                 # Per operation memory
maintenance_work_mem = 128MB    # For maintenance operations
max_connections = 100           # Concurrent connections

# Save and restart PostgreSQL
brew services restart postgresql@15
```

#### Option B: Cloud Database (Railway)

Railway provides a simple PostgreSQL hosting solution that's free to start:

```bash
# 1. Create a Railway account at https://railway.app
# 2. Create a new project
# 3. Add a PostgreSQL database service
# 4. Copy the connection string provided

# The connection string format will be:
# postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway

# You'll use this in your .env file in Step 6
```

#### Option C: Cloud Database (Supabase)

Supabase offers PostgreSQL with additional features:

```bash
# 1. Create account at https://supabase.com
# 2. Create a new project
# 3. Wait for database provisioning (2-3 minutes)
# 4. Go to Project Settings > Database
# 5. Copy the connection string (Connection pooling recommended)

# Connection pooler format:
# postgresql://postgres:[password]@db.[project-ref].supabase.co:6543/postgres?pgbouncer=true

# Direct connection format:
# postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### Step 5: Redis Installation and Configuration

Redis is used for caching, session management, and background job queues.

#### Option A: Local Redis Installation

**MacOS using Homebrew:**

```bash
# Install Redis
brew install redis

# Start Redis service
brew services start redis

# Verify Redis is running
redis-cli ping
# Should return: PONG

# Check Redis version
redis-cli --version
# Should show: redis-cli 7.x.x
```

**Ubuntu/Debian:**

```bash
# Update package list
sudo apt update

# Install Redis
sudo apt install redis-server

# Configure Redis to start on boot
sudo systemctl enable redis-server

# Start Redis service
sudo systemctl start redis-server

# Check service status
sudo systemctl status redis-server

# Test connection
redis-cli ping
```

**Windows:**

Redis does not officially support Windows. Use one of these alternatives:

1. Windows Subsystem for Linux (WSL) with Linux Redis
2. Redis Docker container
3. Cloud Redis service (recommended)

**Redis configuration for development:**

```bash
# Find Redis config file
# macOS: /usr/local/etc/redis.conf
# Linux: /etc/redis/redis.conf

# Key settings for development:
maxmemory 256mb                    # Limit memory usage
maxmemory-policy allkeys-lru       # Eviction policy
save 900 1                         # Persistence settings
save 300 10
save 60 10000

# Restart Redis after changes
brew services restart redis  # macOS
sudo systemctl restart redis-server  # Linux
```

**Test Redis functionality:**

```bash
# Connect to Redis CLI
redis-cli

# Test basic commands
SET test_key "Hello Redis"
GET test_key
# Should return: "Hello Redis"

DEL test_key
# Should return: (integer) 1

# Exit Redis CLI
exit
```

#### Option B: Cloud Redis (Redis Cloud)

```bash
# 1. Create account at https://redis.com/try-free/
# 2. Create a new database
# 3. Choose your region (closest to your backend server)
# 4. Copy the connection string

# Format: redis://default:password@redis-xxxxx.c1.us-east-1.ec2.cloud.redislabs.com:12345
```

#### Option C: Redis via Docker

If you prefer using Docker:

```bash
# Pull Redis image
docker pull redis:7-alpine

# Run Redis container
docker run -d \
  --name nestquarter-redis \
  -p 6379:6379 \
  redis:7-alpine

# Verify container is running
docker ps | grep redis

# Connect to Redis CLI in container
docker exec -it nestquarter-redis redis-cli
```

### Step 6: Environment Variables Configuration

Environment variables store sensitive configuration data that should never be committed to version control.

#### Frontend Environment Variables

**Create the environment file:**

```bash
# Ensure you're in the frontend directory
cd frontend

# Create .env.local file
touch .env.local

# Open in your preferred editor
nano .env.local
# or
code .env.local
```

**Add the following configuration to `frontend/.env.local`:**

```env
# ============================================
# API AND SERVICES CONFIGURATION
# ============================================

# Backend API URL
# Development: local backend server
# Production: your deployed backend URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# WebSocket server URL
# Must match your backend server
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# ============================================
# SECURITY AND BOT PROTECTION
# ============================================

# Cloudflare Turnstile (optional but recommended)
# Sign up at: https://dash.cloudflare.com/
# Navigate to: Turnstile > Get your sitekey
NEXT_PUBLIC_TURNSTILE_SITE_KEY=

# ============================================
# FILE STORAGE (AWS S3)
# ============================================
# Only required if using AWS S3 for file uploads
# Leave empty if using Cloudinary on backend

# AWS Region for S3 bucket
NEXT_PUBLIC_AWS_REGION=us-east-1

# S3 bucket name
NEXT_PUBLIC_AWS_BUCKET=

# ============================================
# APPLICATION SETTINGS
# ============================================

# Environment mode
# Options: development, production, test
NODE_ENV=development

# Enable/disable debug logs
NEXT_PUBLIC_DEBUG=true

# Application version (optional)
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**Explanation of key variables:**

- `NEXT_PUBLIC_API_URL`: The base URL for all API requests. In development, this points to your local backend server running on port 5000.

- `NEXT_PUBLIC_SOCKET_URL`: WebSocket connection endpoint for real-time features. Must match your backend WebSocket server.

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: Cloudflare's bot protection service. This is optional but recommended for production to prevent spam registrations.

- `NEXT_PUBLIC_` prefix: Next.js requires this prefix for any environment variable that should be accessible in browser-side code.

#### Backend Environment Variables

**Create the environment file:**

```bash
# Navigate to backend directory
cd ../backend

# Create .env file
touch .env

# Open in editor
nano .env
# or
code .env
```

**Add comprehensive configuration to `backend/.env`:**

```env
# ============================================
# SERVER CONFIGURATION
# ============================================

# Port number for the Express server
# Default: 5000, ensure this doesn't conflict with other services
PORT=5000

# Node environment
# Options: development, production, test
NODE_ENV=development

# Frontend URL for CORS configuration
# Must match your frontend URL exactly
CLIENT_URL=http://localhost:3000

# API version prefix (optional)
API_VERSION=v1

# Server timeout in milliseconds
SERVER_TIMEOUT=30000

# ============================================
# DATABASE CONFIGURATION
# ============================================

# PostgreSQL connection string
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA

# Local development example:
DATABASE_URL="postgresql://nestquarter_user:your_password@localhost:5432/nestquarter?schema=public"

# Railway example:
# DATABASE_URL="postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway"

# Supabase example:
# DATABASE_URL="postgresql://postgres:password@db.projectref.supabase.co:5432/postgres"

# Connection pool settings
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# ============================================
# REDIS CONFIGURATION
# ============================================

# Redis connection URL
# Local development:
REDIS_URL=redis://localhost:6379

# Redis Cloud example:
# REDIS_URL=redis://default:password@redis-12345.c1.us-east-1-2.ec2.cloud.redislabs.com:12345

# Redis connection options
REDIS_MAX_RETRIES=3
REDIS_RETRY_DELAY=1000

# ============================================
# JWT AUTHENTICATION
# ============================================

# Secret key for signing access tokens
# IMPORTANT: Generate a strong random string for production
# You can generate one using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_change_in_production

# Secret key for refresh tokens (should be different from JWT_SECRET)
JWT_REFRESH_SECRET=your_super_secret_refresh_key_also_minimum_32_characters_change_in_production

# Token expiration times
# Access token: short-lived for security
JWT_EXPIRES_IN=15m

# Refresh token: longer-lived for user convenience
JWT_REFRESH_EXPIRES_IN=7d

# Token issuer (optional)
JWT_ISSUER=nestquarter-api

# ============================================
# EMAIL CONFIGURATION (SENDGRID)
# ============================================

# SendGrid API key
# Sign up at: https://sendgrid.com
# Generate API key with Full Access permissions
SENDGRID_API_KEY=

# Sender email address (must be verified in SendGrid)
SENDGRID_FROM_EMAIL=noreply@nestquarter.com

# Sender display name
SENDGRID_FROM_NAME=NestQuarter

# Email template IDs (if using SendGrid templates)
SENDGRID_WELCOME_TEMPLATE=
SENDGRID_BOOKING_TEMPLATE=
SENDGRID_RESET_PASSWORD_TEMPLATE=

# ============================================
# EMAIL CONFIGURATION (SMTP ALTERNATIVE)
# ============================================
# Use these instead of SendGrid if you prefer SMTP

# SMTP server hostname
SMTP_HOST=smtp.gmail.com

# SMTP port (587 for TLS, 465 for SSL)
SMTP_PORT=587

# SMTP secure connection
SMTP_SECURE=false

# SMTP authentication username
SMTP_USER=your_email@gmail.com

# SMTP authentication password
# For Gmail, use App Password: https://support.google.com/accounts/answer/185833
SMTP_PASSWORD=your_app_specific_password

# ============================================
# FILE STORAGE (CLOUDINARY)
# ============================================

# Cloudinary account details
# Sign up at: https://cloudinary.com
# Find these in your Cloudinary Dashboard

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Upload preset for unsigned uploads (optional)
CLOUDINARY_UPLOAD_PRESET=

# Folder structure in Cloudinary
CLOUDINARY_FOLDER=nestquarter/properties

# ============================================
# FILE STORAGE (AWS S3 ALTERNATIVE)
# ============================================
# Use these instead of Cloudinary if you prefer AWS S3

# AWS credentials
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key

# AWS region where your S3 bucket is located
AWS_REGION=us-east-1

# S3 bucket name
AWS_BUCKET_NAME=nestquarter-uploads

# S3 bucket ACL (optional)
AWS_S3_ACL=public-read

# CloudFront distribution URL (optional, for CDN)
AWS_CLOUDFRONT_URL=

# ============================================
# PAYMENT PROCESSING (STRIPE)
# ============================================

# Stripe secret key
# Get from: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Stripe publishable key (for frontend)
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Stripe webhook secret
# Get from: https://dashboard.stripe.com/test/webhooks
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe API version
STRIPE_API_VERSION=2023-10-16

# ============================================
# SECURITY SETTINGS
# ============================================

# bcrypt hashing rounds
# Higher = more secure but slower (10-12 recommended)
BCRYPT_ROUNDS=10

# CORS allowed origins (comma-separated for multiple origins)
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# CORS credentials
CORS_CREDENTIALS=true

# Session secret for cookie signing
SESSION_SECRET=another_long_random_secret_key_for_sessions

# Cookie settings
COOKIE_MAX_AGE=604800000
COOKIE_HTTP_ONLY=true
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax

# ============================================
# RATE LIMITING
# ============================================

# Time window in milliseconds (15 minutes)
RATE_LIMIT_WINDOW_MS=900000

# Maximum requests per window
RATE_LIMIT_MAX_REQUESTS=100

# Rate limit message
RATE_LIMIT_MESSAGE=Too many requests, please try again later

# ============================================
# LOGGING
# ============================================

# Log level
# Options: error, warn, info, debug
LOG_LEVEL=debug

# Enable request logging
LOG_REQUESTS=true

# Log file path (optional)
LOG_FILE_PATH=./logs/app.log

# ============================================
# ADDITIONAL SERVICES (OPTIONAL)
# ============================================

# Sentry for error tracking (production)
SENTRY_DSN=

# Google Maps API key (for location features)
GOOGLE_MAPS_API_KEY=

# Mapbox API key (alternative to Google Maps)
MAPBOX_API_KEY=

# Analytics (Google Analytics, Mixpanel, etc.)
ANALYTICS_ID=
```

**Critical security notes:**

1. **Never commit `.env` or `.env.local` files to version control**
   - These files are already in `.gitignore`
   - Always keep sensitive credentials private

2. **Generate strong secrets for production:**
   ```bash
   # Generate a secure random string (64 bytes)
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

   # Use different secrets for JWT_SECRET and JWT_REFRESH_SECRET
   ```

3. **Use different credentials for development and production**
   - Never use development credentials in production
   - Always use environment-specific variables

### Step 7: Database Schema Setup with Prisma

Prisma is used as the ORM (Object-Relational Mapping) tool to manage your database schema and generate type-safe database clients.

**Ensure you're in the backend directory:**

```bash
cd backend
```

**Step 7.1: Generate Prisma Client**

The Prisma Client is a type-safe database client generated from your Prisma schema:

```bash
# Generate Prisma Client based on schema.prisma
npm run prisma:generate

# This command does the following:
# 1. Reads prisma/schema.prisma
# 2. Generates TypeScript types
# 3. Creates database client in node_modules/@prisma/client
# 4. Provides full IDE autocomplete support

# You should see output like:
# ✔ Generated Prisma Client (x.x.x) to ./node_modules/@prisma/client
```

**Step 7.2: Create and Run Database Migrations**

Migrations are versioned database schema changes that keep your database in sync with your Prisma schema:

```bash
# Create and apply migrations
npm run prisma:migrate

# You'll be prompted to name the migration
# Enter a descriptive name like: "initial_setup" or "create_user_property_tables"

# This command:
# 1. Compares current schema with database
# 2. Generates SQL migration file
# 3. Applies migration to database
# 4. Updates Prisma Client

# Expected output:
# Applying migration `20240101000000_initial_setup`
# The following migration(s) have been applied:
# migrations/
#   └─ 20240101000000_initial_setup/
#     └─ migration.sql
# ✔ Generated Prisma Client
```

**Understanding the migration process:**

When you run migrations, Prisma creates a `migrations` directory with the following structure:

```
backend/prisma/migrations/
├── 20240101000000_initial_setup/
│   └── migration.sql
├── 20240102000000_add_booking_table/
│   └── migration.sql
└── migration_lock.toml
```

Each migration folder contains:
- Timestamp prefix for ordering
- Descriptive name you provided
- `migration.sql` file with the actual SQL changes

**Step 7.3: Seed the Database with Sample Data**

Seeding populates your database with initial data for development and testing:

```bash
# Run the database seed script
npm run prisma:seed

# This executes prisma/seed-simple.ts
# Creates sample data including:
# - Test users
# - Sample properties
# - Example bookings
# - Demo reviews
# - Mock messages

# Expected output:
# Running seed command: ts-node prisma/seed-simple.ts
# 🌱 Seeding database...
# ✅ Created X users
# ✅ Created X properties
# ✅ Created X bookings
# 🎉 Seeding complete!
```

**Step 7.4: Verify Database Setup**

Open Prisma Studio to visually inspect your database:

```bash
# Start Prisma Studio
npm run prisma:studio

# This opens a web interface at http://localhost:5555
# You can:
# - Browse all tables
# - View and edit records
# - Run queries
# - Test relationships
```

In Prisma Studio, verify:
- All tables were created correctly
- Seed data is present
- Relationships between tables are working
- Data types match your schema

**Common Prisma commands for reference:**

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Create a new migration without applying
npx prisma migrate dev --create-only

# Apply pending migrations
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Pull database schema into Prisma schema
npx prisma db pull

# Push schema changes without migrations (dev only)
npx prisma db push
```

**Troubleshooting database setup:**

If migrations fail, check:

```bash
# 1. Verify database connection
psql -U nestquarter_user -d nestquarter -h localhost -c "SELECT version();"

# 2. Check DATABASE_URL in .env
echo $DATABASE_URL  # Should show your connection string

# 3. Verify PostgreSQL is running
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# 4. Check Prisma logs
npx prisma migrate dev --help

# 5. Reset and try again (if safe to delete data)
npx prisma migrate reset
```

### Step 8: Running the Development Servers

You'll need to run both the backend and frontend servers simultaneously. The recommended approach is to use two separate terminal windows or tabs.

#### Terminal 1: Backend Server

**Navigate to backend and start the server:**

```bash
# From project root
cd backend

# Start the development server with hot reload
npm run dev

# Alternative: use nodemon directly
npx nodemon src/server.ts
```

**Successful backend startup should display:**

```
[INFO] Starting NestQuarter API Server...
[INFO] Environment: development
[INFO] Port: 5000
[INFO] Database: Connecting to PostgreSQL...
✓ Database connected successfully
[INFO] Redis: Connecting to cache...
✓ Redis connected successfully
[INFO] Socket.IO: Initializing WebSocket server...
✓ WebSocket server ready
[INFO] Routes: Loading API endpoints...
✓ All routes registered
[INFO] Middleware: Security headers applied
[INFO] Middleware: CORS enabled for: http://localhost:3000
✓ Server is running on http://localhost:5000
✓ API Documentation: http://localhost:5000/api-docs (if enabled)
[INFO] Press CTRL+C to stop the server
```

**Verify backend is working:**

```bash
# In a new terminal, test the health endpoint
curl http://localhost:5000/health

# Should return:
# {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z","database":"connected","redis":"connected"}

# Or open in browser: http://localhost:5000/health
```

**Common backend startup issues:**

If the server fails to start, check the console for error messages:

**Port already in use:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in backend/.env
```

**Database connection failed:**
```bash
# Verify PostgreSQL is running
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql  # Linux

# Test database connection
psql -U nestquarter_user -d nestquarter -h localhost

# Check DATABASE_URL format in .env
```

**Redis connection failed:**
```bash
# Verify Redis is running
redis-cli ping  # Should return PONG

# Or
brew services list | grep redis  # macOS
sudo systemctl status redis  # Linux

# Check REDIS_URL in .env
```

#### Terminal 2: Frontend Server

**Navigate to frontend and start Next.js:**

```bash
# From project root
cd frontend

# Start the development server
npm run dev

# Alternative with different port
PORT=3001 npm run dev
```

**Successful frontend startup should display:**

```
▲ Next.js 16.0.3
- Local:        http://localhost:3000
- Network:      http://192.168.1.x:3000

✓ Ready in 3.2s
○ Compiling / ...
✓ Compiled / in 1.5s
```

**Verify frontend is working:**

Open your browser and navigate to:
- http://localhost:3000

You should see the NestQuarter homepage with:
- Navigation bar with theme toggle
- Hero section with search functionality
- Featured property sections
- Footer with links

**Test critical frontend features:**

1. **Theme Toggle:**
   - Click the theme icon in the navigation
   - Select Light/Dark/System
   - Verify the entire app changes color scheme

2. **Navigation:**
   - Click through different pages
   - Verify all routes are working
   - Check that the active page is highlighted

3. **API Connection:**
   - Open browser console (F12)
   - Look for any API connection errors
   - Verify WebSocket connection is established

**Common frontend startup issues:**

**Port 3000 already in use:**
```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

**Module not found errors:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**API connection errors:**
```bash
# Verify backend is running
curl http://localhost:5000/health

# Check NEXT_PUBLIC_API_URL in .env.local
cat .env.local | grep API_URL

# Ensure no CORS issues (check browser console)
```

#### Running Both Servers with One Command (Optional)

You can use a process manager like `concurrently` to run both servers from one terminal:

```bash
# Install concurrently globally
npm install -g concurrently

# From project root, create a npm script in package.json
# Add this to the root package.json:
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\""
  }
}

# Then run
npm run dev
```

Or use `tmux` or `screen` for terminal multiplexing:

```bash
# Using tmux
tmux new-session -s nestquarter
# Split window: Ctrl+B then "
# Switch panes: Ctrl+B then arrow keys
# Run backend in one pane, frontend in another
```

### Step 9: Accessing and Testing the Application

With both servers running, you can now access and test the full application.

**Application URLs:**

- **Frontend Application:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Prisma Studio:** http://localhost:5555 (run `npm run prisma:studio` in backend)
- **API Documentation:** http://localhost:5000/api-docs (if Swagger is configured)

**Testing the complete flow:**

1. **User Registration:**
   - Navigate to http://localhost:3000/auth/register
   - Fill in email, password, and other required fields
   - Submit the form
   - Check console for API response
   - Verify email was sent (check server logs)

2. **User Login:**
   - Go to http://localhost:3000/auth/login
   - Enter credentials from registration
   - Verify successful login and redirect to dashboard
   - Check that JWT tokens are stored correctly

3. **Browse Properties:**
   - Navigate to http://localhost:3000/search
   - Test search filters (location, price, amenities)
   - Verify properties load correctly
   - Test pagination if implemented

4. **Property Details:**
   - Click on any property card
   - Verify property details page loads
   - Check image gallery functionality
   - Test booking form if available

5. **Real-time Features:**
   - Open browser console (F12)
   - Navigate to http://localhost:3000/messages
   - Look for WebSocket connection message
   - Test sending a message (if seed data includes conversations)

6. **Dark Mode:**
   - Click theme toggle in navigation
   - Switch between Light/Dark/System modes
   - Verify all pages respect theme choice
   - Check that theme persists on page reload

**Verify backend API endpoints:**

Using curl or Postman, test key endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Get all properties (may require authentication)
curl http://localhost:5000/api/properties

# User registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }'

# User login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

**Check application logs:**

Backend logs should show:
```
[INFO] GET /api/properties 200 45ms
[INFO] POST /api/auth/login 200 156ms
[INFO] WebSocket: Client connected
[DEBUG] User authenticated: user_id_123
```

Frontend console should show:
```
[WebSocket] Connected to ws://localhost:5000
[API] GET /api/properties -> 200 OK
[Theme] Theme changed to: dark
```

**Performance verification:**

1. **Page Load Speed:**
   - Open browser DevTools (F12) → Network tab
   - Reload the page
   - Check total load time (should be under 2 seconds in development)

2. **API Response Times:**
   - Check Network tab for API calls
   - Most endpoints should respond within 100-300ms

3. **Memory Usage:**
   - DevTools → Performance → Memory
   - Verify no memory leaks during navigation

4. **Database Queries:**
   - Check backend console for slow query warnings
   - Use Prisma Studio to inspect data structure

Congratulations! Your NestQuarter development environment is now fully configured and running. You can begin developing new features or testing existing functionality.

## Project Structure

The application follows a modular architecture with clear separation between frontend and backend concerns.

### Frontend Structure

```
frontend/
├── app/                          # Next.js App Router (main application)
│   ├── (auth)/                  # Auth layout group
│   ├── api/                     # Next.js API routes
│   ├── auth/                    # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── bookings/                # Booking management
│   ├── dashboard/               # User dashboard
│   ├── favorites/               # Saved properties
│   ├── host/                    # Host management panel
│   ├── messages/                # Messaging interface
│   │   └── [id]/               # Individual conversation
│   ├── notifications/           # Notification center
│   ├── profile/                 # User profile
│   ├── properties/              # Property pages
│   │   └── [id]/               # Property details
│   ├── search/                  # Search and filter
│   ├── settings/                # User settings
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
├── components/                  # React components
│   ├── layout/                 # Layout components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── ui/                     # Reusable UI components
│   │   └── Skeleton.tsx
│   ├── AdvancedMessaging.tsx   # Real-time chat
│   ├── BookingCalendar.tsx     # Availability calendar
│   ├── BookingConfirmationModal.tsx
│   ├── BookingsManager.tsx
│   ├── CheckoutFlow.tsx        # Payment process
│   ├── FeaturedSections.tsx    # Homepage sections
│   ├── MobileNav.tsx           # Mobile navigation
│   ├── NotificationCenter.tsx  # Notifications UI
│   ├── PropertyComparison.tsx  # Compare properties
│   ├── PropertyGallery.tsx     # Image gallery
│   ├── PropertyMap.tsx         # Interactive map
│   ├── ReviewsSection.tsx      # Review display
│   ├── SmartRecommendations.tsx # AI suggestions
│   ├── ThemeToggle.tsx         # Dark mode toggle
│   └── VirtualTourViewer.tsx   # 360° tours
├── lib/                        # Utilities and shared logic
│   ├── auth-store.ts          # Zustand auth state
│   ├── favorites-store.ts     # Favorites management
│   ├── notifications-store.ts # Notification state
│   ├── theme-context.tsx      # Theme provider
│   ├── toast-context.tsx      # Toast notifications
│   └── websocket-context.tsx  # WebSocket client
├── data/                       # Static data files
│   └── properties.ts          # Mock property data
├── public/                     # Static assets
│   ├── images/
│   └── icons/
├── .env.local                 # Environment variables (gitignored)
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind setup
└── tsconfig.json              # TypeScript config
```

### Backend Structure

```
backend/
├── src/                        # Source code
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── message.controller.ts
│   │   ├── property.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/            # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── logger.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/               # API routes
│   │   ├── auth.routes.ts
│   │   ├── booking.routes.ts
│   │   ├── message.routes.ts
│   │   ├── property.routes.ts
│   │   └── user.routes.ts
│   ├── services/             # Business logic
│   │   ├── auth.service.ts
│   │   ├── booking.service.ts
│   │   ├── email.service.ts
│   │   ├── message.service.ts
│   │   ├── payment.service.ts
│   │   ├── property.service.ts
│   │   └── upload.service.ts
│   ├── utils/                # Utility functions
│   │   ├── jwt.util.ts
│   │   ├── password.util.ts
│   │   └── validation.util.ts
│   ├── types/                # TypeScript types
│   │   ├── express.d.ts
│   │   └── user.types.ts
│   ├── config/               # Configuration
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── socket.ts
│   └── server.ts            # Entry point
├── prisma/                   # Database schema and migrations
│   ├── migrations/          # Migration history
│   ├── schema.prisma       # Database schema
│   └── seed-simple.ts      # Seed script
├── logs/                    # Application logs (gitignored)
├── .env                    # Environment variables (gitignored)
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── nodemon.json           # Nodemon config
```

## Available Scripts

### Frontend Commands

**Development:**
```bash
npm run dev          # Start development server on port 3000
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend Commands

**Development:**
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm run start        # Run compiled production build
```

**Database Management:**
```bash
npm run prisma:generate        # Generate Prisma Client
npm run prisma:migrate         # Create and apply migration
npm run prisma:migrate:deploy  # Apply migrations (production)
npm run prisma:studio          # Open database GUI
npm run prisma:seed           # Seed database with sample data
```

**Code Quality:**
```bash
npm run lint           # Run ESLint
npm run lint:fix       # Auto-fix ESLint issues
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
```

## API Documentation

### Authentication Endpoints

**User Registration**
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "role": "student"
}

Response: 201 Created
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": "user_id",
    "email": "student@university.edu",
    "name": "John Doe"
  }
}
```

**User Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "SecurePassword123!"
}

Response: 200 OK
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "student@university.edu",
    "name": "John Doe"
  }
}
```

**Token Refresh**
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Email Verification**
```
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_from_email"
}
```

**Password Reset Request**
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "student@university.edu"
}
```

**Password Reset**
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePassword123!"
}
```

### Property Endpoints

**Get All Properties**
```
GET /api/properties?page=1&limit=20&location=Boston&minPrice=500&maxPrice=2000

Response: 200 OK
{
  "success": true,
  "data": {
    "properties": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

**Get Property by ID**
```
GET /api/properties/:id

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "prop_123",
    "title": "Cozy Studio Near Campus",
    "description": "...",
    "price": 1200,
    "location": "Boston, MA",
    "host": {...},
    "amenities": [...],
    "images": [...],
    "reviews": [...]
  }
}
```

**Create Property** (Host only)
```
POST /api/properties
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Spacious 2BR Apartment",
  "description": "Beautiful apartment near university...",
  "price": 1500,
  "location": "Cambridge, MA",
  "type": "Apartment",
  "beds": 2,
  "baths": 1,
  "amenities": ["WiFi", "Parking", "Laundry"]
}
```

**Update Property** (Host only)
```
PUT /api/properties/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "price": 1400,
  "description": "Updated description..."
}
```

**Delete Property** (Host only)
```
DELETE /api/properties/:id
Authorization: Bearer {accessToken}
```

### Booking Endpoints

**Get User Bookings**
```
GET /api/bookings
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "booking_123",
      "property": {...},
      "checkIn": "2024-09-01",
      "checkOut": "2024-12-31",
      "status": "confirmed",
      "totalPrice": 5400
    }
  ]
}
```

**Create Booking**
```
POST /api/bookings
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "propertyId": "prop_123",
  "checkIn": "2024-09-01",
  "checkOut": "2024-12-31",
  "guests": 1
}
```

**Update Booking**
```
PUT /api/bookings/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "checkIn": "2024-09-15",
  "checkOut": "2024-12-31"
}
```

**Cancel Booking**
```
DELETE /api/bookings/:id
Authorization: Bearer {accessToken}
```

### Message Endpoints

**Get Conversations**
```
GET /api/messages
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "conv_123",
      "participant": {...},
      "property": {...},
      "lastMessage": {...},
      "unreadCount": 2
    }
  ]
}
```

**Get Messages in Conversation**
```
GET /api/messages/:conversationId
Authorization: Bearer {accessToken}
```

**Send Message**
```
POST /api/messages
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "conversationId": "conv_123",
  "content": "Hello, is the property still available?"
}
```

### User Endpoints

**Get User Profile**
```
GET /api/users/profile
Authorization: Bearer {accessToken}
```

**Update User Profile**
```
PUT /api/users/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+1234567890",
  "bio": "Computer Science student at MIT"
}
```

**Get User by ID**
```
GET /api/users/:id
Authorization: Bearer {accessToken}
```

### Review Endpoints

**Get Property Reviews**
```
GET /api/reviews/property/:propertyId

Response: 200 OK
{
  "success": true,
  "data": {
    "reviews": [...],
    "averageRating": 4.5,
    "totalReviews": 23
  }
}
```

**Create Review**
```
POST /api/reviews
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "propertyId": "prop_123",
  "rating": 5,
  "comment": "Excellent property, highly recommend!"
}
```

## Authentication Flow

The application implements a secure JWT-based authentication system with the following flow:

**1. User Registration**
- User submits registration form with email and password
- Backend validates input and checks for existing user
- Password is hashed using bcrypt with 10 rounds
- User record is created in database with status 'unverified'
- Verification email is sent with unique token
- User receives success message

**2. Email Verification**
- User clicks verification link in email
- Frontend extracts token from URL
- Token is sent to backend verification endpoint
- Backend validates token and updates user status to 'verified'
- User is redirected to login page

**3. User Login**
- User submits email and password
- Backend validates credentials
- Password hash is compared using bcrypt
- If valid, backend generates two tokens:
  - Access Token: Short-lived (15 minutes), contains user ID and role
  - Refresh Token: Long-lived (7 days), used to obtain new access tokens
- Tokens are returned to frontend
- Frontend stores tokens in HTTP-only cookies or localStorage
- User is redirected to dashboard

**4. Authenticated Requests**
- Frontend includes access token in Authorization header: `Bearer {token}`
- Backend middleware validates token on protected routes
- If token is valid, user ID is extracted and attached to request
- Controller proceeds with authenticated request
- If token is expired, frontend automatically attempts refresh

**5. Token Refresh**
- When access token expires, frontend detects 401 Unauthorized response
- Frontend automatically sends refresh token to `/api/auth/refresh`
- Backend validates refresh token
- If valid, new access and refresh tokens are generated
- Frontend updates stored tokens
- Original request is retried with new access token
- This process is transparent to the user

**6. Logout**
- User clicks logout button
- Frontend sends logout request to backend
- Backend invalidates refresh token (adds to blacklist in Redis)
- Frontend clears stored tokens
- User is redirected to homepage

**Security Measures:**
- Passwords are never stored in plain text
- Tokens are signed with secret keys
- Refresh tokens can be revoked
- Token expiration prevents indefinite access
- HTTPS required in production
- Rate limiting on authentication endpoints
- Account lockout after failed login attempts

## Theming System

NestQuarter includes a comprehensive dark mode implementation that respects user preferences and system settings.

**Theme Options:**

1. **Light Mode** - Traditional light color scheme with white backgrounds and dark text
2. **Dark Mode** - Eye-friendly dark color scheme with dark backgrounds and light text
3. **System** - Automatically matches the user's operating system theme preference

**Implementation Details:**

The theming system uses Tailwind CSS's class-based dark mode strategy combined with React Context for state management.

**Theme Context** (`lib/theme-context.tsx`):
- Manages theme state: 'light', 'dark', or 'system'
- Detects system preference using `window.matchMedia('(prefers-color-scheme: dark)')`
- Persists user choice to localStorage
- Applies theme by adding/removing 'dark' class on `<html>` element
- Provides `toggleTheme` function for programmatic theme changes

**Theme Toggle Component** (`components/ThemeToggle.tsx`):
- Dropdown menu with three theme options
- Shows current effective theme (Light or Dark)
- Visual indicator for selected theme
- Accessible keyboard navigation

**Blocking Script** (in `app/layout.tsx`):
- Runs before React hydration to prevent flash of wrong theme
- Reads theme from localStorage
- Applies correct class to HTML element immediately
- Prevents FOUC (Flash of Unstyled Content)

**CSS Implementation:**
- All color classes include `dark:` variants throughout the application
- Example: `bg-white dark:bg-gray-800`
- Tailwind configuration: `darkMode: 'class'`
- Smooth transitions between themes

**Browser Support:**
- All modern browsers support CSS custom properties
- Graceful degradation for older browsers (defaults to light mode)
- System preference detection works in all major browsers

## Comprehensive Troubleshooting Guide

This section provides detailed diagnostic procedures and solutions for common and advanced issues you may encounter while developing or deploying the NestQuarter platform.

### Database Connection and Query Issues

#### Issue 1: PostgreSQL Connection Refused

**Symptom:** Error message "Error: connect ECONNREFUSED" or "Can't reach database server at localhost:5432"

**Root Cause Analysis:**
The application cannot establish a TCP connection to the PostgreSQL server. This typically indicates that either PostgreSQL is not running, is listening on a different port, or network/firewall rules are blocking the connection.

**Advanced Diagnosis:**
```bash
# Step 1: Verify PostgreSQL service status
# macOS with Homebrew
brew services list | grep postgresql
# Expected output: postgresql@15 started <user> ~/Library/LaunchAgents/homebrew.mxcl.postgresql@15.plist

# Linux systemd
sudo systemctl status postgresql
# Expected output: active (running)

# Alternative: Check process directly
ps aux | grep postgres
# Should show multiple postgres processes

# Step 2: Verify PostgreSQL is listening on correct port
sudo lsof -i -P -n | grep LISTEN | grep 5432
# Expected output: postgres <PID> <user> TCP *:5432 (LISTEN)

# Alternative using netstat (Linux)
sudo netstat -tlnp | grep 5432
# Expected output: tcp 0 0 127.0.0.1:5432 0.0.0.0:* LISTEN <PID>/postgres

# Step 3: Test connection with psql
psql -U nestquarter_user -d nestquarter -h localhost -p 5432
# If successful, you should see: nestquarter=>

# Step 4: Check PostgreSQL logs for errors
# macOS
tail -f /usr/local/var/log/postgresql@15.log

# Linux
sudo tail -f /var/log/postgresql/postgresql-15-main.log

# Step 5: Verify DATABASE_URL format
echo $DATABASE_URL
# Should match: postgresql://username:password@host:port/database
```

**Solutions:**

1. **PostgreSQL Service Not Running:**
   ```bash
   # macOS with Homebrew
   brew services start postgresql@15
   # Verify it started
   brew services info postgresql@15

   # Linux with systemd
   sudo systemctl start postgresql
   sudo systemctl enable postgresql  # Enable auto-start on boot

   # Check logs immediately after starting
   sudo journalctl -u postgresql -n 50 --no-pager
   ```

2. **Wrong Port Configuration:**
   ```bash
   # Find which port PostgreSQL is actually using
   sudo lsof -i -P | grep postgres | grep LISTEN

   # Update DATABASE_URL in .env to match the actual port
   # If PostgreSQL is on port 5433 instead of 5432:
   DATABASE_URL="postgresql://user:password@localhost:5433/nestquarter"
   ```

3. **Authentication Failure (pg_hba.conf):**
   ```bash
   # Locate pg_hba.conf
   psql postgres -c "SHOW hba_file;"

   # Edit the file (example path)
   sudo nano /usr/local/var/postgresql@15/pg_hba.conf

   # Add or modify this line for local development:
   # TYPE  DATABASE        USER            ADDRESS                 METHOD
   local   all            all                                     trust
   host    all            all             127.0.0.1/32            md5
   host    all            all             ::1/128                 md5

   # Reload PostgreSQL configuration
   # macOS
   brew services restart postgresql@15

   # Linux
   sudo systemctl reload postgresql
   ```

4. **User Permissions Issues:**
   ```bash
   # Connect as superuser
   psql postgres

   # Check user exists and has correct permissions
   \du

   # Grant necessary permissions
   GRANT ALL PRIVILEGES ON DATABASE nestquarter TO nestquarter_user;

   # For PostgreSQL 15+, also grant schema permissions
   \c nestquarter
   GRANT ALL ON SCHEMA public TO nestquarter_user;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nestquarter_user;
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nestquarter_user;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO nestquarter_user;
   ```

5. **Firewall Blocking Connection:**
   ```bash
   # macOS firewall
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

   # Allow PostgreSQL through firewall
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/postgres

   # Linux ufw
   sudo ufw status
   sudo ufw allow 5432/tcp

   # Linux firewalld
   sudo firewall-cmd --zone=public --add-port=5432/tcp --permanent
   sudo firewall-cmd --reload
   ```

6. **Cloud Database Connection Issues (Railway/Supabase):**
   ```bash
   # Test connection to cloud database
   psql "postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway"

   # If SSL is required, add sslmode parameter
   DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

   # For connection pooling with Supabase
   DATABASE_URL="postgresql://postgres:password@db.projectref.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"

   # Test with verbose error output
   PGSSLMODE=require psql -h db.projectref.supabase.co -U postgres -d postgres -p 5432 -v ON_ERROR_STOP=1
   ```

#### Issue 2: Slow Database Queries

**Symptom:** API endpoints taking 3+ seconds to respond, timeout errors in production

**Diagnosis:**
```bash
# Enable Prisma query logging in backend/src/server.ts or prisma/schema.prisma
# Add to datasource db block:
log = ["query", "info", "warn", "error"]

# Or set environment variable
DEBUG=prisma:query npm run dev

# Identify slow queries in PostgreSQL
psql -U postgres -d nestquarter

# Show currently running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 seconds'
  AND state = 'active';

# Check for missing indexes
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;

# Analyze query performance
EXPLAIN ANALYZE SELECT * FROM "Property" WHERE location = 'Boston' AND price < 2000;
```

**Solutions:**

1. **Add Database Indexes:**
   ```prisma
   // In prisma/schema.prisma, add indexes to frequently queried fields
   model Property {
     id        String   @id @default(cuid())
     location  String
     price     Int
     createdAt DateTime @default(now())

     @@index([location])
     @@index([price])
     @@index([location, price])
     @@index([createdAt])
   }

   // Create migration
   npx prisma migrate dev --name add_property_indexes
   ```

2. **Optimize Prisma Queries with Select and Include:**
   ```typescript
   // Bad: Fetches all fields and all relations
   const property = await prisma.property.findUnique({
     where: { id },
     include: {
       reviews: true,
       bookings: true,
       host: true
     }
   });

   // Good: Only fetch what you need
   const property = await prisma.property.findUnique({
     where: { id },
     select: {
       id: true,
       title: true,
       price: true,
       host: {
         select: {
           id: true,
           name: true,
           avatar: true
         }
       },
       reviews: {
         take: 5,
         orderBy: { createdAt: 'desc' },
         select: {
           id: true,
           rating: true,
           comment: true,
           createdAt: true
         }
       }
     }
   });
   ```

3. **Implement Pagination:**
   ```typescript
   // Add pagination to large result sets
   const properties = await prisma.property.findMany({
     take: 20,  // Limit results
     skip: (page - 1) * 20,  // Offset for pagination
     orderBy: { createdAt: 'desc' },
     where: filters
   });

   // Get total count for pagination metadata
   const total = await prisma.property.count({ where: filters });
   ```

4. **Enable Connection Pooling:**
   ```env
   # In backend/.env, add connection pool parameters
   DATABASE_URL="postgresql://user:password@host:5432/db?schema=public&connection_limit=10&pool_timeout=20"
   ```

5. **Use Database Query Caching with Redis:**
   ```typescript
   // In backend/src/services/property.service.ts
   import { redis } from '../config/redis';

   async function getProperty(id: string) {
     // Check cache first
     const cacheKey = `property:${id}`;
     const cached = await redis.get(cacheKey);

     if (cached) {
       return JSON.parse(cached);
     }

     // Query database
     const property = await prisma.property.findUnique({
       where: { id }
     });

     // Cache for 5 minutes
     await redis.setex(cacheKey, 300, JSON.stringify(property));

     return property;
   }
   ```

#### Issue 3: Database Migration Conflicts

**Symptom:** "Migration failed to apply cleanly" or "Drift detected" errors

**Advanced Diagnosis:**
```bash
# Check detailed migration status
npx prisma migrate status

# View migration history in database
psql -U nestquarter_user -d nestquarter -c "SELECT * FROM _prisma_migrations ORDER BY finished_at DESC;"

# Check for schema drift
npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-database $DATABASE_URL --script

# Inspect specific migration file
cat prisma/migrations/20240101000000_migration_name/migration.sql
```

**Solutions:**

1. **Resolve Baseline Migration Issues:**
   ```bash
   # For existing database, create baseline
   npx prisma migrate resolve --applied "0_init"

   # Mark all migrations as applied
   npx prisma migrate deploy
   ```

2. **Fix Failed Migration:**
   ```bash
   # Mark failed migration as rolled back
   npx prisma migrate resolve --rolled-back "20240101000000_migration_name"

   # Delete the failed migration directory
   rm -rf prisma/migrations/20240101000000_migration_name

   # Create a new migration with the fix
   npx prisma migrate dev --name fix_migration_issue
   ```

3. **Handle Production Migration Safely:**
   ```bash
   # NEVER use migrate dev in production
   # ALWAYS use migrate deploy

   # Preview what will happen
   npx prisma migrate diff \
     --from-schema-datamodel prisma/schema.prisma \
     --to-schema-database $DATABASE_URL \
     --script > preview.sql

   # Review preview.sql carefully

   # Apply migrations in production
   npx prisma migrate deploy
   ```

4. **Recover from Catastrophic Migration Failure:**
   ```bash
   # Step 1: Backup current database
   pg_dump -U nestquarter_user nestquarter > backup_$(date +%Y%m%d_%H%M%S).sql

   # Step 2: Reset migration table (destructive - use with caution)
   psql -U nestquarter_user -d nestquarter -c "DROP TABLE IF EXISTS _prisma_migrations CASCADE;"

   # Step 3: Re-initialize migrations
   npx prisma migrate deploy

   # Step 4: If that fails, do complete reset (WARNING: data loss)
   npx prisma migrate reset --skip-seed
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Redis Connection and Performance Issues

#### Issue 4: Redis Connection Failures in Production

**Symptom:** "ECONNREFUSED 127.0.0.1:6379" or "Redis connection timeout"

**Advanced Diagnosis:**
```bash
# Test local Redis
redis-cli ping
# Expected: PONG

# Test remote Redis with authentication
redis-cli -h redis-12345.c1.us-east-1-2.ec2.cloud.redislabs.com -p 12345 -a your_password ping

# Monitor Redis in real-time
redis-cli monitor

# Check Redis info
redis-cli info
# Look for: connected_clients, used_memory, total_commands_processed

# Test connection from Node.js context
node -e "const Redis = require('ioredis'); const redis = new Redis(process.env.REDIS_URL); redis.ping().then(console.log).catch(console.error);"

# Check Redis logs
# Linux
sudo tail -f /var/log/redis/redis-server.log

# macOS
tail -f /usr/local/var/log/redis.log
```

**Solutions:**

1. **Configure Redis for Production:**
   ```bash
   # Edit redis.conf
   # Linux: /etc/redis/redis.conf
   # macOS: /usr/local/etc/redis.conf

   # Set password
   requirepass your_strong_password_here

   # Bind to all interfaces (use with caution, configure firewall)
   bind 0.0.0.0

   # Or bind to specific IP
   bind 127.0.0.1 192.168.1.100

   # Set max memory
   maxmemory 256mb
   maxmemory-policy allkeys-lru

   # Enable AOF persistence for data durability
   appendonly yes
   appendfsync everysec

   # Restart Redis
   sudo systemctl restart redis
   ```

2. **Fix Redis Connection Pool Issues:**
   ```typescript
   // In backend/src/config/redis.ts
   import Redis from 'ioredis';

   const redis = new Redis(process.env.REDIS_URL, {
     maxRetriesPerRequest: 3,
     retryStrategy(times) {
       const delay = Math.min(times * 50, 2000);
       return delay;
     },
     reconnectOnError(err) {
       const targetError = 'READONLY';
       if (err.message.includes(targetError)) {
         return true; // Reconnect
       }
       return false;
     },
     // Connection pool settings
     lazyConnect: true,
     enableOfflineQueue: true,
     connectTimeout: 10000,
     // For Redis Cluster
     enableReadyCheck: true,
     showFriendlyErrorStack: true
   });

   // Handle connection events
   redis.on('error', (err) => {
     console.error('Redis Client Error:', err);
   });

   redis.on('connect', () => {
     console.log('Redis Client Connected');
   });

   redis.on('ready', () => {
     console.log('Redis Client Ready');
   });

   redis.on('close', () => {
     console.warn('Redis Client Connection Closed');
   });

   redis.on('reconnecting', () => {
     console.log('Redis Client Reconnecting...');
   });

   export { redis };
   ```

3. **Implement Redis Sentinel for High Availability:**
   ```typescript
   // For production with Redis Sentinel
   const redis = new Redis({
     sentinels: [
       { host: 'sentinel-1', port: 26379 },
       { host: 'sentinel-2', port: 26379 },
       { host: 'sentinel-3', port: 26379 }
     ],
     name: 'mymaster',
     password: process.env.REDIS_PASSWORD,
     sentinelPassword: process.env.SENTINEL_PASSWORD
   });
   ```

4. **Debug Redis Memory Issues:**
   ```bash
   # Check memory usage
   redis-cli info memory

   # Find largest keys
   redis-cli --bigkeys

   # Analyze memory by key pattern
   redis-cli --memkeys --memkeys-samples 10000

   # Check if eviction is happening
   redis-cli info stats | grep evicted

   # Clear specific keys if needed
   redis-cli KEYS "session:*" | xargs redis-cli DEL

   # Or flush all (WARNING: clears everything)
   redis-cli FLUSHALL
   ```

### Module Resolution and TypeScript Issues

#### Issue 5: Cannot Find Module Errors

**Symptom:** "Cannot find module '@/components/xyz'" or "Module not found: Can't resolve 'xyz'"

**Comprehensive Diagnosis:**
```bash
# Step 1: Verify node_modules exists and is complete
ls -la node_modules/ | wc -l
# Should show hundreds of directories

# Step 2: Check package.json and lock file consistency
npm ls
# Look for missing or extraneous packages

# Step 3: Verify TypeScript path mappings
cat tsconfig.json | grep -A 10 "paths"

# Step 4: Check if specific package is installed
npm list package-name

# Step 5: Verify Next.js cache
ls -la frontend/.next/

# Step 6: Check for case sensitivity issues (especially on macOS)
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "component/Button"
# vs
find src -name "Button.*"
```

**Advanced Solutions:**

1. **Complete Dependency Reset:**
   ```bash
   # Nuclear option - complete cleanup and reinstall

   # Frontend
   cd frontend
   rm -rf node_modules .next package-lock.json
   npm cache clean --force
   npm install

   # Backend
   cd ../backend
   rm -rf node_modules dist package-lock.json
   npm cache clean --force
   npm install
   npx prisma generate  # Regenerate Prisma client

   # Verify installations
   npm list --depth=0
   ```

2. **Fix TypeScript Path Resolution:**
   ```json
   // In frontend/tsconfig.json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./*"],
         "@/components/*": ["./components/*"],
         "@/lib/*": ["./lib/*"],
         "@/app/*": ["./app/*"]
       },
       "moduleResolution": "bundler",  // For Next.js 13+
       "resolveJsonModule": true,
       "isolatedModules": true
     },
     "include": [
       "next-env.d.ts",
       "**/*.ts",
       "**/*.tsx",
       ".next/types/**/*.ts"
     ],
     "exclude": ["node_modules"]
   }

   // Restart TypeScript server in VS Code
   // CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"
   ```

3. **Fix Next.js Import Resolution:**
   ```javascript
   // In frontend/next.config.js
   const path = require('path');

   module.exports = {
     webpack: (config) => {
       config.resolve.alias = {
         ...config.resolve.alias,
         '@': path.resolve(__dirname),
         '@/components': path.resolve(__dirname, 'components'),
         '@/lib': path.resolve(__dirname, 'lib'),
       };
       return config;
     },
   };
   ```

4. **Handle Prisma Client Generation Issues:**
   ```bash
   # If Prisma client is not found
   cd backend

   # Clear Prisma cache
   rm -rf node_modules/.prisma
   rm -rf node_modules/@prisma

   # Reinstall Prisma
   npm install prisma @prisma/client --save-dev

   # Generate client with verbose output
   npx prisma generate --schema=./prisma/schema.prisma

   # Verify generation
   ls -la node_modules/.prisma/client/
   ```

5. **Fix Peer Dependency Conflicts:**
   ```bash
   # Check for conflicts
   npm ls
   # Look for UNMET PEER DEPENDENCY warnings

   # Option 1: Use legacy peer deps (quick fix)
   npm install --legacy-peer-deps

   # Option 2: Use force (not recommended)
   npm install --force

   # Option 3: Update conflicting packages (recommended)
   npm update package-name

   # Option 4: Use npm overrides (package.json)
   {
     "overrides": {
       "package-name": "^specific-version"
     }
   }
   ```

#### Issue 6: TypeScript Type Errors in Production Build

**Symptom:** "Type error: Property 'xyz' does not exist on type" during `npm run build`

**Diagnosis:**
```bash
# Run full type check
npx tsc --noEmit

# Check TypeScript configuration
npx tsc --showConfig

# Find all type errors with details
npx tsc --noEmit --pretty false | tee type-errors.log

# Check specific file
npx tsc --noEmit path/to/file.ts
```

**Solutions:**

1. **Fix Strict Type Issues:**
   ```typescript
   // Problem: Accessing property on potentially undefined object
   const user = await prisma.user.findUnique({ where: { id } });
   console.log(user.name); // Error: Object is possibly 'null'

   // Solution 1: Optional chaining
   console.log(user?.name);

   // Solution 2: Null assertion (use with caution)
   console.log(user!.name);

   // Solution 3: Proper null check (recommended)
   if (user) {
     console.log(user.name);
   }

   // Problem: Type mismatch in function parameters
   function greet(name: string) {
     return `Hello, ${name}`;
   }
   const username: string | null = getUsername();
   greet(username); // Error: Argument of type 'string | null' is not assignable

   // Solution: Type guard
   if (username) {
     greet(username);
   }
   ```

2. **Fix Missing Type Definitions:**
   ```bash
   # Install type definitions for packages that don't include them
   npm install --save-dev @types/node
   npm install --save-dev @types/react
   npm install --save-dev @types/express

   # For custom modules without types
   // Create types/custom.d.ts
   declare module 'untyped-package' {
     export function someFunction(): void;
   }
   ```

3. **Configure TypeScript for Better DX:**
   ```json
   // tsconfig.json - recommended settings
   {
     "compilerOptions": {
       "target": "ES2022",
       "lib": ["ES2022", "DOM", "DOM.Iterable"],
       "module": "ESNext",
       "moduleResolution": "bundler",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,  // Skip checking node_modules types
       "forceConsistentCasingInFileNames": true,
       "resolveJsonModule": true,
       "isolatedModules": true,
       "incremental": true,  // Faster rebuilds
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "noFallthroughCasesInSwitch": true,
       "allowJs": false,  // Enforce TypeScript
       "checkJs": false
     }
   }
   ```

### WebSocket and Real-Time Communication Issues

#### Issue 7: WebSocket Connection Failures

**Symptom:** "WebSocket connection to 'ws://localhost:5000' failed" in browser console

**Comprehensive Diagnosis:**
```bash
# Backend: Check if Socket.IO server is initialized
# Look for this in backend logs:
grep -i "socket" backend/logs/*.log

# Test WebSocket endpoint directly
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://localhost:5000/socket.io/

# Frontend: Check browser console for detailed errors
# Open DevTools → Network → WS tab → Look for failed connections

# Check CORS configuration
curl -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS -I http://localhost:5000/socket.io/

# Verify backend is listening on correct port
lsof -i -P | grep :5000
```

**Advanced Solutions:**

1. **Fix Socket.IO CORS Configuration:**
   ```typescript
   // In backend/src/server.ts or socket configuration file
   import { Server } from 'socket.io';
   import { createServer } from 'http';

   const httpServer = createServer(app);
   const io = new Server(httpServer, {
     cors: {
       origin: [
         'http://localhost:3000',
         'http://localhost:3001',
         process.env.CLIENT_URL
       ].filter(Boolean),
       methods: ['GET', 'POST'],
       credentials: true,
       allowedHeaders: ['Content-Type', 'Authorization']
     },
     // Connection settings
     pingTimeout: 60000,
     pingInterval: 25000,
     transports: ['websocket', 'polling'],  // Try websocket first
     // Enable upgrade from polling to websocket
     allowUpgrades: true,
     // Cookie settings for sticky sessions
     cookie: {
       name: 'io',
       httpOnly: true,
       sameSite: 'lax'
     }
   });
   ```

2. **Implement Reconnection Logic on Frontend:**
   ```typescript
   // In frontend/lib/websocket-context.tsx
   import { io, Socket } from 'socket.io-client';
   import { useEffect, useState } from 'react';

   export function useWebSocket() {
     const [socket, setSocket] = useState<Socket | null>(null);
     const [isConnected, setIsConnected] = useState(false);
     const [reconnectAttempt, setReconnectAttempt] = useState(0);

     useEffect(() => {
       const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
         transports: ['websocket', 'polling'],
         reconnection: true,
         reconnectionAttempts: 10,
         reconnectionDelay: 1000,
         reconnectionDelayMax: 5000,
         timeout: 20000,
         autoConnect: true,
         withCredentials: true,
         auth: {
           token: localStorage.getItem('accessToken')
         }
       });

       socketInstance.on('connect', () => {
         console.log('[WebSocket] Connected:', socketInstance.id);
         setIsConnected(true);
         setReconnectAttempt(0);
       });

       socketInstance.on('disconnect', (reason) => {
         console.warn('[WebSocket] Disconnected:', reason);
         setIsConnected(false);

         if (reason === 'io server disconnect') {
           // Server disconnected, manually reconnect
           socketInstance.connect();
         }
       });

       socketInstance.on('connect_error', (error) => {
         console.error('[WebSocket] Connection Error:', error.message);
         setReconnectAttempt(prev => prev + 1);

         // If auth error, refresh token and retry
         if (error.message.includes('authentication')) {
           refreshAuthToken().then(() => {
             socketInstance.auth = {
               token: localStorage.getItem('accessToken')
             };
             socketInstance.connect();
           });
         }
       });

       socketInstance.on('reconnect', (attemptNumber) => {
         console.log('[WebSocket] Reconnected after', attemptNumber, 'attempts');
       });

       socketInstance.on('reconnect_attempt', (attemptNumber) => {
         console.log('[WebSocket] Reconnection attempt', attemptNumber);
       });

       socketInstance.on('reconnect_error', (error) => {
         console.error('[WebSocket] Reconnection error:', error);
       });

       socketInstance.on('reconnect_failed', () => {
         console.error('[WebSocket] Reconnection failed after all attempts');
         // Notify user to refresh page
       });

       setSocket(socketInstance);

       return () => {
         socketInstance.disconnect();
       };
     }, []);

     return { socket, isConnected, reconnectAttempt };
   }
   ```

3. **Handle WebSocket Behind Reverse Proxy (Nginx):**
   ```nginx
   # /etc/nginx/sites-available/nestquarter
   server {
     listen 80;
     server_name api.nestquarter.com;

     # WebSocket specific headers
     location /socket.io/ {
       proxy_pass http://localhost:5000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;

       # Timeout settings for long-lived connections
       proxy_read_timeout 86400;
       proxy_send_timeout 86400;
       proxy_connect_timeout 86400;

       # Disable buffering for WebSocket
       proxy_buffering off;
     }

     # Regular HTTP endpoints
     location / {
       proxy_pass http://localhost:5000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }
   }
   ```

4. **Debug WebSocket Events:**
   ```typescript
   // Add comprehensive logging
   socket.onAny((eventName, ...args) => {
     console.log('[WebSocket Event]', eventName, args);
   });

   socket.onAnyOutgoing((eventName, ...args) => {
     console.log('[WebSocket Outgoing]', eventName, args);
   });

   // Monitor connection lifecycle
   const events = [
     'connect',
     'disconnect',
     'connect_error',
     'connect_timeout',
     'reconnect',
     'reconnect_attempt',
     'reconnecting',
     'reconnect_error',
     'reconnect_failed',
     'ping',
     'pong'
   ];

   events.forEach(event => {
     socket.on(event, (...args) => {
       console.log(`[WebSocket] ${event}:`, ...args);
     });
   });
   ```

### Environment Variable and Configuration Issues

#### Issue 8: Environment Variables Not Loading

**Symptom:** "undefined" values for environment variables, or features not working despite correct .env file

**Diagnosis:**
```bash
# Check if .env files exist
ls -la frontend/.env*
ls -la backend/.env*

# Print environment variables (be careful in production)
# Frontend (Next.js)
cd frontend
npm run dev -- --debug 2>&1 | grep NEXT_PUBLIC

# Backend
cd backend
node -e "console.log(process.env)" | grep -i database

# Check for syntax errors in .env
cat backend/.env | grep -E "^[^#]" | grep -v "^$"

# Verify .env is not in .gitignore
git check-ignore -v .env

# Test loading with dotenv directly
node -r dotenv/config -e "console.log(process.env.DATABASE_URL)"
```

**Solutions:**

1. **Fix Next.js Environment Variable Loading:**
   ```bash
   # Next.js requires NEXT_PUBLIC_ prefix for client-side variables

   # WRONG - won't work in browser
   API_URL=http://localhost:5000

   # CORRECT - accessible in browser
   NEXT_PUBLIC_API_URL=http://localhost:5000

   # Restart dev server after changing .env.local
   # Next.js caches environment variables
   pkill -f "next dev"
   npm run dev
   ```

2. **Ensure Correct .env File Location:**
   ```bash
   # Frontend structure
   frontend/
   ├── .env.local          # Local overrides (gitignored)
   ├── .env.development    # Development defaults
   ├── .env.production     # Production defaults
   └── .env                # Base file (optional)

   # Backend structure
   backend/
   └── .env                # All backend config (gitignored)

   # Next.js loads .env files in this order (later overrides earlier):
   # 1. .env
   # 2. .env.local
   # 3. .env.[development|production]
   # 4. .env.[development|production].local
   ```

3. **Fix Multiline Environment Variables:**
   ```env
   # Problem: Private keys with newlines

   # Solution 1: Use \n explicitly
   PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\n-----END PRIVATE KEY-----"

   # Solution 2: Base64 encode
   PRIVATE_KEY_BASE64="LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUVW..."

   # Then decode in code:
   const privateKey = Buffer.from(process.env.PRIVATE_KEY_BASE64!, 'base64').toString('ascii');
   ```

4. **Validate Environment Variables on Startup:**
   ```typescript
   // In backend/src/config/env.ts
   import { z } from 'zod';

   const envSchema = z.object({
     NODE_ENV: z.enum(['development', 'production', 'test']),
     PORT: z.string().regex(/^\d+$/).transform(Number),
     DATABASE_URL: z.string().url(),
     REDIS_URL: z.string().url(),
     JWT_SECRET: z.string().min(32),
     JWT_REFRESH_SECRET: z.string().min(32),
     SENDGRID_API_KEY: z.string().optional(),
     CLOUDINARY_CLOUD_NAME: z.string().optional(),
   });

   export function validateEnv() {
     try {
       const env = envSchema.parse(process.env);
       console.log('✓ Environment variables validated successfully');
       return env;
     } catch (error) {
       console.error('✗ Invalid environment variables:');
       if (error instanceof z.ZodError) {
         error.errors.forEach(err => {
           console.error(`  - ${err.path.join('.')}: ${err.message}`);
         });
       }
       process.exit(1);
     }
   }

   // Call in server.ts before starting
   validateEnv();
   ```

5. **Fix Docker Environment Variables:**
   ```dockerfile
   # In Dockerfile, use ARG for build-time and ENV for runtime

   # Build-time variables
   ARG NODE_ENV=production

   # Runtime variables
   ENV NODE_ENV=${NODE_ENV}
   ENV PORT=5000

   # Pass from docker-compose.yml
   ```

   ```yaml
   # docker-compose.yml
   version: '3.8'
   services:
     backend:
       build: ./backend
       env_file:
         - ./backend/.env
       environment:
         - DATABASE_URL=${DATABASE_URL}
         - REDIS_URL=redis://redis:6379
       ports:
         - "5000:5000"
   ```

### Build and Deployment Issues

#### Issue 9: Production Build Failures

**Symptom:** `npm run build` fails with errors, works fine in development

**Diagnosis:**
```bash
# Run build with verbose logging
npm run build -- --debug 2>&1 | tee build.log

# Check for build warnings
npm run build 2>&1 | grep -i warning

# Verify production dependencies are installed
npm ls --production

# Check disk space
df -h

# Check memory usage during build
# Run in separate terminal while building
watch -n 1 free -h

# Test production build locally
npm run build
npm run start
# Then test at http://localhost:3000
```

**Solutions:**

1. **Fix Next.js Build Memory Issues:**
   ```bash
   # Increase Node.js memory limit
   # In package.json scripts:
   {
     "scripts": {
       "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
     }
   }

   # Or set environment variable
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build
   ```

2. **Fix Static Generation Errors:**
   ```typescript
   // In frontend/next.config.js
   module.exports = {
     // Disable static optimization for specific pages
     experimental: {
       isrMemoryCacheSize: 0, // Disable ISR caching
     },

     // Handle missing environment variables gracefully
     env: {
       CUSTOM_VAR: process.env.CUSTOM_VAR || 'default_value',
     },

     // Skip TypeScript/ESLint checks during build (not recommended)
     typescript: {
       ignoreBuildErrors: false, // Set to true only if absolutely necessary
     },
     eslint: {
       ignoreDuringBuilds: false,
     },
   };
   ```

3. **Fix TypeScript Compilation Errors:**
   ```bash
   # Run full type check before build
   npx tsc --noEmit --skipLibCheck false

   # Check for circular dependencies
   npx madge --circular --extensions ts,tsx src/

   # Fix common issues
   # 1. Remove unused imports
   npx eslint --fix "**/*.{ts,tsx}"

   # 2. Update deprecated APIs
   npm outdated
   npm update
   ```

4. **Optimize Build Performance:**
   ```javascript
   // next.config.js
   module.exports = {
     // Reduce bundle size
     productionBrowserSourceMaps: false,

     // Optimize images
     images: {
       formats: ['image/avif', 'image/webp'],
       deviceSizes: [640, 750, 828, 1080, 1200, 1920],
       minimumCacheTTL: 60,
     },

     // Enable SWC minification (faster than Terser)
     swcMinify: true,

     // Optimize fonts
     optimizeFonts: true,

     // Reduce JavaScript bundle
     compiler: {
       removeConsole: process.env.NODE_ENV === 'production',
     },
   };
   ```

#### Issue 10: Deployment-Specific Errors

**Symptom:** Works locally but fails in production (Vercel, Railway, etc.)

**Diagnosis:**
```bash
# Check deployment logs
# Vercel
vercel logs <deployment-url>

# Railway
railway logs

# Check environment variables in deployment platform
vercel env ls
railway variables

# Test with production build locally
NODE_ENV=production npm run build
NODE_ENV=production npm run start

# Check for differences in Node versions
node --version
# Compare with deployment platform's Node version
```

**Solutions:**

1. **Fix Vercel Deployment Issues:**
   ```json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "devCommand": "npm run dev",
     "installCommand": "npm install",
     "framework": "nextjs",
     "regions": ["iad1"],
     "env": {
       "NEXT_PUBLIC_API_URL": "https://api.yourapp.com"
     },
     "build": {
       "env": {
         "NODE_ENV": "production",
         "NEXT_TELEMETRY_DISABLED": "1"
       }
     },
     "functions": {
       "app/api/**/*.ts": {
         "memory": 3008,
         "maxDuration": 60
       }
     },
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           }
         ]
       }
     ]
   }
   ```

2. **Fix Railway Backend Deployment:**
   ```json
   // railway.json (optional)
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS",
       "buildCommand": "npm run build"
     },
     "deploy": {
       "startCommand": "npm run start",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

   ```toml
   # Or use nixpacks.toml for more control
   [phases.setup]
   nixPkgs = ["nodejs-18_x", "python3"]

   [phases.install]
   cmds = ["npm ci"]

   [phases.build]
   cmds = ["npm run build", "npx prisma generate", "npx prisma migrate deploy"]

   [start]
   cmd = "npm run start"
   ```

3. **Handle Database Migrations in Production:**
   ```bash
   # In Railway, add build script that runs migrations
   # package.json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/server.js",
       "railway:start": "npx prisma migrate deploy && npm run start"
     }
   }

   # Set START_COMMAND in Railway to: npm run railway:start
   ```

4. **Fix CORS in Production:**
   ```typescript
   // backend/src/server.ts
   import cors from 'cors';

   const allowedOrigins = [
     'http://localhost:3000',
     process.env.CLIENT_URL,
     'https://yourapp.vercel.app',
     'https://www.yourapp.com'
   ].filter(Boolean);

   app.use(cors({
     origin: (origin, callback) => {
       // Allow requests with no origin (mobile apps, Postman, etc.)
       if (!origin) return callback(null, true);

       if (allowedOrigins.includes(origin)) {
         callback(null, true);
       } else {
         console.warn('CORS blocked request from:', origin);
         callback(new Error('Not allowed by CORS'));
       }
     },
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization'],
     exposedHeaders: ['X-Total-Count'],
     maxAge: 86400 // 24 hours
   }));

   // Handle preflight
   app.options('*', cors());
   ```

### Security and Authentication Issues

#### Issue 11: JWT Token Expiration and Refresh Problems

**Symptom:** Users getting logged out unexpectedly, "Token expired" errors

**Diagnosis:**
```typescript
// Add logging to track token lifecycle
console.log('Token issued at:', new Date().toISOString());
console.log('Token expires at:', new Date(Date.now() + 15 * 60 * 1000).toISOString());

// Decode JWT to inspect
const jwt = require('jsonwebtoken');
const decoded = jwt.decode(token, { complete: true });
console.log('Token payload:', decoded.payload);
console.log('Token expiry:', new Date(decoded.payload.exp * 1000));
```

**Solutions:**

1. **Implement Robust Token Refresh:**
   ```typescript
   // frontend/lib/api-client.ts
   import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

   const api = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_URL,
     withCredentials: true
   });

   let isRefreshing = false;
   let failedQueue: Array<{
     resolve: (value?: unknown) => void;
     reject: (reason?: any) => void;
   }> = [];

   const processQueue = (error: Error | null, token: string | null = null) => {
     failedQueue.forEach(prom => {
       if (error) {
         prom.reject(error);
       } else {
         prom.resolve(token);
       }
     });
     failedQueue = [];
   };

   // Request interceptor
   api.interceptors.request.use(
     (config: InternalAxiosRequestConfig) => {
       const token = localStorage.getItem('accessToken');
       if (token && config.headers) {
         config.headers.Authorization = `Bearer ${token}`;
       }
       return config;
     },
     (error) => Promise.reject(error)
   );

   // Response interceptor
   api.interceptors.response.use(
     (response) => response,
     async (error: AxiosError) => {
       const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

       if (error.response?.status === 401 && !originalRequest._retry) {
         if (isRefreshing) {
           // Queue requests while refreshing
           return new Promise((resolve, reject) => {
             failedQueue.push({ resolve, reject });
           })
             .then(token => {
               if (originalRequest.headers) {
                 originalRequest.headers.Authorization = `Bearer ${token}`;
               }
               return api(originalRequest);
             })
             .catch(err => Promise.reject(err));
         }

         originalRequest._retry = true;
         isRefreshing = true;

         try {
           const refreshToken = localStorage.getItem('refreshToken');
           const { data } = await axios.post(
             `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
             { refreshToken }
           );

           localStorage.setItem('accessToken', data.accessToken);
           localStorage.setItem('refreshToken', data.refreshToken);

           api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
           processQueue(null, data.accessToken);

           if (originalRequest.headers) {
             originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
           }

           return api(originalRequest);
         } catch (refreshError) {
           processQueue(refreshError as Error, null);

           // Refresh failed, log out user
           localStorage.removeItem('accessToken');
           localStorage.removeItem('refreshToken');
           window.location.href = '/auth/login';

           return Promise.reject(refreshError);
         } finally {
           isRefreshing = false;
         }
       }

       return Promise.reject(error);
     }
   );

   export default api;
   ```

2. **Implement Sliding Session:**
   ```typescript
   // backend/src/middleware/auth.middleware.ts
   export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
     try {
       const token = req.headers.authorization?.split(' ')[1];

       if (!token) {
         return res.status(401).json({ error: 'No token provided' });
       }

       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

       // Check if token is close to expiry (within 5 minutes)
       const tokenExp = decoded.exp!;
       const now = Math.floor(Date.now() / 1000);
       const timeUntilExpiry = tokenExp - now;

       if (timeUntilExpiry < 300) {
         // Issue new token
         const newToken = jwt.sign(
           { userId: decoded.userId, role: decoded.role },
           process.env.JWT_SECRET!,
           { expiresIn: '15m' }
         );

         // Send new token in response header
         res.setHeader('X-New-Token', newToken);
       }

       req.user = decoded;
       next();
     } catch (error) {
       if (error instanceof jwt.TokenExpiredError) {
         return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
       }
       return res.status(401).json({ error: 'Invalid token' });
     }
   };
   ```

#### Issue 12: Rate Limiting and Performance Under Load

**Symptom:** API returns 429 Too Many Requests, slow response times during traffic spikes

**Solutions:**

1. **Implement Distributed Rate Limiting with Redis:**
   ```typescript
   // backend/src/middleware/rateLimiter.middleware.ts
   import rateLimit from 'express-rate-limit';
   import RedisStore from 'rate-limit-redis';
   import { redis } from '../config/redis';

   export const apiLimiter = rateLimit({
     store: new RedisStore({
       client: redis,
       prefix: 'rl:api:',
     }),
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // Limit each IP to 100 requests per windowMs
     message: 'Too many requests from this IP, please try again later',
     standardHeaders: true,
     legacyHeaders: false,
     // Skip rate limiting for trusted IPs
     skip: (req) => {
       const trustedIPs = ['127.0.0.1', '::1'];
       const ip = req.ip || req.socket.remoteAddress;
       return trustedIPs.includes(ip!);
     },
     // Custom key generator (e.g., by user ID instead of IP)
     keyGenerator: (req) => {
       return req.user?.id || req.ip || 'unknown';
     },
     // Handle rate limit exceeded
     handler: (req, res) => {
       res.status(429).json({
         error: 'Too many requests',
         retryAfter: res.getHeader('Retry-After'),
       });
     },
   });

   // Stricter limits for authentication endpoints
   export const authLimiter = rateLimit({
     store: new RedisStore({
       client: redis,
       prefix: 'rl:auth:',
     }),
     windowMs: 15 * 60 * 1000,
     max: 5, // Only 5 login attempts per 15 minutes
     skipSuccessfulRequests: true, // Don't count successful requests
   });
   ```

2. **Implement Request Caching:**
   ```typescript
   // backend/src/middleware/cache.middleware.ts
   import { Request, Response, NextFunction } from 'express';
   import { redis } from '../config/redis';

   export const cacheMiddleware = (duration: number = 300) => {
     return async (req: Request, res: Response, next: NextFunction) => {
       // Only cache GET requests
       if (req.method !== 'GET') {
         return next();
       }

       // Generate cache key from URL and query params
       const cacheKey = `cache:${req.originalUrl || req.url}`;

       try {
         // Check if cached response exists
         const cachedResponse = await redis.get(cacheKey);

         if (cachedResponse) {
           console.log('[Cache] HIT:', cacheKey);
           res.setHeader('X-Cache', 'HIT');
           return res.json(JSON.parse(cachedResponse));
         }

         console.log('[Cache] MISS:', cacheKey);
         res.setHeader('X-Cache', 'MISS');

         // Store original json method
         const originalJson = res.json.bind(res);

         // Override json method to cache response
         res.json = function(body: any) {
           // Cache the response
           redis.setex(cacheKey, duration, JSON.stringify(body))
             .catch(err => console.error('[Cache] Error storing:', err));

           // Send response
           return originalJson(body);
         };

         next();
       } catch (error) {
         console.error('[Cache] Error:', error);
         next();
       }
     };
   };

   // Usage in routes:
   // app.get('/api/properties', cacheMiddleware(300), getProperties);
   ```

3. **Database Connection Pooling:**
   ```typescript
   // backend/prisma/schema.prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     // Configure connection pool
     relationMode = "prisma"
   }

   // In DATABASE_URL:
   // postgresql://user:password@host:5432/db?connection_limit=20&pool_timeout=20&connect_timeout=10
   ```

### Advanced Debugging Techniques

#### Issue 13: Memory Leaks

**Diagnosis:**
```bash
# Generate heap snapshot
node --inspect backend/dist/server.js
# Then open chrome://inspect and take heap snapshots

# Use clinic.js for performance profiling
npm install -g clinic
clinic doctor -- node backend/dist/server.js

# Monitor memory usage
node --expose-gc --trace-gc backend/dist/server.js

# Use autocannon for load testing
npm install -g autocannon
autocannon -c 100 -d 60 http://localhost:5000/api/properties
```

**Solutions:**

1. **Prevent Common Memory Leaks:**
   ```typescript
   // Problem: Event listeners not cleaned up
   useEffect(() => {
     const handleResize = () => console.log('resized');
     window.addEventListener('resize', handleResize);

     // Solution: Cleanup function
     return () => {
       window.removeEventListener('resize', handleResize);
     };
   }, []);

   // Problem: Timers not cleared
   useEffect(() => {
     const timer = setInterval(() => fetchData(), 5000);

     // Solution: Clear on unmount
     return () => {
       clearInterval(timer);
     };
   }, []);

   // Problem: Unclosed database connections
   app.on('SIGTERM', async () => {
     console.log('SIGTERM received, closing connections...');
     await prisma.$disconnect();
     await redis.quit();
     server.close(() => {
       console.log('Server closed');
       process.exit(0);
     });
   });
   ```

This comprehensive troubleshooting guide covers real-world issues and advanced solutions. Each section provides detailed diagnosis steps and multiple solution approaches for complex problems.

## Deployment Guide

### Frontend Deployment (Vercel)

Vercel is the recommended platform for deploying Next.js applications.

**Preparation:**

1. Ensure all code is committed and pushed to GitHub
2. Create production environment variables
3. Test production build locally:
   ```bash
   cd frontend
   npm run build
   npm run start
   ```

**Deployment Steps:**

1. **Create Vercel Account:**
   - Visit https://vercel.com
   - Sign up with GitHub account

2. **Import Project:**
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project:**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Environment Variables:**
   Add all variables from `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_production_key
   NODE_ENV=production
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Access your app at `https://your-project.vercel.app`

**Continuous Deployment:**
- Every push to main branch triggers automatic deployment
- Preview deployments for pull requests
- Instant rollback to previous deployments

### Backend Deployment (Railway)

Railway offers simple PostgreSQL and Redis hosting alongside your Node.js application.

**Deployment Steps:**

1. **Create Railway Account:**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Add Services:**
   ```
   - Add PostgreSQL database
   - Add Redis database
   - Add Node.js service (your backend)
   ```

4. **Configure Backend Service:**
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm run start`
   - Watch Paths: `backend/**`

5. **Environment Variables:**
   Railway auto-populates DATABASE_URL and REDIS_URL. Add remaining variables:
   ```
   NODE_ENV=production
   PORT=5000
   CLIENT_URL=https://your-frontend.vercel.app
   JWT_SECRET=production_secret_key
   JWT_REFRESH_SECRET=production_refresh_secret
   SENDGRID_API_KEY=your_key
   CLOUDINARY_CLOUD_NAME=your_cloud
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   STRIPE_SECRET_KEY=your_production_key
   ```

6. **Run Migrations:**
   - In Railway dashboard, open backend service
   - Go to "Deploy" → "Custom Start Command"
   - Run: `npx prisma migrate deploy && npm start`

7. **Generate Domain:**
   - Railway provides a public domain
   - Copy the URL (e.g., `https://backend-production.up.railway.app`)
   - Update NEXT_PUBLIC_API_URL in Vercel

### Alternative Deployment (Render)

**Backend on Render:**

1. Create new Web Service
2. Connect GitHub repository
3. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build && npx prisma migrate deploy`
   - Start Command: `npm start`
4. Add PostgreSQL database
5. Add Redis instance
6. Configure environment variables

**Frontend on Render:**

1. Create new Static Site
2. Connect GitHub repository
3. Configure:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `.next`

### Production Checklist

Before deploying to production, verify:

- [ ] All environment variables set correctly
- [ ] Strong JWT secrets generated
- [ ] Database migrations applied
- [ ] Email service configured and tested
- [ ] Payment gateway in production mode
- [ ] CORS configured for production URLs
- [ ] HTTPS enabled
- [ ] Error logging configured (Sentry, etc.)
- [ ] Rate limiting enabled
- [ ] Database backups scheduled
- [ ] SSL certificates valid
- [ ] DNS records configured
- [ ] Monitor and alerting set up

### Post-Deployment

**Monitor Application:**
- Check error logs regularly
- Set up uptime monitoring (UptimeRobot, StatusCake)
- Configure performance monitoring
- Review user analytics

**Database Maintenance:**
- Schedule regular backups
- Monitor query performance
- Optimize slow queries
- Plan for scaling

## Contributing

Contributions to NestQuarter are welcome and appreciated. Whether you're fixing bugs, improving documentation, or adding new features, your input helps make the platform better for everyone.

### Getting Started

1. **Fork the repository:**
   - Click "Fork" button on GitHub
   - Clone your fork locally

2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # or for bug fixes
   git checkout -b fix/bug-description
   ```

3. **Make your changes:**
   - Write clean, readable code
   - Follow existing code style and conventions
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes:**
   - Ensure all existing tests pass
   - Add new tests for new features
   - Test manually in development environment

5. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add feature: description of your changes"
   ```

   Use meaningful commit messages:
   - `feat: add property comparison feature`
   - `fix: resolve booking date validation issue`
   - `docs: update installation instructions`
   - `refactor: optimize database queries`

6. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request:**
   - Go to original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Provide detailed description of changes
   - Link any related issues

### Code Style Guidelines

**TypeScript:**
- Use TypeScript for all new code
- Define proper types, avoid `any`
- Use interfaces for object shapes
- Document complex functions with JSDoc comments

**React Components:**
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use meaningful component and prop names

**Formatting:**
- Use Prettier for code formatting
- Follow ESLint rules
- Use 2 spaces for indentation
- Add semicolons at end of statements

**File Organization:**
- Group related files together
- Use barrel exports (index.ts) when appropriate
- Keep file names descriptive and consistent

### Pull Request Guidelines

A good pull request should:

1. **Have a clear purpose:**
   - Fix a specific bug
   - Add a specific feature
   - Improve specific documentation

2. **Be properly tested:**
   - All tests pass
   - New tests added for new functionality
   - Manual testing performed

3. **Include documentation:**
   - Code comments for complex logic
   - Updated README if needed
   - API documentation for new endpoints

4. **Be reasonably sized:**
   - Focus on one issue or feature
   - Split large changes into multiple PRs
   - Make code review easier

5. **Follow conventions:**
   - Match existing code style
   - Use consistent naming
   - Follow project structure

### Issue Reporting

When reporting bugs or requesting features:

**Bug Reports Should Include:**
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, versions)
- Screenshots or error messages
- Relevant code snippets

**Feature Requests Should Include:**
- Clear description of proposed feature
- Use cases and benefits
- Potential implementation approach
- Mockups or examples (if applicable)

## License

This project is licensed under the MIT License. This means you are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the software, subject to the following conditions:

- The above copyright notice and this permission notice shall be included in all copies or substantial portions of the software.
- The software is provided "as is", without warranty of any kind.

See the LICENSE file in the repository for the full license text.

## Project Team

**Developer:** Kaan Erol
- GitHub: [@kaan7305](https://github.com/kaan7305)
- Repository: [github.com/kaan7305/subletting](https://github.com/kaan7305/subletting)

## Support and Contact

If you encounter issues or have questions about NestQuarter:

**For Bugs and Technical Issues:**
1. Check the Troubleshooting section above
2. Search existing issues: [GitHub Issues](https://github.com/kaan7305/subletting/issues)
3. If your issue is not covered, create a new issue with:
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - System information
   - Screenshots if applicable

**For Feature Requests:**
- Open a new issue with the "enhancement" label
- Describe the feature and its benefits
- Provide examples or mockups if possible

**For General Questions:**
- Check documentation in this README
- Review code comments and inline documentation
- Consult Next.js and React documentation for framework-specific questions

## Acknowledgments

NestQuarter is built with the support of many excellent open-source projects and tools:

**Core Technologies:**
- [Next.js](https://nextjs.org/) - React framework for production-grade applications
- [React](https://react.dev/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript
- [Express](https://expressjs.com/) - Fast, unopinionated web framework for Node.js

**Supporting Libraries:**
- [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management
- [Socket.io](https://socket.io/) - Real-time bidirectional communication
- [Lucide React](https://lucide.dev/) - Beautiful and consistent icon library
- [React Hook Form](https://react-hook-form.com/) - Performant form validation
- [Zod](https://zod.dev/) - TypeScript-first schema validation

**Infrastructure:**
- [Vercel](https://vercel.com/) - Frontend deployment platform
- [Railway](https://railway.app/) - Backend and database hosting
- [PostgreSQL](https://www.postgresql.org/) - Powerful relational database
- [Redis](https://redis.io/) - In-memory data structure store

Thank you to all contributors and maintainers of these projects for making modern web development accessible and enjoyable.

---

**Built for students, by developers who understand the challenges of finding quality housing.**
