# ROOMA - Global Student Housing Platform

ROOMA is a comprehensive full-stack platform designed to connect students with verified housing opportunities worldwide. The application leverages modern web technologies to provide a seamless experience for both property seekers and hosts, featuring real-time communication, advanced search capabilities, and intelligent property recommendations.

## Overview

This platform addresses the critical need for reliable, student-friendly housing solutions across different cities and countries. Built with scalability and user experience in mind, ROOMA offers a feature-rich environment where students can discover, compare, and book accommodation while hosts can efficiently manage their properties and communicate with potential tenants.

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

**Database**
- Supabase (PostgreSQL) as the primary relational database
- Supabase client for type-safe database queries
- Managed backups and monitoring via Supabase

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
  - GitLens for enhanced Git integration
  - Error Lens for inline error display

**API Testing**
- Postman, Insomnia, or similar REST client
- WebSocket testing tool for real-time feature verification

**Database Management**
- TablePlus, DBeaver, or pgAdmin for visual database exploration
- Redis Desktop Manager or Medis for Redis database inspection

## Detailed Installation Instructions

This section provides comprehensive step-by-step instructions for setting up the ROOMA platform on your local development environment. Follow each step carefully to ensure proper configuration.

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
# Including TypeScript, Express, Supabase client, and all other server dependencies
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

# Install nodemon globally
npm install -g nodemon
```

### Step 4: Supabase Configuration

This project uses Supabase directly (no Prisma). Configure:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- (Optional) `EMAIL_VERIFICATION_SECRET`

See `backend/DATABASE_SETUP.md` for the full setup steps.

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
  --name ROOMA-redis \
  -p 6379:6379 \
  redis:7-alpine

# Verify container is running
docker ps | grep redis

# Connect to Redis CLI in container
docker exec -it ROOMA-redis redis-cli
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
DATABASE_URL="postgresql://ROOMA_user:your_password@localhost:5432/ROOMA?schema=public"

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
JWT_ISSUER=ROOMA-api

# ============================================
# EMAIL CONFIGURATION (SENDGRID)
# ============================================

# SendGrid API key
# Sign up at: https://sendgrid.com
# Generate API key with Full Access permissions
SENDGRID_API_KEY=

# Sender email address (must be verified in SendGrid)
SENDGRID_FROM_EMAIL=noreply@ROOMA.com

# Sender display name
SENDGRID_FROM_NAME=ROOMA

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
CLOUDINARY_FOLDER=ROOMA/properties

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
AWS_BUCKET_NAME=ROOMA-uploads

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

### Step 7: Supabase Setup

This project uses Supabase directly (no Prisma). Follow the backend guide to configure
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`:

- `backend/DATABASE_SETUP.md`

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
[INFO] Starting ROOMA API Server...
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
psql -U ROOMA_user -d ROOMA -h localhost

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

You should see the ROOMA homepage with:
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
tmux new-session -s ROOMA
# Split window: Ctrl+B then "
# Switch panes: Ctrl+B then arrow keys
# Run backend in one pane, frontend in another
```

### Step 9: Accessing and Testing the Application

With both servers running, you can now access and test the full application.

**Application URLs:**

- **Frontend Application:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Supabase Dashboard:** https://app.supabase.com (your project)
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
   - Use the Supabase dashboard to inspect data structure

Congratulations! Your ROOMA development environment is now fully configured and running. You can begin developing new features or testing existing functionality.

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
│   │   ├── supabase.ts
│   │   ├── redis.ts
│   │   └── socket.ts
│   └── server.ts            # Entry point
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
Use the Supabase dashboard (SQL editor, table editor) for schema changes and data inspection.

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

ROOMA includes a comprehensive dark mode implementation that respects user preferences and system settings.

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

If something goes wrong, check these first:

1. **Environment variables**  
   Verify `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and JWT secrets are set.

2. **Backend logs**  
   Inspect server logs for Supabase auth or query errors.

3. **Supabase dashboard**  
   Confirm the project is running and tables exist.

4. **Port conflicts**  
   Ensure frontend (3000) and backend (5000) ports are free.

5. **Redis**  
   If background jobs are enabled, confirm Redis is running.

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
   - Configure Supabase project (external)
   - Add Redis database (optional, if background jobs enabled)
   - Add Node.js service (your backend)
   ```

4. **Configure Backend Service:**
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm run start`
   - Watch Paths: `backend/**`

5. **Environment Variables:**
   Add your Supabase variables and remaining secrets:
   ```
   NODE_ENV=production
   PORT=5000
   CLIENT_URL=https://your-frontend.vercel.app
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   EMAIL_VERIFICATION_SECRET=your_email_verification_secret
   JWT_SECRET=production_secret_key
   JWT_REFRESH_SECRET=production_refresh_secret
   SENDGRID_API_KEY=your_key
   CLOUDINARY_CLOUD_NAME=your_cloud
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   STRIPE_SECRET_KEY=your_production_key
   ```

6. **Verify Supabase Credentials:**
   - Ensure the Supabase project is provisioned
   - Confirm `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set

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
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Configure environment variables

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

Contributions to ROOMA are welcome and appreciated. Whether you're fixing bugs, improving documentation, or adding new features, your input helps make the platform better for everyone.

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

If you encounter issues or have questions about ROOMA:

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

ROOMA is built with the support of many excellent open-source projects and tools:

**Core Technologies:**
- [Next.js](https://nextjs.org/) - React framework for production-grade applications
- [React](https://react.dev/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
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
