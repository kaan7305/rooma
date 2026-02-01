# NestQuarter Backend API

Global student housing platform backend built with Express.js and Supabase.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Build the project
npm run build

# Start development server
npm run dev
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Note**: Tests require a valid Supabase connection. Make sure your `.env` file has correct Supabase credentials before running tests.

## 📚 API Documentation

The API is available at `http://localhost:5000/api`

### Main Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/users/me` - Get current user profile
- `GET /api/properties` - List properties
- `POST /api/properties` - Create property (host only)
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking

## 🛠️ Development

```bash
# Development mode with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## 📦 Project Structure

```
backend/
├── src/
│   ├── __tests__/       # Test files
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── validators/      # Request validators
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
└── package.json
```

## 🔧 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **Validation**: Zod
- **Testing**: Jest + Supertest

## 📄 License

MIT
